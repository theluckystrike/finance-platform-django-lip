import django_tables2 as tables
from .models import Script


class ScriptTable(tables.Table):

    subcategory1 = tables.Column(
        empty_values=(), verbose_name="Sub category 1", orderable=False)
    category = tables.Column(empty_values=(), verbose_name="Category", orderable=False)
    subcategory2 = tables.Column(
        accessor="category", verbose_name="Sub category 2")

    class Meta:
        model = Script
        template_name = "django_tables2/bootstrap.html"
        fields = ("name", "created", "last_updated", "category",
                  "subcategory1", "subcategory2")

    def render_subcategory1(self, value, record):
        return record.category.parent_category.name

    def render_category(self, value, record):
        return record.category.parent_category.parent_category.name

