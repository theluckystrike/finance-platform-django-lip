import os
import pandas as pd
import matplotlib.pyplot as plt
from django.conf import settings
from financeplatform.storage_backends import PrivateMediaStorage
from django.core.files import File
from django.core.files.storage import default_storage


# not used
def handle_script_upload(file):
    print("file recieved", file.name)
    path = f"scripts/{file.name.replace('.py', '')}/{file.name}"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb+") as destination:
        for chunk in file.chunks():
            destination.write(chunk)


# run the script assuming that it saves the chart image as output
def run_script(file):
    # find the script
    script_dir = os.path.dirname(file.file.name)
    os.makedirs(script_dir, exist_ok=True)
    # chose appropriate storage and open file
    storage = PrivateMediaStorage() if settings.USE_S3 else default_storage
    script = storage.open(file.file.name)
    # move to script directory and execute
    os.chdir(script_dir)
    exec(script.read())
    img = [f for f in os.listdir() if f.endswith('.png')]
    if len(img) > 0:
        # if the script has already saved an image
        i = open(img[-1], 'rb')
        if not storage.exists(os.path.join(script_dir, img[-1])):
            storage.save(os.path.join(script_dir, img[-1]), File(i))
        file.image = os.path.join(script_dir, img[-1])
        file.save(update_fields=["image"])
        i.close()
    script.close()
    os.chdir(settings.BASE_DIR)


def new_run_script(file):
    # maybe do this in another thread?
    # find file
    script_dir = os.path.dirname(file.file.name)
    os.makedirs(script_dir, exist_ok=True)
    # chose appropriate storage and open file
    storage = PrivateMediaStorage() if settings.USE_S3 else default_storage
    script = storage.open(file.file.name)
    # move to script directory and execute
    os.chdir(script_dir)
    # open and execute file
    exec(script.read())
    # find dataframe with data
    df = locals().get("df")
    if df is not None:
        # plot chart
        pass
    else:
        # report issue
        pass
    # save chart to storage and script model
    # close all files


# run the script assuming that the data to be plotted has been saved by
# the script as a csv with any name
def run_script_with_data(file):
    # get the script directory
    script_dir = os.path.dirname(file.file.name)
    # create it if it does not exist
    os.makedirs(script_dir, exist_ok=True)
    # select appropriate storage and open file
    storage = PrivateMediaStorage() if settings.USE_S3 else default_storage
    script = storage.open(file.file.name)
    # move to script's directory and execute script
    os.chdir(script_dir)
    exec(script.read())
    script.close()
    # locate csv file that was saved by the script
    data_to_plot = [f for f in os.listdir() if f.endswith('.csv')]
    # if a csv file is found
    if len(data_to_plot) > 0:
        data = pd.read_csv(data_to_plot[-1])
        data_file = open(data_to_plot[-1], 'rb')
        # save to storage if it is not there already
        if not storage.exists(os.path.join(script_dir, data_to_plot[-1])):
            storage.save(os.path.join(script_dir, data_to_plot[-1]), File(data_file))
        print(data.columns)
        
        plt.figure(figsize=(12,6))
        data.columns = [c.capitalize() for c in data.columns]
        # convert date string to datetime
        data['Date'] = pd.to_datetime(data['Date'])
        # plot 
        plt.xlabel("Date")
        plt.ylabel(data.columns[1])
        plt.title("test")
        plt.plot(data['Date'], data['Close'])
        plt.savefig(data_to_plot[-1].replace('.csv', '.png'))
        file.image = os.path.join(script_dir, data_to_plot[-1].replace('.csv', '.png'))
        file.save(update_fields=["image"])
        data_file.close()
        # TODO: support for two y axes, standardise column names
        # TODO: add csv to script model for quicker access?

    os.chdir(settings.BASE_DIR)

