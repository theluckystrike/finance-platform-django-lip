"""
Configuration for the views on the site.

These configure what the user will interact with and see when they visit each page.
Each function configures a different view and defines which one in its name.
"""

from django.shortcuts import render, redirect
from django.core.files.base import ContentFile
from django.utils.safestring import mark_safe
from .forms import ScriptUploadForm, NewCategoryForm, ScriptAddCategoryForm, ScriptSelectForm, NewReportForm, NewReportTaskForm
from .utils import run_script, scripts_to_httpresponse, update_report_pdf
from django.shortcuts import get_object_or_404, redirect
from .models import Script, Category, Report, ReportEmailTask
from django.contrib import messages
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
import nbformat
from nbconvert import PythonExporter
import os
from django.core.files import File
from django.template.defaulttags import register
from django.contrib.auth.decorators import login_required
from .tables import ScriptTable
from django_tables2 import RequestConfig

# TODO: always search up using pk
# TODO: custom 404 and internal error page


# def handler404(request, *args, **argv):
#     HttpResponseRedirect("/")

# def handler500(request, *args, **argv):
#     HttpResponseRedirect("/")
@login_required
def upload_script(request):
    """
    Configures the page that shows when "Upload a script" is clicked in the sidebar.
    """
    if request.method == "POST":
        # TODO: check for same name script
        form = ScriptUploadForm(request.POST, request.FILES)
        if form.is_valid():
            # category_name = form.cleaned_data["category_name"]
            # category = Category.objects.get(pk=category_name)
            file = form.cleaned_data['file']
            script = form.save(commit=False)
            if file.name.endswith('.ipynb'):
                # if the file is a jupyter notebook, we need to convert it
                nb_content = nbformat.read(file, as_version=4)
                exporter = PythonExporter()
                (python_code, resources) = exporter.from_notebook_node(nb_content)
                python_file_name = file.name.replace('.ipynb', '.py')
                with open(python_file_name, 'w') as output_file:
                    output_file.write(python_code)
                # create the new file object
                new_file = File(open(python_file_name, 'rb'))
                # create the script instance and update file field
                script.file = new_file
                # remove the temporary file
                if os.path.exists(python_file_name):
                    os.remove(python_file_name)
            script.save()
            # script.category = category
            # script.save()
            messages.success(request, "Script added successfully")
        else:
            messages.info(
                request, "A script with this name has already been added")
    else:
        form = ScriptUploadForm()
    # TODO: return only the name of scripts and categories in the context
    return render(request, "bootstrap/upload.html", {"scripts": Script.objects.all(), "categories": Category.objects.filter(parent_category=None)})


@login_required
def category_page(request, categoryname):
    """
    Configures the page that shows all scripts that are in a certain category, given the category name.
    """
    category = get_object_or_404(Category, name=categoryname)
    if request.method == "POST":
        form = NewCategoryForm(request.POST, instance=category)
        if form.is_valid():
            form.save()
            return redirect(category_page, form.cleaned_data['name'])
    else:
        form = NewCategoryForm(instance=category)
        if category.parent_category:
            form.fields['parent'].initial = 0
    return render(request, "bootstrap/category.html", {"form": form, "category": category, "scripts": Script.objects.all(), "categories": Category.objects.filter(parent_category=None)})


@login_required
def all_script_page(request):
    """
    Configures the page that is shown when "All scripts" is clicked in the sidebar.
    """
    scripttable = ScriptTable(Script.objects.all())
    RequestConfig(request).configure(scripttable)
    # category = get_object_or_404(Category, name=categoryname)
    return render(request, "bootstrap/all_scripts.html", {"scripts": Script.objects.all(), "script_table": scripttable, "categories": Category.objects.filter(parent_category=None)})


@login_required
def script_page(request, scriptname):
    """
    Configures the page that shows an individual script when it is clicked on.
    """
    # TODO: change these to use pk
    script = get_object_or_404(Script, name=scriptname)
    if request.method == "POST":
        nameform = ScriptUploadForm(request.POST, instance=script)
        if nameform.is_valid():
            s = nameform.save(commit=False)
            s.category = get_object_or_404(Category, pk=request.POST['category_name'])
            s.save()
        return redirect(script_page, nameform.cleaned_data['name'])
    else:
        nameform = ScriptUploadForm(instance=script)
    return render(request, "bootstrap/script.html", {'nameform': nameform, "script": script, "scripts": Script.objects.all(), "categories": Category.objects.filter(parent_category=None)})


@login_required
def run_script_code(request, scriptname):
    """
    Configures the "Run" button that shows when looking at a script and the page that is shown when clicked.
    """
    script = get_object_or_404(Script, name=scriptname)
    if request.method == "POST":
        success, message = run_script(script)
        if not success:
            messages.error(request, mark_safe(
                f"<u>Error when running script:</u><br/>{message}"))
    return redirect(script_page, scriptname)


@login_required
def delete_script(request, scriptname):
    """
    Configures the "Delete" button that shows when looking at a script and the page that is shown when clicked.
    """
    script = get_object_or_404(Script, name=scriptname)
    if request.method == "POST":
        script.delete()
    return redirect(all_script_page)


@login_required
def script_edit_page(request, scriptname):
    """
    Configures the "Edit" button that shows when looking at a script and the page that is shown when clicked.
    """
    if request.method == "GET":
        script = get_object_or_404(Script, name=scriptname)
        file_contents = script.file.read().decode("utf-8")
        return render(request, "bootstrap/script_edit.html", {'file_contents': file_contents, "script": script, "scripts": Script.objects.all(), "categories": Category.objects.filter(parent_category=None)})
    elif request.method == "POST":
        script = get_object_or_404(Script, name=scriptname)
        # Get the edited script content from request
        edited_content = request.POST.get('edited_content', '')
        # encode and save to file
        script.file.save(os.path.basename(script.file.name),
                         ContentFile(edited_content.encode("utf-8")))
        messages.success(request, "Script updated successfully")
        return HttpResponseRedirect(f"/scripts/{scriptname}")


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
def script_delete_category(request, scriptid, categoryid):
    """
    Configures the page that allows a user to delete a script, given its ID and category.
    """
    if request.method == "GET":
        script = get_object_or_404(Script, pk=scriptid)
        category = get_object_or_404(Category, pk=categoryid)
        # script.categories.remove(category)
        # TODO: figure out why this message does not show and there are is an
        # additional DELETE request to script/
        messages.success(request, "Script successfully removed from category")
        return redirect(reverse('script', kwargs={"scriptname": script.name}))
    return HttpResponseRedirect("/")


@login_required
def script_add_category(request, scriptid):
    """
    Configures the page that shows when a script is added to a new category given its ID.
    """
    if request.method == "POST":
        form = ScriptAddCategoryForm(request.POST)
        if form.is_valid():
            script = get_object_or_404(Script, pk=scriptid)
            category = get_object_or_404(
                Category, pk=form.cleaned_data["category_name"])
            # script.categories.add(category)
            messages.success(
                request, f"Script successfully added to category '{category.name}'")
        else:
            messages.error(
                request, f"Could not add script to category '{category.name}'")
        return redirect(reverse('script', kwargs={"scriptname": script.name}))
    return HttpResponseRedirect("/")


@login_required
def script_search(request):
    """
    Configures the functionality to search for a specific script.
    """
    if request.method == "POST":
        search_query = request.POST.get("script_name")
        results = Script.objects.filter(name__icontains=search_query)
        if len(results) > 0 and len(search_query) > 0:
            data = []
            for result in results:
                r = {
                    'name': result.name,
                    'url': f"/scripts/{result.name}"
                }
                data.append(r)
        else:
            data = "No results"
        return JsonResponse({"results": data})
    return HttpResponseRedirect("/")


@login_required
def generate_category_report(request, categoryid):
    """
    Configures the page that shows when the "Generate a report" button is clicked in the sidebar given the category ID.
    """
    if request.method == "GET":
        category = get_object_or_404(Category, pk=categoryid)
        category_scripts = category.script_set.all()
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
    return redirect(category_page, get_object_or_404(Category, pk=categoryid).name)


@login_required
def save_custom_report(request):
    if request.method == "POST":
        form = NewReportForm(request.POST)
        if form.is_valid():
            form.save()
            messages.success(request, "Report successfully created")
        else:
            messages.info(request, "A report with this name already exists")
    return redirect(custom_report_page)


@login_required
def custom_report_page(request):
    if request.method == "POST":
        form = ScriptSelectForm(request.POST)
        if form.is_valid():
            scripts = form.cleaned_data['scripts']
            if len(scripts) > 0:
                ran_all_scripts = True
                if form.cleaned_data['run_scripts']:
                    for script in scripts:
                        success, message = run_script(script)
                        if not success:
                            messages.error(request, mark_safe(
                                f"<u>Error when running script {script.name}:</u><br/>{message}"))
                            ran_all_scripts = False
                            break
                if ran_all_scripts:
                    pdf_response = scripts_to_httpresponse(
                        scripts, runscripts=form.cleaned_data['run_scripts'])
                    if pdf_response is not None:
                        return pdf_response
        else:
            messages.info(request, "Select scripts from the table below")

    scripts = Script.objects.all()
    category = request.GET.get("category", None)
    subcategory1 = request.GET.get("subcategory1", None)
    subcategory2 = request.GET.get("subcategory2", None)
    if category:
        scripts = Script.objects.filter(
            category__parent_category__parent_category_id=category)
    if subcategory1:
        scripts = Script.objects.filter(
            category__parent_category_id=subcategory1)
    if subcategory2:
        scripts = Script.objects.filter(category_id=subcategory2)

    table = ScriptTable(scripts)
    RequestConfig(request, paginate=False).configure(table)

    script_form = ScriptSelectForm()
    report_form = NewReportForm()
    # subcats = {}
    # for c in Category.objects.all():
    #     subcats[c.name] = {'id': c.id, "subcategories":Category.objects.filter(parent_category=c)}
    # category_hierarchy = {}
    # category_hierarchy["categories"] = Category.objects.filter(parent_category=None)
    # category_hierarchy["subcategories"] = Category.objects.filter(parent_category__parent_category=None)
    # category_hierarchy["subsubcategories"] = [c.id for c in Category.objects.filter(
    #     parent_category__parent_category__parent_category=None)]
    # print(category_hierarchy["subsubcategories"])
    return render(request, "bootstrap/custom_report.html", {"script_table": table, "report_form": report_form, "form": script_form, "number_of_scripts": len(scripts), "categories": Category.objects.filter(parent_category=None)})


@login_required
def get_subcategories(request, categoryid):
    subcats = Category.objects.filter(
        parent_category=get_object_or_404(Category, pk=categoryid))
    return JsonResponse({"subcategories": [{'name': cat.name, 'id': cat.id} for cat in subcats]}, safe=False)


@login_required
def reports_page(request):
    return render(
        request,
        "bootstrap/reports.html",
        {
            "scripts": Script.objects.all(),
            "categories": Category.objects.filter(parent_category=None),
            "reports": Report.objects.all()
        }
    )


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)


@register.filter
def script_sub_categories(script):
    return "foo"


@register.filter
def script_categories(script):
    return "bar"


@login_required
def delete_task(request, taskid):
    task = get_object_or_404(ReportEmailTask, pk=taskid)
    if request.method == "POST":
        task.delete()
    return redirect(report_page, task.report.name)


@login_required
def delete_report(request, reportid):
    report = get_object_or_404(Report, pk=reportid)
    if request.method == "POST":
        report.delete()
    return redirect(reports_page)


@login_required
def update_report(request, reportid):
    report = get_object_or_404(Report, pk=reportid)
    if request.method == "POST":
        update_report_pdf(report, True)
    return redirect(report_page, report.name)


@login_required
def report_page(request, reportname):
    report = get_object_or_404(Report, name=reportname)
    if request.method == "POST":
        form = NewReportTaskForm(request.POST)
        if form.is_valid():
            newtask = form.save(commit=False)
            newtask.report = report
            newtask.save()
            messages.success(request, "New schedule created")
        else:
            messages.error(request, "Unable to make new schedule")

    report_categories = {}
    for script in report.scripts.all():

        if script.category not in report_categories.keys():
            report_categories[script.category] = [script]
        else:
            report_categories[script.category].append(script)
    days_of_week = {
        "1": "Monday",
        "2": "Tuesday",
        "3": "Wednesday",
        "4": "Thursday",
        "5": "Friday",
        "6": "Saturday",
        "7": "Sunday",
        "*": "day"
    }
    return render(
        request,
        "bootstrap/report.html",
        {
            "scripts": Script.objects.all(),
            "categories": Category.objects.filter(parent_category=None),
            "report": report,
            "tasks": ReportEmailTask.objects.filter(report=report),
            "days_of_week": days_of_week,
            "report_categories": report_categories
        }
    )
