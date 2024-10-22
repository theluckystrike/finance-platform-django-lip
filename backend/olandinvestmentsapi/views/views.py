from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from ..serializers import DeepCategorySerializer, ScriptSearchSerializer, ReportSearchSerializer
from scriptupload.models import Category, Script, Report
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


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
                                "category": {
                                    "name": "Economics",
                                    "parent_category": {
                                        "id": 11,
                                        "name": "USD2",
                                        "parent_category": None
                                    },
                                    "id": 2,
                                    "level": 1
                                },
                                "id": 344,
                                "url": "http://hostserver.com/api/scripts/344"
                            },
                            {
                                "name": "apple",
                                "category": {
                                    "name": "api",
                                    "parent_category": {
                                        "id": 44,
                                        "name": "GBP",
                                        "parent_category": {
                                            "id": 11,
                                            "name": "USD2",
                                            "parent_category": None
                                        }
                                    },
                                    "id": 58,
                                    "level": 2
                                },
                                "id": 345,
                                "url": "http://hostserver.com/api/scripts/345"
                            }
                        ],
                        "categories": [
                            {
                                "name": "Income savings",
                                "parent_category": {
                                    "id": 2,
                                    "name": "Economics",
                                    "parent_category": {
                                        "id": 11,
                                        "name": "USD2",
                                        "parent_category": None
                                    }
                                },
                                "id": 9,
                                "level": 2
                            },
                            {
                                "name": "CAD",
                                "parent_category": None,
                                "id": 46,
                                "level": 0
                            },
                            {
                                "name": "API category",
                                "parent_category": None,
                                "id": 54,
                                "level": 0
                            },
                            {
                                "name": "API category child 2",
                                "parent_category": None,
                                "id": 55,
                                "level": 0
                            },
                            {
                                "name": "API category child2",
                                "parent_category": None,
                                "id": 56,
                                "level": 0
                            },
                            {
                                "name": "API category child4",
                                "parent_category": {
                                    "id": 11,
                                    "name": "USD2",
                                    "parent_category": None
                                },
                                "id": 57,
                                "level": 1
                            },
                            {
                                "name": "api",
                                "parent_category": {
                                    "id": 44,
                                    "name": "GBP",
                                    "parent_category": {
                                        "id": 11,
                                        "name": "USD2",
                                        "parent_category": None
                                    }
                                },
                                "id": 58,
                                "level": 2
                            },
                            {
                                "name": "another category",
                                "parent_category": None,
                                "id": 60,
                                "level": 0
                            }
                        ],
                        "reports": [
                            {
                                "name": "API category child4",
                                "id": 32,
                                "url": "http://hostserver.com/api/reports/32"
                            },
                            {
                                "name": "API report",
                                "id": 33,
                                "url": "http://hostserver.com/api/reports/33"
                            },
                            {
                                "name": "API report 2",
                                "id": 34,
                                "url": "http://hostserver.com/api/reports/34"
                            },
                            {
                                "name": "API report 3",
                                "id": 35,
                                "url": "http://hostserver.com/api/reports/35"
                            },
                            {
                                "name": "API report 5",
                                "id": 36,
                                "url": "http://hostserver.com/api/reports/36"
                            },
                            {
                                "name": "API report 7",
                                "id": 37,
                                "url": "http://hostserver.com/api/reports/37"
                            },
                            {
                                "name": "merged from api",
                                "id": 39,
                                "url": "http://hostserver.com/api/reports/39"
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
        scripts_data = ScriptSearchSerializer(
            scripts, many=True, context={'request': request}).data

        reports = Report.objects.filter(name__icontains=search_str)
        reports_data = ReportSearchSerializer(
            reports, many=True, context={'request': request}).data

        categories = Category.objects.filter(name__icontains=search_str)
        categories_data = DeepCategorySerializer(
            categories, many=True, context={'request': request}).data

        resp = {
            "scripts": scripts_data,
            "categories": categories_data,
            "reports": reports_data
        }
        return Response(resp)
