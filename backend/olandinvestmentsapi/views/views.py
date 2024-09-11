from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from rest_framework import status, generics
from rest_framework.response import Response
from ..serializers import CategorySerializer, ScriptSerializer
from scriptupload.models import Category, Script, Report
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.utils.decorators import method_decorator


class SearchView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'query',
                openapi.IN_QUERY,
                description="Search query",
                type=openapi.TYPE_STRING
            )
        ],
        responses={
            200: openapi.Response(
                description="Search results",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'scripts': openapi.Schema(type=openapi.TYPE_OBJECT, description='Scripts with name matching search query'),
                        'reports': openapi.Schema(type=openapi.TYPE_OBJECT, description='Reports with name matching search query'),
                        'categories': openapi.Schema(type=openapi.TYPE_OBJECT, description='Categories with name matching search query')
                    },
                    example={
                        "scripts": [
                            {
                                "name": "uploaded 4",
                                "file": "http://127.0.0.1:8000/mediafiles/scripts-dev/uploaded%204/apple.py",
                                "category": {
                                    "id": 2,
                                    "name": "Economics",
                                    "parent_category": 11
                                },
                                "output_type": "plt",
                                "description": None,
                                "id": 344,
                                "created": "2024-09-06T18:05:51.379058Z",
                                "chart_data": {
                                    "id": 20,
                                    "image_file": "http://127.0.0.1:8000/mediafiles/scripts-dev/uploaded%204/chart/output_plot.png",
                                    "created": "2024-09-06T19:52:49.458525Z",
                                    "last_updated": None
                                },
                                "table_data": None
                            }
                        ],
                        "categories": [
                            {
                                "name": "Income savings",
                                "parent_category": 2,
                                "id": 9
                            },
                            {
                                "name": "CAD",
                                "parent_category": None,
                                "id": 46
                            },
                            {
                                "name": "API category",
                                "parent_category": None,
                                "id": 54
                            },
                            {
                                "name": "API category child 2",
                                "parent_category": None,
                                "id": 55
                            },
                            {
                                "name": "API category child2",
                                "parent_category": None,
                                "id": 56
                            },
                            {
                                "name": "API category child4",
                                "parent_category": 11,
                                "id": 57
                            }
                        ]
                    }
                )
            ),
            404: openapi.Response(
                description="Empty search query",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'error': openapi.Schema(type=openapi.TYPE_STRING, description='Error')
                    },
                    example={
                        "error": "No search query provided"
                    }
                )
            ),
        }
    )
    def get(self, request):
        '''
        GET endpoint for searching scripts, report and categories by name
        '''
        search_str = request.query_params.get("query", None)
        if not search_str:
            return Response({"error": "No search query provided"}, status=404)

        scripts = Script.objects.filter(name__icontains=search_str)
        scripts_data = ScriptSerializer(
            scripts, many=True, context={'request': request}).data

        reports = Report.objects.filter(name__icontains=search_str)

        categories = Category.objects.filter(name__icontains=search_str)
        categories_data = CategorySerializer(
            categories, many=True, context={'request': request}).data

        resp = {
            "scripts": scripts_data,
            "categories": categories_data
        }
        return Response(resp)
