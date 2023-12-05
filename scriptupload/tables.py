import django_tables2 as tables
from django.utils.safestring import mark_safe
from .models import Script


class ScriptTable(tables.Table):

    subcategory1 = tables.Column(
        empty_values=(), verbose_name="Sub category 1", orderable=False)
    category = tables.Column(
        empty_values=(), verbose_name="Category", orderable=False)
    subcategory2 = tables.Column(
        empty_values=(), verbose_name="Sub category 2")
    created = tables.Column(verbose_name="Added")

    view_link = tables.Column(empty_values=(), verbose_name="")
    select_box = tables.Column(empty_values=(), verbose_name=mark_safe(
        '<input type="checkbox" id="selectAllCheckbox" onclick="toggleCheckboxes()">'))

    class Meta:
        model = Script
        template_name = "django_tables2/bootstrap5.html"
        fields = ("select_box", "name", "category",
                  "subcategory1", "subcategory2", "created", "last_updated", "view_link")
        attrs = {"class": "table table-striped table-sm",
                 "tbody": {"id": "scriptsCheckboxes"}}

    def render_subcategory1(self, value, record):
        if record.category:
            return record.category.parent_category.name
        else:
            return "-"

    def render_subcategory2(self, value, record):
        if record.category:
            return record.category.name
        else:
            return "-"

    def render_category(self, value, record):
        if record.category:
            return record.category.parent_category.parent_category.name
        else:
            return "-"

    def render_view_link(self, value, record):
        return mark_safe('<a href="/scripts/{}" class="text-decoration-none"> View script </a>'.format(record.name.replace(' ', '%20')))

    def render_select_box(self, value, record):
        return mark_safe('<input type="checkbox" name="scripts" value="{}">'.format(record.id))
