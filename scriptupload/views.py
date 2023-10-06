from django.shortcuts import render
from django.core.files.base import ContentFile
from .forms import ScriptUploadForm, NewScriptCategory, ScriptAddCategoryForm, GenerateReportForm
from .utils import run_script, category_to_pdf
from django.shortcuts import get_object_or_404, redirect
from .models import Script, ScriptCategory
from django.contrib import messages
from django.http import HttpResponseRedirect, JsonResponse, HttpResponse
from django.urls import reverse
import nbformat
from nbconvert import PythonExporter
import os
from django.core.files import File

# TODO: always search up using pk


def upload_script(request):
    if request.method == "POST":
        form = ScriptUploadForm(request.POST, request.FILES)
        if form.is_valid():
            category_name = form.cleaned_data["category_name"]
            category = ScriptCategory.objects.get(name=category_name)
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
            script.categories.add(category)
            script.save()
            messages.success(request, "Script added successfully")
        else:
            # TODO: catch other possible issues
            messages.info(request, "A script with this name has already been added")
    else:
        form = ScriptUploadForm()
    # TODO: return only the name of scripts and categories in the context
    return render(request, "scriptupload/upload.html", {"scripts": Script.objects.all(), "categories": ScriptCategory.objects.filter(parent_category=None)})


def category_page(request, categoryname):
    category = get_object_or_404(ScriptCategory, name=categoryname)
    return render(request, "scriptupload/category.html", {"category": category, "scripts": Script.objects.all(), "categories": ScriptCategory.objects.filter(parent_category=None)})


def script_page(request, scriptname):
    # TODO: change these to use pk
    script = get_object_or_404(Script, name=scriptname)
    if request.method == "POST":
        run_script(script)
    return render(request, "scriptupload/script.html", {"script": script, "scripts": Script.objects.all(), "categories": ScriptCategory.objects.filter(parent_category=None)})


def script_edit_page(request, scriptname):
    if request.method == "GET":
        script = get_object_or_404(Script, name=scriptname)
        file_contents = script.file.read().decode("utf-8")
        return render(request, "scriptupload/script_edit.html", {'file_contents': file_contents, "script": script, "scripts": Script.objects.all(), "categories": ScriptCategory.objects.filter(parent_category=None)})
    elif request.method == "POST":
        script = get_object_or_404(Script, name=scriptname)
        # Get the edited script content from request
        edited_content = request.POST.get('edited_content', '')
        # encode and save to file
        script.file.save(os.path.basename(script.file.name), ContentFile(edited_content.encode("utf-8")))
        messages.success(request, "Script updated successfully")
        return HttpResponseRedirect(f"/scripts/{scriptname}")


def create_category(request):
    if request.method == "POST":
        form = NewScriptCategory(request.POST)
        if form.is_valid():
            print(form.cleaned_data)
            parent_id = form.cleaned_data['parent']
            if parent_id < 0:
                form.save()
            else:
                parent = get_object_or_404(ScriptCategory, pk=parent_id)
                category = form.save()
                category.parent_category = parent
                category.save()
            messages.success(request, "New category added successfully")
        else:
            # TODO: catch duplicates and create message
            messages.info(request, "Category already exists")

    return HttpResponseRedirect("/")


def script_delete_category(request, scriptid, categoryid):
    if request.method == "DELETE":
        script = get_object_or_404(Script, pk=scriptid)
        category = get_object_or_404(ScriptCategory, pk=categoryid)
        script.categories.remove(category)
        # TODO: figure out why this message does not show and there are is an
        # additional DELETE request to script/  
        messages.success(request, "Script successfully removed from category")
        return redirect(reverse('script', kwargs={"scriptname": script.name}))
    return HttpResponseRedirect("/")


def script_add_category(request, scriptid):
    if request.method == "POST":
        form = ScriptAddCategoryForm(request.POST)
        if form.is_valid():
            script = get_object_or_404(Script, pk=scriptid)
            category = get_object_or_404(ScriptCategory, pk=form.cleaned_data["category_name"])
            script.categories.add(category)
            messages.success(request, f"Script successfully added to category '{category.name}'")
        else:
            messages.error(request, f"Could not add script to category '{category.name}'")
        return redirect(reverse('script', kwargs={"scriptname": script.name}))
    return HttpResponseRedirect("/")


def script_search(request):
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


def generate_report(request):
    if request.method == "POST":
        form = GenerateReportForm(request.POST)
        if form.is_valid():
            category = get_object_or_404(ScriptCategory, pk=form.cleaned_data['category_id'])
            pdf_response = category_to_pdf(category)
            if pdf_response:
                return pdf_response
            else:
                messages.info(request, "There are no scripts in this category")
        else:
            messages.error(request, "There was an error creating the report")
    elif request.method == "GET":
        form = GenerateReportForm()
    return render(request, "scriptupload/generate_report.html", {"scripts": Script.objects.all(), "categories": ScriptCategory.objects.filter(parent_category=None)})
