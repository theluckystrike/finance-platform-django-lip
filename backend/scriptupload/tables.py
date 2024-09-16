import django_tables2 as tables
from django.utils.safestring import mark_safe
from .models import Script
from django.urls import reverse


"""class ScriptTable(tables.Table):

    category = tables.Column(
        empty_values=(), verbose_name="Category", order_by="category.parent_category.parent_category.name")
    subcategory1 = tables.Column(
        empty_values=(), verbose_name="Sub category 1", order_by="category.parent_category.name")
    subcategory2 = tables.Column(
        empty_values=(), verbose_name="Sub category 2", order_by="category.name")
    created = tables.Column(verbose_name="Added")

    view_link = tables.Column(empty_values=(), verbose_name="")
    select_box = tables.Column(empty_values=(), verbose_name=mark_safe(
        '<input type="checkbox" id="selectAllCheckbox" onclick="toggleCheckboxes()">'))

    class Meta:
        model = Script
        template_name = "django_tables2/bootstrap5-responsive.html"
        fields = ("select_box", "name", "category",
                  "subcategory1", "subcategory2", "created", "last_updated", "view_link")
        attrs = {"class": "table border border-white",
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

    '''def render_category(self, value, record):
        if record.category:
            return record.category.parent_category.parent_category.name
        else:
            return "-"'''

    def render_category(self, value, record):
    # Check if the category exists
        if record.category:
        # Check if the first-level parent category exists
            if record.category.parent_category:
            # Check if the second-level parent category exists
                if record.category.parent_category.parent_category:
                    return record.category.parent_category.parent_category.name
                return record.category.parent_category.name  # If no second-level parent
            return record.category.name  # If no first-level parent
        return "-"  # Return "-" if no category exists

    def render_view_link(self, value, record):
        return mark_safe('<a href="{}" class="text-decoration-none"> View script </a>'.format(reverse("script", args=(record.name,))))

    def render_select_box(self, value, record):
        return mark_safe('<input type="checkbox" name="scripts" value="{}">'.format(record.id))


class DragnDropTable(tables.Table):
    name = tables.Column(orderable=False)
    created = tables.Column(orderable=False)
    last_updated = tables.Column(orderable=False)
    view_link = tables.Column(empty_values=(), verbose_name="")

    class Meta:
        model = Script
        row_attrs = {
            "data-id": lambda record: record.pk
        }
        template_name = "django_tables2/bootstrap5-responsive.html"
        fields = ("name", "created", "last_updated", "view_link")
        attrs = {"class": "table table-striped table-sm"}

    def render_view_link(self, value, record):
        return mark_safe('<a href="{}" class="text-decoration-none"> View script </a>'.format(reverse("script", args=(record.name,))))


class ReportScriptTable(tables.Table):
    category = tables.Column(
        empty_values=(), verbose_name="Category", order_by="category.parent_category.parent_category.name")
    subcategory1 = tables.Column(
        empty_values=(), verbose_name="Sub category 1", order_by="category.parent_category.name")
    subcategory2 = tables.Column(
        empty_values=(), verbose_name="Sub category 2", order_by="category.name")

    delete_button = tables.Column(empty_values=(), verbose_name="")

    view_link = tables.Column(empty_values=(), verbose_name="")

    class Meta:
        model = Script
        template_name = "django_tables2/bootstrap5-responsive.html"
        fields = ("name", "category",
                  "subcategory1", "subcategory2", "delete_button", "view_link")
        attrs = {"class": "table table-striped table-sm",
                 "tbody": {"id": "scriptsCheckboxes"}}

    '''def render_subcategory1(self, value, record):
        if record.category:
            return record.category.parent_category.name
        else:
            return "-"'''
    def render_subcategory1(self, value, record):
        if record.category:
            # Check if the parent category exists
            if record.category.parent_category:
                return record.category.parent_category.name
            else:
                return "-"  # Return a placeholder if parent category does not exist
        return "-"  # Return a placeholder if category does not exist


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

    def render_delete_button(self, value, record):
        return mark_safe('<button hx-delete="{}" hx-swap="none" hx-confirm="Are you sure?" class="text-danger text-decoration-none px-1"> Delete </button>'.format(f"remove-script/{record.pk}/"))

    def render_view_link(self, value, record):
        return mark_safe('<a href="{}" class="text-decoration-none"> View script </a>'.format(reverse("script", args=(record.name,))))


def create_dynamic_csv_table(headers, data):
    columns = {header: tables.Column() for header in headers}
    DynamicTable = type('tables.Table',
                        (tables.Table,),
                        {'Meta': type('Meta', (), {'template_name': 'django_tables2/bootstrap5-responsive.html', 'attrs': {"class": "table table-striped table-sm"}}),
                            **columns})
    return DynamicTable(data)
"""

class ScriptTable(tables.Table):

    category = tables.Column(
        empty_values=(), verbose_name="Category", order_by="category.parent_category.parent_category.name")
    subcategory1 = tables.Column(
        empty_values=(), verbose_name="Sub category 1", order_by="category.parent_category.name")
    subcategory2 = tables.Column(
        empty_values=(), verbose_name="Sub category 2", order_by="category.name")
    created = tables.Column(verbose_name="Added")

    view_link = tables.Column(empty_values=(), verbose_name="")
    select_box = tables.Column(empty_values=(), verbose_name=mark_safe(
        '<input type="checkbox" id="selectAllCheckbox" onclick="toggleCheckboxes()">'))

    class Meta:
        model = Script
        template_name = "django_tables2/bootstrap5-responsive.html"
        fields = ("select_box", "name", "category",
                  "subcategory1", "subcategory2", "created", "last_updated", "view_link")
        attrs = {"class": "table border border-white",
                 "tbody": {"id": "scriptsCheckboxes"}}

    def render_subcategory1(self, value, record):
        if record.category and record.category.parent_category:
            return record.category.parent_category.name or "-"
        return "-"

    def render_subcategory2(self, value, record):
        if record.category:
            return record.category.name or "-"
        return "-"

    def render_category(self, value, record):
        if record.category:
            if record.category.parent_category:
                if record.category.parent_category.parent_category:
                    return record.category.parent_category.parent_category.name or "-"
                return record.category.parent_category.name or "-"
            return record.category.name or "-"
        return "-"

    def render_view_link(self, value, record):
        return mark_safe('<a href="{}" class="text-decoration-none"> View script </a>'.format(reverse("script", args=(record.name,))))

    def render_select_box(self, value, record):
        return mark_safe('<input type="checkbox" name="scripts" value="{}">'.format(record.id))


class DragnDropTable(tables.Table):
    name = tables.Column(orderable=False)
    created = tables.Column(orderable=False)
    last_updated = tables.Column(orderable=False)
    view_link = tables.Column(empty_values=(), verbose_name="")

    class Meta:
        model = Script
        row_attrs = {
            "data-id": lambda record: record.pk
        }
        template_name = "django_tables2/bootstrap5-responsive.html"
        fields = ("name", "created", "last_updated", "view_link")
        attrs = {"class": "table table-striped table-sm"}

    def render_view_link(self, value, record):
        return mark_safe('<a href="{}" class="text-decoration-none"> View script </a>'.format(reverse("script", args=(record.name,))))


class ReportScriptTable(tables.Table):
    category = tables.Column(
        empty_values=(), verbose_name="Category", order_by="category.parent_category.parent_category.name")
    subcategory1 = tables.Column(
        empty_values=(), verbose_name="Sub category 1", order_by="category.parent_category.name")
    subcategory2 = tables.Column(
        empty_values=(), verbose_name="Sub category 2", order_by="category.name")

    delete_button = tables.Column(empty_values=(), verbose_name="")

    view_link = tables.Column(empty_values=(), verbose_name="")

    class Meta:
        model = Script
        template_name = "django_tables2/bootstrap5-responsive.html"
        fields = ("name", "category",
                  "subcategory1", "subcategory2", "delete_button", "view_link")
        attrs = {"class": "table table-striped table-sm",
                 "tbody": {"id": "scriptsCheckboxes"}}

    def render_subcategory1(self, value, record):
        if record.category and record.category.parent_category:
            return record.category.parent_category.name or "-"
        return "-"

    def render_subcategory2(self, value, record):
        if record.category:
            return record.category.name or "-"
        return "-"

    def render_category(self, value, record):
        if record.category:
            if record.category.parent_category:
                if record.category.parent_category.parent_category:
                    return record.category.parent_category.parent_category.name or "-"
                return record.category.parent_category.name or "-"
            return record.category.name or "-"
        return "-"

    def render_delete_button(self, value, record):
        return mark_safe('<button hx-delete="{}" hx-swap="none" hx-confirm="Are you sure?" class="text-danger text-decoration-none px-1"> Delete </button>'.format(f"remove-script/{record.pk}/"))

    def render_view_link(self, value, record):
        return mark_safe('<a href="{}" class="text-decoration-none"> View script </a>'.format(reverse("script", args=(record.name,))))


def create_dynamic_csv_table(headers, data):
    columns = {header: tables.Column() for header in headers}
    DynamicTable = type('tables.Table',
                        (tables.Table,),
                        {'Meta': type('Meta', (), {'template_name': 'django_tables2/bootstrap5-responsive.html', 'attrs': {"class": "table table-striped table-sm"}}),
                         **columns})
    return DynamicTable(data)