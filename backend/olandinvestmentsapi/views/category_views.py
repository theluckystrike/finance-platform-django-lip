from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from ..serializers import CategorySerializer
from scriptupload.models import Category
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.utils.decorators import method_decorator


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
