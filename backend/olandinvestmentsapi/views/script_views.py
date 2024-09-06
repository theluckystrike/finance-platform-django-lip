from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework import status, generics
from rest_framework.response import Response
from ..serializers import ScriptSerializer
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
            type=openapi.TYPE_STRING
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
    # permission_classes = [IsAuthenticated]
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
                        'error_message': openapi.Schema(type=openapi.TYPE_STRING, description='Execution output or log')
                    },
                    example={
                        "status": "failure",
                        "output": "Syntax error on line 9 '-'"
                    }
                )
            ),
            404: openapi.Response(
                description="Execution not found",
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

            return Response(resp)
        except Script.DoesNotExist:
            return Response({'error': 'Script does not exists'}, status=status.HTTP_404_NOT_FOUND)
