# rest api modules
from rest_framework import status, viewsets, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
#from .models import Category, Script
#from ..models import Category, Script
#from .serializers import CategorySerializer,ScriptSerializer
from ..serializers import CategorySerializer, ScriptSerializer
from rest_framework.views import APIView
from rest_framework.generics import UpdateAPIView

# end rest apis

from django.http import HttpResponseRedirect, JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.utils.safestring import mark_safe
from ..forms import NewCategoryForm
from ..models import Category, Script
from ..utils.utils import scripts_to_httpresponse, HTTPResponseHXRedirect
from ..tables import DragnDropTable
from django_tables2 import RequestConfig
import logging



# this is web logic functions
logger = logging.getLogger('testlogger')

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


@login_required
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


@login_required
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
def delete_category(request, pk):
    category = get_object_or_404(Category, id=pk)
    if request.method == "DELETE":
        cname = category.name
        category.delete()
        logger.info(f"[category views] Deleted category '{cname}' with ID={pk}")

    referer = request.META.get('HTTP_REFERER')
    if referer:
        return HTTPResponseHXRedirect(redirect_to=referer)
    else:
        return HttpResponseRedirect('/')


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

# end web logic



# rest apis logic
"""class GenerateCategoryReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, categoryname):
        category = get_object_or_404(Category, name=categoryname)
        scripts = Script.objects.filter(category=category).order_by("index_in_category")

        if scripts.exists():
            response = scripts_to_httpresponse(scripts, categoryname)
            return response
        return Response({"message": "The selected category contains no scripts"}, status=status.HTTP_200_OK)"""

"""class CategoryScriptsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, categoryname):
        category = get_object_or_404(Category, name=categoryname)
        scripts = Script.objects.filter(category=category).order_by("index_in_category")
        serializer = ScriptSerializer(scripts, many=True)

        categories = Category.objects.filter(parent_category=None)

        return Response({
            "scripts": serializer.data,
            "category": categoryname,
            "categories": [{"id": cat.id, "name": cat.name} for cat in categories]
        })"""

"""class UpdateCategoryView(UpdateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        category = self.get_object()  # Use self.get_object() to get the instance
        serializer = self.get_serializer(category, data=request.data)

        if serializer.is_valid():
            ob = serializer.save(commit=False)

            parent = serializer.validated_data.get("parent", None)
            

            ob_type = ob.get_level()
            if parent == -1:
                if ob_type != 0:
                    return Response({"error": "Cannot promote category"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    ob.parent_category = None
                    ob.save()
                    return Response({"success": "Successfully updated"})
            elif parent == ob.id:
                return Response({"error": "Cannot make category a subcategory of itself"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                parent_cat = get_object_or_404(Category, pk=parent)
                parent_cat_type = parent_cat.get_level()
                if (ob_type == 2 and parent_cat_type == 1) or (ob_type == 1 and parent_cat_type == 0):
                    ob.parent_category = parent_cat
                    ob.save()
                    return Response({"success": "Successfully updated"})
                else:
                    return Response({"error": "Not allowed"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)"""


class UpdateCategoryView(UpdateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        category = self.get_object()  # Use self.get_object() to get the instance
        serializer = self.get_serializer(category, data=request.data)

        if serializer.is_valid():
            parent = serializer.validated_data.get("parent", None)
            ob = serializer.validated_data

            ob_type = category.get_level()
            if parent == -1:
                if ob_type != 0:
                    return Response({"error": "Cannot promote category"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    category.parent_category = None
                    category.save()
                    return Response({"success": "Successfully updated"})
            elif parent == category.id:
                return Response({"error": "Cannot make category a subcategory of itself"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                parent_cat = get_object_or_404(Category, pk=parent)
                parent_cat_type = parent_cat.get_level()
                if (ob_type == 2 and parent_cat_type == 1) or (ob_type == 1 and parent_cat_type == 0):
                    category.parent_category = parent_cat
                    category.save()
                    return Response({"success": "Successfully updated"})
                else:
                    return Response({"error": "Not allowed"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class CreateCategoryView(generics.CreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response({"message": "New category added successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteCategoryView(generics.DestroyAPIView):
    queryset = Category.objects.all()
    permission_classes = [IsAuthenticated]

    def destroy(self, request, pk, *args, **kwargs):
        category = get_object_or_404(Category, pk=pk)
        self.perform_destroy(category)
        return Response({"message": f"Deleted category '{category.name}'"}, status=status.HTTP_204_NO_CONTENT)





class GenerateCategoryReportView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, categoryid):
        category = get_object_or_404(Category, pk=categoryid)
        scripts = category.script_set.all().order_by("index_in_category")
        if scripts.exists():
            pdf_response = scripts_to_httpresponse(scripts, categoryname=category.name)
            if pdf_response:
                return pdf_response
            else:
                return Response({"error": "Failed to create report"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        return Response({"message": "The selected category contains no scripts"}, status=status.HTTP_200_OK)



class GetSubcategoriesView(generics.ListAPIView):
    serializer_class = CategorySerializer  # Assuming you're returning a list of categories
    permission_classes = [IsAuthenticated]

    def list(self, request, categoryid, *args, **kwargs):
        category = get_object_or_404(Category, pk=categoryid)
        subcategories = Category.objects.filter(parent_category=category)
        return Response({"subcategories": [{'name': cat.name, 'id': cat.id} for cat in subcategories]})




class CategoryScriptsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, categoryname):
        category = get_object_or_404(Category, name=categoryname)
        scripts = Script.objects.filter(category=category).order_by("index_in_category")
        serializer = ScriptSerializer(scripts, many=True)

        categories = Category.objects.filter(parent_category=None)

        return Response({
            "scripts": serializer.data,
            "category": categoryname,
            "categories": [{"id": cat.id, "name": cat.name} for cat in categories]
        })

class CategoryManagerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Prepare the data for the response
        scripts = Script.objects.all()
        categories = Category.objects.all()
        #categories = Category.objects.filter(parent_category=None)

        # Serialize the data
        scripts_serializer = ScriptSerializer(scripts, many=True)
        categories_serializer = CategorySerializer(categories, many=True)

        # If you want to include form data, you could serialize it here.
        # For example, if using a form serializer:
        # form_serializer = NewCategoryFormSerializer()

        # Construct the response data
        response_data = {
            "scripts": scripts_serializer.data,
            "categories": categories_serializer.data,
            # "form": form_serializer.data,  # Include this if you need to return form structure or initial data
        }

        return Response(response_data)


"""class CategoryManagerAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Prepare the data for the response
        scripts = Script.objects.all()
        categories = Category.objects.filter(parent_category=None)

        # Serialize the data
        scripts_serializer = ScriptSerializer(scripts, many=True)
        categories_serializer = CategorySerializer(categories, many=True)

        # Construct the response data
        response_data = {
            "scripts": scripts_serializer.data,
            "categories": categories_serializer.data,
        }

        return Response(response_data)
"""