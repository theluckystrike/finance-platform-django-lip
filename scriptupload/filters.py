import django_filters
from django_filters import filters
from .models import Script, Category


class ScriptFilter(django_filters.FilterSet):
    def __init__(self, data=None, queryset=None, *, request=None, prefix=None):
        super().__init__(data, queryset, request=request, prefix=prefix)
        category = data.get("category", None)
        subcategory = data.get("subcategory1", None)
        subsubcategory = data.get("subcategory1", None)

        self.filters['category'] = filters.ModelChoiceFilter(
            queryset=Category.objects.filter(
                parent_category=None), label="Category", field_name="category__parent_category__parent_category")
        if category:
            self.filters['subcategory1'] = filters.ModelChoiceFilter(queryset=Category.objects.filter(
                parent_category=category), label="Sub Category 1", field_name="category__parent_category")
        if subcategory:
            self.filters['subcategory2'] = filters.ModelChoiceFilter(
                queryset=Category.objects.filter(parent_category=subcategory), label="Sub Category 2", field_name="category")

    class Meta:
        model = Script
        fields = []
