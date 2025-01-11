from rest_framework.pagination import PageNumberPagination


class Pagination(PageNumberPagination):
    """
    Custom pagination class for all views
    """
    page_size_query_param = 'per_page'
    page_size = 10
    max_page_size = 100