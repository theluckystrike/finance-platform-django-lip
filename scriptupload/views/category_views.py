

from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.utils.safestring import mark_safe
from ..forms import NewCategoryForm
from ..models import Category, Script
from ..utils.utils import scripts_to_httpresponse
from ..tables import DragnDropTable
from django_tables2 import RequestConfig


@login_required
def category_page(request, categoryname):
    """
    Configures the page that shows all scripts that are in a certain category, given the category name.
    """
    category = get_object_or_404(Category, name=categoryname)
    table = DragnDropTable(Script.objects.filter(
        category=category).order_by("index_in_category"))
    RequestConfig(request, paginate=False).configure(table)
    return render(request, "bootstrap/category/category.html", {"table": table, "category": category, "scripts": Script.objects.all(), "categories": Category.objects.filter(parent_category=None)})


def update_category(request, pk):
    category = get_object_or_404(Category, pk=pk)
    form = NewCategoryForm(request.POST, instance=category)
    if form.is_valid():
        ob = form.save(commit=False)
        parent = form.cleaned_data["parent"]

        ob_type = ob.get_level()
        if parent == -1:
            if ob_type != 0:
                messages.error(request, "Cannot promote category")
            else:
                ob.parent_category = None
                ob.save()
                messages.success(request, mark_safe(f"Successfully updated"))
        elif parent == ob.id:
            messages.error(
                request, "Cannot make category a subcategory of itself")
        else:
            parent_cat = get_object_or_404(Category, pk=parent)
            parent_cat_type = parent_cat.get_level()
            if (ob_type == 2 and parent_cat_type == 1) or (ob_type == 1 and parent_cat_type == 0):
                ob.parent_category = parent_cat
                ob.save()
                messages.success(request, mark_safe(f"Successfully updated"))
            else:
                messages.error(request, "Not allowed")
    else:
        messages.error(request, "There was an error making this update")
    return redirect("manage_categories")


def category_manager_page(request):
    form = NewCategoryForm()
    return render(request, "bootstrap/category/category_manage.html", {"form": form, "scripts": Script.objects.all(), "categories": Category.objects.filter(parent_category=None)})


@login_required
def create_category(request):
    """
    Configures that page that creates a new category of scripts.
    """
    if request.method == "POST":
        form = NewCategoryForm(request.POST)
        if form.is_valid():
            parent_id = form.cleaned_data['parent']
            if parent_id < 0:
                form.save()
            else:
                parent = get_object_or_404(Category, pk=parent_id)
                category = form.save()
                category.parent_category = parent
                category.save()
            messages.success(request, "New category added successfully")
        else:
            # TODO: catch duplicates and create message
            messages.info(request, "Category already exists")

    return HttpResponseRedirect("/")


@login_required
def generate_category_report(request, categoryid):
    """
    Configures the page that shows when the "Generate a report" button is clicked in the sidebar given the category ID.
    """
    if request.method == "GET":
        category = get_object_or_404(Category, pk=categoryid)
        category_scripts = category.script_set.all().order_by("index_in_category")
        if len(category_scripts) > 0:
            pdf_response = scripts_to_httpresponse(
                category_scripts, categoryname=category.name)
            if pdf_response:
                messages.success(request, "Successfully generated report")
                return pdf_response
            else:
                messages.error(request, "Failed to create report")
        else:
            messages.info(request, "The selected category contains no scripts")
    return redirect(category_page, category.name)


@login_required
def get_subcategories(request, categoryid):
    subcats = Category.objects.filter(
        parent_category=get_object_or_404(Category, pk=categoryid))
    return JsonResponse({"subcategories": [{'name': cat.name, 'id': cat.id} for cat in subcats]}, safe=False)
