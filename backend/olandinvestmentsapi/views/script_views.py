from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.response import Response
from ..serializers import ScriptSerializer, ChartDataSerializer, TableDataSerializer
from scriptupload.models import Script
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.utils.decorators import method_decorator


# decorate list method with custom schema for custom query parameter
@method_decorator(name='list', decorator=swagger_auto_schema(
    manual_parameters=[
        openapi.Parameter(
            'category',
            openapi.IN_QUERY,
            description="Filter scripts by category ID",
            type=openapi.TYPE_INTEGER
        )
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
        queryset = Script.objects.all().order_by("-created")
        # category query param
        cat = self.request.query_params.get("category", None)
        if cat:
            queryset = queryset.filter(category=cat)
        return queryset


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
        try:
            script = Script.objects.get(pk=pk)
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
        except Script.DoesNotExist:
            return Response({'error': 'Script does not exists'}, status=status.HTTP_404_NOT_FOUND)


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
        try:
            script = Script.objects.get(pk=pk)
            if script.status == 1:
                return Response({"message": "Script is already running"})
            script.run()
            return Response({"message": "Script added to task queue"})
        except Script.DoesNotExist:
            return Response({'error': 'Script does not exists'}, status=status.HTTP_404_NOT_FOUND)
