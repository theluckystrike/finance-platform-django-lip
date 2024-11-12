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
        summary.update()
        return Response({"message": "Summary added to task queue"})


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
                        'signal_plot_data': openapi.Schema(type=openapi.TYPE_OBJECT, description='Chart data info')
                    },
                    example={
                        "status": "success",
                        "signal_plot_data": {}
                    }
                )
            ),
            404: openapi.Response(
                description="Summary not found",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING, description='Error')
                    },
                    example={
                        "error": "Summary does not exist"
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
            return Response(resp)
        except Summary.DoesNotExist:
            return Response({'error': 'Summary does not exists'}, status=status.HTTP_404_NOT_FOUND)
