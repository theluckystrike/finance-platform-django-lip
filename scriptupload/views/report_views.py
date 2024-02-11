from django.http import JsonResponse
from django.urls import reverse
from ..utils import get_script_hierarchy
from django.shortcuts import render, redirect, get_object_or_404
from django.utils.safestring import mark_safe
from ..forms import ScriptSelectForm, NewReportForm, NewReportTaskForm
from ..utils import run_script, scripts_to_httpresponse, handover_report, HTTPResponseHXRedirect
from ..models import Script, Category, Report, ReportEmailTask
from django.contrib import messages
from django.template.defaulttags import register
from django.contrib.auth.decorators import login_required
from ..tables import ScriptTable, ReportScriptTable
from django_tables2 import RequestConfig
from django.apps import apps
import logging

logger = logging.getLogger('testlogger')


@login_required
def save_custom_report(request):
    if request.method == "POST":
        form = NewReportForm(request.POST)
        if form.is_valid():
            report = form.save()
            report.added_by = request.user
            report.save(update_fields=["added_by"])
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
    filtercat = None
    filtersubcat1 = None
    filtersubcat2 = None
    if category:
        scripts = Script.objects.filter(
            category__parent_category__parent_category_id=category)
        filtersubcat1 = Category.objects.filter(parent_category_id=category)
        filtercat = category

    if subcategory1 and category:
        scripts = Script.objects.filter(
            category__parent_category_id=subcategory1)
        filtersubcat2 = Category.objects.filter(
            parent_category_id=subcategory1)

    if subcategory2 and subcategory2 and category:
        scripts = Script.objects.filter(category_id=subcategory2)

    table = ScriptTable(scripts, order_by="-created")
    RequestConfig(request, paginate=False).configure(table)

    script_form = ScriptSelectForm()
    report_form = NewReportForm()
    return render(
        request,
        "bootstrap/report/custom_report.html",
        {
            "catfilter": filtercat,
            "subcat1filter": filtersubcat1,
            "subcat1": subcategory1,
            "subcat2filter": filtersubcat2,
            "subcat2": subcategory2,
            "script_table": table,
            "report_form": report_form,
            "form": script_form,
            "number_of_scripts": len(scripts),
            "categories": Category.objects.filter(parent_category=None)
        }
    )


@login_required
def reports_page(request):
    return render(
        request,
        "bootstrap/report/reports.html",
        {
            "scripts": Script.objects.all(),
            "categories": Category.objects.filter(parent_category=None),
            "reports": Report.objects.all()
        }
    )


@register.filter
def get_item(dictionary, key):
    return dictionary.get(key)


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
        task_queue = apps.get_app_config("scriptupload").executor
        task_queue.submit(handover_report, request.user, report, True)
        logger.info(
            f"[task queue] Added update of report * {report.name} * by user * {request.user.username} * to task queue")
    return redirect(report_page, report.name)


@login_required
def remove_script_from_report(request, reportname, scriptid):
    report = get_object_or_404(Report, name=reportname)
    if request.method == "DELETE":
        script = Script.objects.get(id=scriptid)
        report.scripts.remove(script)
        logger.info(
            f"[task queue] Removed script * {script.name}, ID:{script.id} * from report * {report.name} *")
    return HTTPResponseHXRedirect(redirect_to=reverse("report", args=(report.name,)))


@login_required
def add_script_to_report(request, reportname, scriptid):
    report = get_object_or_404(Report, name=reportname)
    if request.method == "GET":
        script = Script.objects.get(id=scriptid)
        report.scripts.add(script)
        logger.info(
            f"[task queue] Added script * {script.name}, ID:{script.id} * to report * {report.name} *")
    return HTTPResponseHXRedirect(redirect_to=reverse("report", args=(report.name,)))


@login_required
def get_report_status(request, reportid):
    report = get_object_or_404(Report, pk=reportid)
    if request.method == "GET":
        report_status = report.status
        if report_status == "success" or report_status == "running":
            return JsonResponse({"status": report_status})
        elif report_status == "failure":
            return JsonResponse({"status": report_status, "error_message": report.error_message})


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

    report_categories, uncategorised = get_script_hierarchy(
        report.scripts.all().order_by("index_in_category"))
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
    table = ReportScriptTable(report.scripts.all(), order_by="subcategory2")
    RequestConfig(request, paginate=False).configure(table)
    return render(
        request,
        "bootstrap/report/report.html",
        {
            "scripts": Script.objects.all(),
            "categories": Category.objects.filter(parent_category=None),
            "report": report,
            "tasks": ReportEmailTask.objects.filter(report=report),
            "days_of_week": days_of_week,
            "report_categories": report_categories,
            "uncategorised_scripts": uncategorised,
            "report_scripts_table": table
        }
    )
