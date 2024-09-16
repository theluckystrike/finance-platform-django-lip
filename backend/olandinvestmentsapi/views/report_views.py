from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from ..serializers import ReportSerializer, ReportEmailTaskSerializer
from scriptupload.models import Report, merge_reports, ReportEmailTask
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


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
            report = get_object_or_404(Report, pk=pk)
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
            report = get_object_or_404(Report, pk=pk)
            if report.status == "running":
                return Response({"message": "Report is already running"})
            report.update(False, f"{request.scheme}://{request.get_host()}")
            return Response({"message": "Report added to task queue"})
        except Report.DoesNotExist:
            return Response({'error': 'Report does not exists'}, status=status.HTTP_404_NOT_FOUND)


class MergeReportsView(APIView):
    '''
    POST endpoint to merge two reports
    '''
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            required=['reports', 'name'],
            properties={
                'reports': openapi.Schema(
                    type=openapi.TYPE_ARRAY,
                    items=openapi.Items(
                        type=openapi.TYPE_INTEGER, description="Report ID"),
                    description="Array containing exactly two report IDs to be merged"
                ),
                'name': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Name of the new merged report"
                )
            },
            example={
                "reports": [1, 2],
                "name": "Merged Report"
            }
        ),
        responses={
            201: openapi.Response(
                description="Successfully merged reports",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'message': openapi.Schema(type=openapi.TYPE_STRING, description='Message')
                    },
                    example={
                        "message": "Successfully merged reports"
                    },
                )
            ),
            400: openapi.Response(
                description="Bad request",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING, description='Error')
                    },
                    example={
                        "error": "Please provide exactly 2 reports to be merged"
                    }
                )
            ),
        }
    )
    def post(self, request):
        reports = request.data.get("reports", [])
        name = request.data.get("name", None)
        if len(reports) != 2:
            return Response({"error": "Please provide exactly 2 reports to be merged"}, status=status.HTTP_400_BAD_REQUEST)
        if reports[0] == reports[1]:
            return Response({"error": "Cannot merge script with itself"}, status=status.HTTP_400_BAD_REQUEST)
        if not name:
            return Response({"error": "Name of the new report must be provided"}, status=status.HTTP_400_BAD_REQUEST)
        rp1 = get_object_or_404(Report, pk=reports[0])
        rp2 = get_object_or_404(Report, pk=reports[1])
        res = merge_reports(rp1, rp2, request.user, name)
        if res:
            return Response({"message": "Successfully merged reports"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"error": "Failed to merge reports"}, status=status.HTTP_400_BAD_REQUEST)


class ReportEmailTaskViewSet(ModelViewSet):
    '''
    All of the base methods for handling report email tasks including:
    - GET
    - POST (creation)
    - PUT
    - PATCH (updating)
    - DELETE 
    '''
    permission_classes = [IsAuthenticated]
    queryset = ReportEmailTask.objects.all()
    serializer_class = ReportEmailTaskSerializer
