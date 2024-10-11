"""
This file contains the functions used to run scripts and capture their outputs.
"""

import sys
import traceback
import matplotlib.pyplot as plt
import pandas as pd
from io import BytesIO
from django.core.files import File
import logging

from scriptupload.utils.plotting import MpltToPlotly
logger = logging.getLogger('testlogger')


plt.switch_backend("agg")
ORIGINAL_PLT_SAVE = plt.savefig
mpl_plt_buffer = None
mpl_plotly_json = None


def custom_savefig(*args, **kwargs):
    global mpl_plt_buffer, mpl_plotly_json
    try:
        fig = plt.gcf()
        converter = MpltToPlotly(fig)
        converter.crawl_fig()
        mpl_plotly_json = converter.json
    except Exception as e:
        logger.error(
            f"[plotly script runner] Failed to convert matplotlib plot to plotly JSON with error -> {e}")
    if args and isinstance(args[0], str):
        buffer = BytesIO()
        ORIGINAL_PLT_SAVE(buffer, format='png', dpi=300)
        mpl_plt_buffer = buffer
        mpl_plt_buffer.seek(0)


def custom_show(*args, **kwargs):
    # https://matplotlib.org/stable/gallery/user_interfaces/web_application_server_sgskip.html
    # monkey patch function to prevent memory leak in matplotlib.pyplot
    plt.close('all')


ORIGINAL_PD_TO_CSV = pd.DataFrame.to_csv
pandas_csv_buffer = None


def custom_to_csv(self, *args, **kwargs):
    global pandas_csv_buffer
    if args and isinstance(args[0], str):
        buffer = BytesIO()
        ORIGINAL_PD_TO_CSV(self.round(2), buffer)
        pandas_csv_buffer = buffer
        pandas_csv_buffer.seek(0)
        del buffer


def setup_patched_env():
    import matplotlib.pyplot as patched_plt
    import pandas as patched_pd
    patched_plt.switch_backend("agg")
    patched_plt.rcParams["legend.labelcolor"] = '000000'
    patched_plt.rcParams["legend.framealpha"] = 1.0

    patched_plt.savefig = custom_savefig
    patched_plt.show = custom_show

    patched_pd.DataFrame.to_csv = custom_to_csv

    patched_namespace = {
        'pandas': patched_pd,
        'matplotlib.pyplot': patched_plt
    }
    return patched_namespace


def clear_buffers():
    global pandas_csv_buffer, mpl_plt_buffer, mpl_plotly_json
    pandas_csv_buffer = None
    mpl_plt_buffer = None
    mpl_plotly_json = None


def run_script(script):
    logger.info(
        f"[script runner] Running script * {script.name} *")
    env = setup_patched_env()
    excStatus = script.ExecutionStatus

    plt_success = False
    pd_success = False
    error_message = ""

    try:
        exec(script.file.read(), env)
    except:
        exc_info = sys.exc_info()
        exc_str = "".join(traceback.format_exception(*exc_info))
        logger.error(
            f"[script runner] Failed to run script * {script.name} * with error -> \n{exc_str}")
        script.set_status(excStatus.FAILURE,  exc_str)
        return False, exc_str
    if mpl_plt_buffer:
        script.save_chart("output_plot.png", File(mpl_plt_buffer))
        script.set_last_updated()
        script.set_status(excStatus.SUCCESS)
        logger.info(
            f"[matplotlib-pyplot script runner] Successfully captured chart for script * {script.name} *")
        plt_success = True

    if mpl_plotly_json:
        script.save_plotly_config(mpl_plotly_json)
        logger.info(
            f"[plotly script runner] Successfully converted matplotlib plot to plotly JSON for script * {script.name} *")

    if pandas_csv_buffer:
        script.save_table("output_table.csv", File(pandas_csv_buffer))
        script.set_last_updated()
        script.set_status(excStatus.SUCCESS)
        logger.info(
            f"[pandas script runner] Successfully captured table for script * {script.name} *")
        pd_success = True

    success_flag = plt_success or pd_success
    if not success_flag:
        error_message = "Could not find an output, are you using to_csv() (pandas) or savefig() (matplotlib.pyplot)?"
        logger.error(
            f"[script runner] Could not find an output for script * {script.name} *")
        script.set_status(excStatus.FAILURE, error_message)
    clear_buffers()
    logger.info(f"[script runner] Successfully ran script * {script.name} *")
    return success_flag, error_message
