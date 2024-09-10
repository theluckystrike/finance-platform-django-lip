from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework import status, generics
from rest_framework.response import Response
from ..serializers import ScriptSerializer, ReportSerializer
from scriptupload.models import Report
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.utils.decorators import method_decorator


class ReportViewSet(ModelViewSet):
    '''
    All of the base methods for handling reports including:
    - GET
    - POST (creation)
    - PUT
    - PATCH (updating)
    - DELETE 
    '''
    permission_classes = [IsAuthenticated]
    serializer_class = ReportSerializer
    queryset = Report.objects.all().order_by("-created")


# running reports

# getting report status

class ReportStatusView(APIView):
    """
    GET request to retrieve the status of a report update
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
                        'latest_pdf': openapi.Schema(type=openapi.TYPE_STRING, description='PDF URL'),
                    },
                    example={
                        "status": "success",
                        "latest_pdf": "http://127.0.0.1:8000/mediafiles/scripts-dev/uploaded%204/chart/output_plot.png"
                    }
                )
            ),
            404: openapi.Response(
                description="Report not found",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING, description='Error')
                    },
                    example={
                        "error": "Report does not exist"
                    }
                )
            ),
        }
    )
    def get(self, request, pk):
        try:
            report = Report.objects.get(pk=pk)
            resp = {
                "status": report.status
            }
            if report.status == 'success':
                resp["latest_pdf"] = report.latest_pdf.url if report.latest_pdf else None

            return Response(resp)
        except Report.DoesNotExist:
            return Response({'error': 'Report does not exists'}, status=status.HTTP_404_NOT_FOUND)


class ReportUpdateView(APIView):
    """
    POST request to update a report
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
                        "message": "Report update added to task queue"
                    },
                )
            ),
            404: openapi.Response(
                description="Report not found",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING, description='Error')
                    },
                    example={
                        "error": "Report does not exist"
                    }
                )
            ),
        }
    )
    def post(self, request, pk):
        try:
            report = Report.objects.get(pk=pk)
            if report.status == "running":
                return Response({"message": "Report is already running"})
            report.update(False, f"{request.scheme}://{request.get_host()}")
            return Response({"message": "Report added to task queue"})
        except Report.DoesNotExist:
            return Response({'error': 'Report does not exists'}, status=status.HTTP_404_NOT_FOUND)


# merging reports

# adding new email schedules
