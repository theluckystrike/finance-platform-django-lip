"""
General utility functions for the scriptupload app.
"""


from django.http import HttpResponse, HttpResponseRedirect
import logging
from django.utils import timezone
from .pdf import PDFBuilder
import pandas as pd
from datetime import datetime
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from io import BytesIO
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


def scripts_to_pdf(scripts, title, summaries=None, base_url=None):
    if len(scripts) == 0:
        return None

    builder = PDFBuilder(title)
    builder.add_title(title)
    # return builder.to_file()

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
                    # if base_url:
                    #     script_caption += f' (<u><link href="{base_url}{script.url}">link</link></u>)'
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
            # if base_url:
            #     script_caption += f' (<u><link href="{base_url}{script.url}">link</link></u>)'
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

    if summaries:
        builder.add_subheading1_new_page("Summaries")
        for summary in summaries:
            # summary_caption = f"last updated: {summary.last_updated.strftime('%d %B %Y at %H:%M')}"

            # 1. Add the timeseries by converting the data to a mpl chart
            builder.add_image(
              summary.mpl_chart, summary.name
            )

            # 2. Add the latest results from each script as a table
            builder.add_table(
                summary.meta_dataframe, f"{summary.name}: latest signals"
            )
            builder.add_pagebreak_if_not_empty()

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


def is_date(datestr: str) -> bool:
    if not isinstance(datestr, str):
        return False
    try:
        return bool(datetime.strptime(datestr, "%Y-%m-%d"))
    except ValueError:
        try:
            return bool(datetime.strptime(datestr, "%Y-%m-%d %H:%M:%S"))
        except ValueError:
            return False
        finally:
            return False
    except Exception as e:
        print(e)
        return False


def csv_to_meta_dict(filepath: str) -> dict[str]:
    meta = {"columns": []}
    # read and convert to native python types
    df = pd.read_csv(filepath).astype('object')
    for col in df.columns:
        c = {"name": col, "size": df[col].__len__()}
        if all(is_date(x) for x in df[col]):
            c['type'] = 'date'
        elif isinstance(df[col].iloc[0], float):
            c['type'] = 'float'
        elif isinstance(df[col].iloc[0], int):
            c['type'] = 'int'
        elif isinstance(df[col].iloc[0], str):
            c['type'] = 'string'
        else:
            print(type(df[col].iloc[0]))
            c['type'] = 'unknown'
        meta['columns'].append(c)
    return meta


def summary_json_to_mpl_buffer(json_data: dict) -> BytesIO:
    '''Convert a summary's signal_plot_data JSON to a mpl figure in a ByteIO buffer

    Expects json_data matching signal_plot_data format
    from the summary model
    i.e {"date": [...], "signal sum": []}
    '''
    df = pd.DataFrame(json_data)
    fig = plt.figure(figsize=(18, 8), dpi=300)
    dates = pd.to_datetime(df['date']).tolist()
    plt.axhline(y=0, color='black', linestyle='-', linewidth=1)
    plt.plot(dates, df['signal sum'])
    plt.xlabel('Date')
    plt.ylabel('Signal Sum')

    ax = plt.gca()
    ax.xaxis.set_major_locator(mdates.YearLocator())
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))
    ax.grid(axis='x', linestyle='-', alpha=0.3)
    ax.grid(axis='y', linestyle='-', alpha=0.3)

    latest_date = max(dates)
    latest_value = df['signal sum'][dates.index(latest_date)]
    annotation_text = f"{latest_date.strftime('%Y-%m-%d')}\nValue: {latest_value:.2f}"

    ax.annotate(
        annotation_text,
        xy=(latest_date, latest_value),
        xytext=(-30, 20),
        textcoords='offset points',
        arrowprops=dict(arrowstyle='->', color='black'),
        bbox=dict(boxstyle='round,pad=0.5', fc='white', alpha=0.5),
        fontsize=11
    )

    plt.xticks(rotation=45)
    buffer = BytesIO()
    plt.savefig(buffer, format='png', bbox_inches="tight")
    buffer.seek(0)
    plt.close()
    return buffer
