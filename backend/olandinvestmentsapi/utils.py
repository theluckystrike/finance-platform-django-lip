from rest_framework.pagination import PageNumberPagination


class Pagination(PageNumberPagination):
    """
    Custom pagination class for all views
    """
    page_size_query_param = 'per_page'
    max_page_size = 1000