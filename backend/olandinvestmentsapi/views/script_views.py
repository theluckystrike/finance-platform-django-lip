from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.response import Response
from ..serializers import ScriptSerializer, ChartDataSerializer, TableDataSerializer, ScriptSerializerLite, ScriptUploadSerializer
from scriptupload.models import Script
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404
import logging

logger = logging.getLogger('testlogger')


# decorate list method with custom schema for custom query parameter
@method_decorator(name='list', decorator=swagger_auto_schema(
    manual_parameters=[
        openapi.Parameter(
            'category',
            openapi.IN_QUERY,
            description="Filter scripts by parent category ID",
            type=openapi.TYPE_INTEGER
        ),
        openapi.Parameter(
            'subcategory1',
            openapi.IN_QUERY,
            description="Filter scripts by subcategory ID",
            type=openapi.TYPE_INTEGER
        ),
        openapi.Parameter(
            'subcategory2',
            openapi.IN_QUERY,
            description="Filter scripts by sub-subcategory ID",
            type=openapi.TYPE_INTEGER
        ),
        openapi.Parameter(
            'status',
            openapi.IN_QUERY,
            description="Filter scripts by status",
            type=openapi.TYPE_STRING,
            enum=['success', 'failure', 'running']
        ),
    ]
))
class ScriptViewSet(ModelViewSet):
    '''
    All of the base methods for handling scripts including:
    - GET
    - POST (creation)
    - PUT
    - PATCH (updating)
    - DELETE 
    '''
    permission_classes = [IsAuthenticated]
    serializer_class = ScriptSerializer
    queryset = Script.objects.all().order_by("-created")

    def get_queryset(self):
        queryset = super().get_queryset()
        cat = self.request.query_params.get("category", None)
        subcat = self.request.query_params.get("subcategory1", None)
        subsubcat = self.request.query_params.get("subcategory2", None)
        status = self.request.query_params.get("status", None)
        if cat:
            queryset = queryset.filter(
                category__parent_category__parent_category=cat)
        if subcat:
            queryset = queryset.filter(category__parent_category=subcat)
        if subsubcat:
            queryset = queryset.filter(category=subsubcat)
        if status:
            if status in Script.ExecutionStatus.labels:
                queryset = queryset.filter(
                    status=next(value for value, label in Script.ExecutionStatus.choices if status == label))
            else:
                logger.warning(
                    f"[ScriptViewSet] Requested invalid script status query param {status}")

        return queryset

    def get_serializer_class(self):
        if self.action == 'list':
            return ScriptSerializerLite
        elif self.action in ['create', 'partial_update']:
            return ScriptUploadSerializer
        return super().get_serializer_class()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ScriptStatusView(APIView):
    """
    GET request to retrieve the status of a script execution
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={
            200: openapi.Response(
                description="Status retrieved",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'status': openapi.Schema(
                            type=openapi.TYPE_STRING,
                            description='Current status of the execution',
                            enum=['success', 'running', 'failure']
                        ),
                        'error_message': openapi.Schema(type=openapi.TYPE_STRING, description='Execution output or log'),
                        'chart_data': openapi.Schema(type=openapi.TYPE_OBJECT, description='Chart data info'),
                        'table_data': openapi.Schema(type=openapi.TYPE_OBJECT, description='Table data info')
                    },
                    example={
                        "status": "success",
                        "chart_data": {
                            "id": 20,
                            "image_file": "http://127.0.0.1:8000/mediafiles/scripts-dev/uploaded%204/chart/output_plot.png",
                            "created": "2024-09-06T19:52:49.458525Z",
                            "last_updated": None
                        }
                    }
                )
            ),
            404: openapi.Response(
                description="Script not found",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING, description='Error')
                    },
                    example={
                        "error": "Script does not exist"
                    }
                )
            ),
        }
    )
    def get(self, request, pk):
        script = get_object_or_404(Script, pk=pk)
        resp = {
            "status": script.get_status_display()
        }
        if script.status == 2:
            resp['error_message'] = script.error_message
        if script.status == 0:
            # context required to return full URLs
            if script.has_chart_data:
                resp["chart_data"] = ChartDataSerializer(
                    script.chart_data, context={'request': request}).data
            if script.has_table_data:
                resp["table_data"] = TableDataSerializer(
                    script.table_data, context={'request': request}).data
        return Response(resp)


class ScriptRunView(APIView):
    """
    POST request to run a script
    """
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={
            200: openapi.Response(
                description="Status retrieved",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'message': openapi.Schema(type=openapi.TYPE_STRING, description='Message')
                    },
                    example={
                        "message": "Script added to task queue"
                    },
                )
            ),
            404: openapi.Response(
                description="Script not found",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING, description='Error')
                    },
                    example={
                        "error": "Script does not exist"
                    }
                )
            ),
        }
    )
    def post(self, request, pk):
        script = get_object_or_404(Script, pk=pk)
        if script.status == 1:
            return Response({"message": "Script is already running"})
        script.run()
        return Response({"message": "Script added to task queue"})
