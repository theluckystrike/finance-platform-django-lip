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


# @method_decorator(name='list', decorator=swagger_auto_schema(
#     manual_parameters=[
#         openapi.Parameter(
#             'parent_category',
#             openapi.IN_QUERY,
#             description="Filter categories by their parent category ID",
#             type=openapi.TYPE_INTEGER
#         )
#     ]
# ))
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

    def get_queryset(self):
        queryset = Report.objects.all().order_by("-created")
        # parent_category = self.request.query_params.get(
        #     "parent_category", None)
        # if parent_category:
        #     queryset = queryset.filter(parent_category=parent_category)
        return queryset
