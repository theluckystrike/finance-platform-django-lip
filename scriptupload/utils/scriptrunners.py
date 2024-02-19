from pandas.core.frame import DataFrame
import matplotlib.pyplot as plt
from django.core.files import File
from django.utils import timezone
from io import BytesIO
import logging

logger = logging.getLogger('testlogger')


def run_script(script_instance):
    if script_instance.output_type == "plt":
        return run_script_matplotlib_pyplot(script_instance)
    elif script_instance.output_type == "pd":
        return run_script_pandas(script_instance)


plt.switch_backend("agg")
ORIGINAL_PLT_SAVE = plt.savefig
mpl_plt_buffer = None


def custom_savefig(*args, **kwargs):
    global mpl_plt_buffer
    if args and isinstance(args[0], str):
        buffer = BytesIO()
        ORIGINAL_PLT_SAVE(buffer, format='png', dpi=300)
        mpl_plt_buffer = buffer
        mpl_plt_buffer.seek(0)
        del buffer


def run_script_matplotlib_pyplot(script_instance):
    """
    Runs a script and saves the result back to storage, deleting the previous version.

    :param file: The file that contains the script to be run.
    :return: True if ran script with no errors, stacktrace as string
    otherwise.
    """
    logger.info(
        f"[matplotlib-pyplot script runner] Running script * {script_instance.name} *")
    assert script_instance.output_type == 'plt'
    import matplotlib.pyplot as plt
    plt.switch_backend("agg")
    global mpl_plt_buffer

    def custom_show(*args, **kwargs):
        # https://matplotlib.org/stable/gallery/user_interfaces/web_application_server_sgskip.html
        # monkey patch function to prevent memory leak in matplotlib.pyplot
        plt.close('all')

    script = script_instance.file
    if script_instance.status != "running":
        script_instance.status = "running"
        script_instance.error_message = ""
        script_instance.save(update_fields=["status", "error_message"])

    plt.savefig = custom_savefig
    plt.show = custom_show

    script_namespace = {
        'plt': plt,
    }

    success_flag = False
    error_message = ""

    try:
        exec(script.read(), script_namespace)
    except Exception as e:
        # try this: exc_info = sys.exc_info()
        # exc_string = ''.join(traceback.format_exception(*exc_info))
        logger.error(
            f"[matplotlib-pyplot script runner] Failed to run script * {script_instance.name} * with error -> \n{e}")
        script_instance.status = "failure"
        script_instance.error_message = e
        script_instance.save(update_fields=["status", "error_message"])
        error_message = str(e)

    if mpl_plt_buffer:
        script_instance.image.save("output_plot.png", File(mpl_plt_buffer))
        script_instance.last_updated = timezone.now()
        script_instance.status = "success"
        script_instance.save(update_fields=["status", "last_updated"])
        logger.info(
            f"[matplotlib-pyplot script runner] Successfully ran script * {script_instance.name} *")
        success_flag = True
    else:
        # savefig has been monkey patched
        plt.savefig("output_plot_forced.png", dpi=300)
        if mpl_plt_buffer:
            script_instance.image.save(
                "output_plot_forced.png", File(mpl_plt_buffer))
            script_instance.last_updated = timezone.now()
            script_instance.status = "success"
            script_instance.save(update_fields=["status", "last_updated"])
            logger.info(
                f"[matplotlib-pyplot script runner] Successfully ran script * {script_instance.name} *")
            success_flag = True
            mpl_plt_buffer.close()
        else:
            script_instance.status = "failure"
            script_instance.error_message = "Could not find script plot, are you using matplotlib.pyplot?"
            script_instance.save(update_fields=["status", "error_message"])
            logger.error(
                f"[matplotlib-pyplot script runner] The script * {script_instance.name} * did not output an image")
            error_message = "Could not find script plot"

    mpl_plt_buffer = None
    plt.close('all')
    del plt
    return success_flag, error_message


ORIGINAL_PD_TO_CSV = DataFrame.to_csv
pandas_csv_buffer = None


def custom_to_csv(self, *args, **kwargs):
    global pandas_csv_buffer
    if args and isinstance(args[0], str):
        buffer = BytesIO()
        ORIGINAL_PD_TO_CSV(self, buffer, index=False)
        pandas_csv_buffer = buffer
        pandas_csv_buffer.seek(0)
        del buffer


def run_script_pandas(script_instance):
    """
    Runs a script and saves the result back to storage, deleting the previous version.

    :param file: The file that contains the script to be run.
    :return: True if ran script with no errors, stacktrace as string
    otherwise.
    """

    logger.info(f"[pandas-csv script runner] Running script * {script_instance.name} *")
    assert script_instance.output_type == 'pd'
    global pandas_csv_buffer
    import pandas as pd

    script = script_instance.file
    if script_instance.status != "running":
        script_instance.status = "running"
        script_instance.error_message = ""
        script_instance.save(update_fields=["status", "error_message"])

    pd.DataFrame.to_csv = custom_to_csv

    script_namespace = {
        'pandas': pd,
    }

    success_flag = False
    error_message = ""

    try:
        exec(script.read(), script_namespace)
    except Exception as e:
        logger.error(
            f"[pandas-csv script runner] Failed to run script * {script_instance.name} * with error -> \n{e}")
        script_instance.status = "failure"
        script_instance.error_message = e
        script_instance.save(update_fields=["status", "error_message"])
        error_message = str(e)

    if pandas_csv_buffer:
        script_instance.table_file.save(
            "output_table.csv", File(pandas_csv_buffer))
        script_instance.last_updated = timezone.now()
        script_instance.status = "success"
        script_instance.save(update_fields=["status", "last_updated"])
        logger.info(
            f"[pandas-csv script runner] Successfully ran script * {script_instance.name} *")
        success_flag = True
        pandas_csv_buffer.close()
    else:
        script_instance.status = "failure"
        script_instance.error_message = "Could not find a pandas DataFrame in this script, are you using pandas?"
        script_instance.save(update_fields=["status", "error_message"])
        logger.error(
            f"[pandas-csv script runner] The script * {script_instance.name} * did not output an image")
        error_message = "Could not find script plot"
    pandas_csv_buffer = None
    del pd
    return success_flag, error_message
