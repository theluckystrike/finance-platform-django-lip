from datetime import datetime
from django.shortcuts import render, redirect, get_object_or_404
from django.core.files.base import ContentFile
from django.utils.safestring import mark_safe
from ..forms import ScriptUploadForm
from ..utils import run_script
from ..models import Script, Category
from django.contrib import messages
from django.http import HttpResponseRedirect, JsonResponse
import nbformat
from nbconvert import PythonExporter
import os
from django.core.files import File
from django.contrib.auth.decorators import login_required
from ..tables import ScriptTable
from django_tables2 import RequestConfig


@login_required
def upload_script(request):
    """
    Configures the page that shows when "Upload a script" is clicked in the sidebar.
    """
    if request.method == "POST":
        form = ScriptUploadForm(request.POST, request.FILES)
        if form.is_valid():
            file = form.cleaned_data['file']
            script = form.save(commit=False)
            if (not file.name.endswith(".py")) and (not file.name.endswith(".ipynb")):
                messages.error(request, "Not a valid python file")
            if file.name.endswith('.ipynb'):
                # if the file is a jupyter notebook, we need to convert it
                nb_content = nbformat.read(file, as_version=4)
                exporter = PythonExporter()
                (python_code, resources) = exporter.from_notebook_node(nb_content)
                python_file_name = file.name.replace('.ipynb', '.py')
                # TODO: use a buffer here
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

            messages.success(request, "Script added successfully")
        else:
            messages.info(
                request, "A script with this name has already been added")
    else:
        form = ScriptUploadForm()
    return render(request, "bootstrap/script/upload.html", {"scripts": Script.objects.all(), "categories": Category.objects.filter(parent_category=None)})


@login_required
def all_script_page(request):
    """
    Configures the page that is shown when "All scripts" is clicked in the sidebar.
    """
    scripttable = ScriptTable(Script.objects.all())
    RequestConfig(request).configure(scripttable)
    # category = get_object_or_404(Category, name=categoryname)
    return render(request, "bootstrap/script/all_scripts.html", {"scripts": Script.objects.all(), "script_table": scripttable, "categories": Category.objects.filter(parent_category=None)})


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
            nameform.save()
        return redirect(script_page, nameform.cleaned_data['name'])
    else:
        nameform = ScriptUploadForm(instance=script)
    return render(request, "bootstrap/script/script.html", {'nameform': nameform, "script": script, "scripts": Script.objects.all(), "categories": Category.objects.filter(parent_category=None)})


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
        return render(request, "bootstrap/script/script_edit.html", {'file_contents': file_contents, "script": script, "scripts": Script.objects.all(), "categories": Category.objects.filter(parent_category=None)})
    elif request.method == "POST":
        script = get_object_or_404(Script, name=scriptname)
        # Get the edited script content from request
        edited_content = request.POST.get('edited_content', '')
        # encode and save to file
        script.file.save(os.path.basename(script.file.name),
                         ContentFile(edited_content.encode("utf-8")))
        script.last_updated = datetime.now()
        script.save(update_fields=["last_updated"])
        messages.success(request, "Script updated successfully")
        return HttpResponseRedirect(f"/scripts/{scriptname}")


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
