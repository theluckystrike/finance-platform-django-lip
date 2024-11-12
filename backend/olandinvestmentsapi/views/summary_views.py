from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from olandinvestmentsapi.serializers import SummarySerializer, SummaryMetaSerializer, SummarySerializerLite
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from olandinvestmentsapi.models import Summary
from django.utils.decorators import method_decorator
import logging
from olandinvestmentsapi.models import Status

logger = logging.getLogger('testlogger')


@method_decorator(name='list', decorator=swagger_auto_schema(
    responses={
        200: openapi.Response(
            description="Status retrieved",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                        'id': openapi.Schema(
                            type=openapi.TYPE_INTEGER,
                            description='Summary ID',
                        ),
                    'name': openapi.Schema(type=openapi.TYPE_STRING, description='Summary name'),
                    "scripts": openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Items(
                                type=openapi.TYPE_INTEGER, description="Script ID"),
                            description="List of Script IDs in summary"),
                    'created': openapi.Schema(type=openapi.TYPE_STRING, description='Created timestamp'),
                },
                example={
                    "count": 2,
                    "next": None,
                    "previous": None,
                    "results": [
                        {
                            "id": 10,
                            "name": "Summary 2",
                            "scripts": [
                                348
                            ],
                            "created": "2024-10-28T15:29:13.566890Z"
                        },
                        {
                            "id": 9,
                            "name": "Summary 1",
                            "scripts": [
                                347
                            ],
                            "created": "2024-10-28T15:29:13.561343Z"
                        }
                    ]
                }
            )
        ), }
))
class SummaryViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SummarySerializerLite
    queryset = Summary.objects.all().order_by("-created")

    def get_serializer_class(self):
        if self.action == "list":
            return super().get_serializer_class()
        return SummarySerializer

    @swagger_auto_schema(
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'name': openapi.Schema(
                    type=openapi.TYPE_STRING,
                    description="Name of the summary",
                ),
                "scripts": openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    additional_properties=openapi.Schema(
                        type=openapi.TYPE_STRING),
                    description="A map from Script IDs to table data column names"
                ),
            },
            example={
                "name": "Summary 4",
                "scripts": {
                    "348": "column name 1",
                    "349": "another column name",
                }
            },
            required=["name", "scripts"]
        ),
        responses={
            200: openapi.Response(
                description="Created",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'id': openapi.Schema(
                            type=openapi.TYPE_INTEGER,
                            description='Summary ID',
                        ),
                        'name': openapi.Schema(type=openapi.TYPE_STRING, description='Summary name'),
                        "scripts": openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Items(
                                type=openapi.TYPE_INTEGER, description="Script ID"),
                            description="List of Script IDs in summary"),
                        'created': openapi.Schema(type=openapi.TYPE_STRING, description='Created timestamp'),
                    },
                    example={
                        "id": 10,
                        "name": "Summary 4",
                                "scripts": [
                                    348, 349
                                ],
                        "created": "2024-10-28T15:29:13.566890Z"
                    }
                )
            ), })
    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = SummaryMetaSerializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class SummaryUpdateView(APIView):
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
        summary = get_object_or_404(Summary, pk=pk)
        if summary.status == Status.RUNNING:
            return Response({"message": "Summary `is already running"})
        try:
            summary.update()
            return Response({"message": "Summary added to task queue"})
        except Exception as e:
            logger.error(
                f"[Summary update View] Failed to update summary {summary.id} -> {str(e)}")
            return Response({"error": "Summary does not exists"}, status=status.HTTP_404_NOT_FOUND)


class SummaryStatusView(APIView):
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
            summary = get_object_or_404(Summary, pk=pk)
            resp = {
                "status": summary.get_status_display()
            }
            if summary.status == Status.SUCCESS:
                resp["signal_plot_data"] = summary.signal_plot_data
            # if summary.status == Status.FAILURE:
            #     resp['error_message'] = summary.error_message
            # if summary.status == Status.SUCCESS:
                # context required to return full URLs
                # if script.has_chart_data:
                #     resp["chart_data"] = ChartDataSerializer(
                #         script.chart_data, context={'request': request}).data
                # if script.has_table_data:
                #     resp["table_data"] = TableDataSerializer(
                #         script.table_data, context={'request': request}).data
            return Response(resp)
        except Summary.DoesNotExist:
            return Response({'error': 'Summary does not exists'}, status=status.HTTP_404_NOT_FOUND)
