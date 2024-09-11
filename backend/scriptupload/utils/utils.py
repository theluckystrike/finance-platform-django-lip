"""
General utility functions for the scriptupload app.
"""


from .runners import run_script
from django.http import HttpResponse, HttpResponseRedirect
import logging
from django.utils import timezone
from .pdf import PDFBuilder
# from django.apps import apps


#  from https://stackoverflow.com/questions/65569673/htmx-hx-target-swap-html-vs-full-page-reload
class HTTPResponseHXRedirect(HttpResponseRedirect):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self['HX-Redirect'] = self['Location']
    status_code = 200


logger = logging.getLogger('testlogger')


# TODO: optimise - maybe make 3 different models for categories
# use get_children of Category model
def get_script_hierarchy(scripts):
    """
    {
        cat1: [
            subcat1: [
                subsubcat1: script query set,
                subsubcat2: script query set,
                ...
            ],
            ...
        ],
        ...
    ]
    """
    categories = dict()
    uncategorised = []
    for script in scripts:
        if not script.category:
            uncategorised.append(script)
            continue
        cat = script.category.parent_category.parent_category
        subcat = script.category.parent_category
        subsubcat = script.category
        if cat not in categories.keys():
            categories[cat] = {
                "subcategories": {
                    subcat: {
                        "subsubcategories": {
                            subsubcat: [script]
                        }
                    }
                }
            }
            continue
        if subcat not in categories[cat]["subcategories"].keys():
            categories[cat]["subcategories"][subcat] = {
                "subsubcategories": {
                    subsubcat: [script]
                }
            }
            continue
        if subsubcat not in categories[cat]["subcategories"][subcat]["subsubcategories"].keys():
            categories[cat]["subcategories"][subcat]["subsubcategories"][subsubcat] = [
                script]
            continue
        categories[cat]["subcategories"][subcat]["subsubcategories"][subsubcat].append(
            script)
    return categories, uncategorised


def scripts_to_pdf(scripts, title, base_url=None):
    if len(scripts) == 0:
        return None

    builder = PDFBuilder()
    builder.add_title(title)

    script_hierarchy, uncatagorised = get_script_hierarchy(scripts)

    for heading in script_hierarchy.keys():
        for subheading in script_hierarchy[heading]["subcategories"].keys():
            subsubheadings = sorted(script_hierarchy[heading]["subcategories"]
                                    [subheading]["subsubcategories"].keys(), key=lambda cat: cat.name)
            for subsubheading in subsubheadings:
                builder.add_subheading1_new_page(
                    f"{heading} &#8594; {subheading} &#8594; {subsubheading}")

                for script in script_hierarchy[heading]["subcategories"][subheading]["subsubcategories"][subsubheading]:
                    script_caption = f'last updated: {script.last_updated.strftime("%d %B %Y at %H:%M")}'
                    if base_url:
                        print(base_url, script.url)
                        script_caption += f' (<u><link href="{base_url}{script.url}">link</link></u>)'
                    if script.output_type == script.OutputDataType.MPL_PYPLT:
                        if script.has_chart_data:
                            builder.add_image(
                                script.chart_image_file, script.name, script_caption)
                    elif script.output_type == script.OutputDataType.PANDAS:
                        if script.has_table_data:
                            builder.add_table(
                                script.table_data_file, script.name, script_caption)
                    elif script.output_type == script.OutputDataType.PD_AND_MPL:
                        if script.has_chart_data:
                            builder.add_image(
                                script.chart_image_file, script.name, script_caption)
                        if script.has_table_data:
                            builder.add_table(
                                script.table_data_file, script.name, script_caption)

    if len(uncatagorised) > 0:
        builder.add_subheading1_new_page("Uncategorised")
        for script in uncatagorised:
            script_caption = f"last updated: {script.last_updated.strftime('%d %B %Y at %H:%M')}"
            if base_url:
                script_caption += f' (<u><link href="{base_url}{script.url}">link</link></u>)'
            if script.output_type == script.OutputDataType.MPL_PYPLT:
                if script.has_chart_data:
                    builder.add_image(
                        script.chart_image_file, script.name, script_caption)
            elif script.output_type == script.OutputDataType.PANDAS:
                if script.has_table_data:
                    builder.add_table(
                        script.table_data_file, script.name, script_caption)
            elif script.output_type == script.OutputDataType.PD_AND_MPL:
                if script.has_chart_data and script.table_data:
                    builder.add_image(
                        script.chart_image_file, script.name, script_caption)
                    builder.add_table(
                        script.table_data_file, script.name, script_caption)

    pdf_file = builder.to_file()
    # builder.cleanup()
    return pdf_file


def scripts_to_httpresponse(scripts, categoryname=None, runscripts=False):
    f = scripts_to_pdf(scripts, categoryname)
    # create response for downloading file
    response = HttpResponse(f, content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="{}_report_{}.pdf"'.format(
        categoryname if categoryname else "CustomReport", timezone.now().strftime("%d_%m_%Y_%H_%M")
    )
    # close buffer and return http response
    return response


def handover_report(user, report, run_scripts=False, base_url=None):
    if user is None:
        username = "None"
    else:
        username = user.username
    logger.info(
        f"[report handover] Updating report * {report.name} * for user * {username} *")
    report.update(run_scripts, base_url)
    logger.info(
        f"[report handover] Finished update of report * {report.name} * for user * {username} *")
