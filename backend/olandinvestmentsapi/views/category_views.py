from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from ..serializers import CategorySerializer
from scriptupload.models import Category
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import status
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from scriptupload.utils.utils import get_script_hierarchy
from rest_framework.response import Response


@method_decorator(name='list', decorator=swagger_auto_schema(
    manual_parameters=[
        openapi.Parameter(
            'parent_category',
            openapi.IN_QUERY,
            description="Filter categories by their parent category ID",
            type=openapi.TYPE_INTEGER
        )
    ]
))
class CategoryViewSet(ModelViewSet):
    '''
    All of the base methods for handling categories including:
    - GET
    - POST (creation)
    - PUT
    - PATCH (updating)
    - DELETE 
    '''
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    queryset = Category.objects.all().order_by("id")

    def get_queryset(self):
        queryset = Category.objects.all().order_by("id")
        parent_category = self.request.query_params.get(
            "parent_category", None)
        if parent_category:
            queryset = queryset.filter(parent_category=parent_category)
        return queryset


class CategoryTreeView(APIView):
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        responses={
            200: openapi.Response(
                description="Tree received",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        'tree': openapi.Schema(type=openapi.TYPE_OBJECT, description='JSON formatted tree of category IDs by level'),
                    },
                    example={
                        "1": {"2": ["3", "4"], "5": ["6", "7"]},
                    }
                )
            ),
        }
    )
    def get(self, request):
        resp = {}
        parent_categories = Category.objects.filter(parent_category=None)
        for category in parent_categories:
            resp[category.id] = {}
            for subcategory in Category.objects.filter(parent_category=category):
                resp[category.id][subcategory.id] = [c.id for c in Category.objects.filter(
                    parent_category=subcategory)]

        return Response({"tree": resp}, status=status.HTTP_200_OK)
