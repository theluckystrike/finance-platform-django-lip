import pandas as pd
from scriptupload.models import Script


def get_date_col(script: Script) -> str:
    '''Get the first column in a script's table data which is a date type'''
    for col in script.table_data.table_meta['columns']:
        if col['type'] == "date":
            return col['name']
    return None


def make_summary_table(summary) -> tuple[pd.DataFrame, dict]:
    meta = summary.meta.get("scripts", None)
    if meta is None:
        raise Exception(f"Meta on summary {summary.id} is empty")

    script_ids = [int(k) for k in meta.keys()]
    first_script = Script.objects.get(id=script_ids[0])
    # init df with first script data
    summary_df = pd.read_csv(first_script.table_data_file)
    date_col_name = get_date_col(first_script)
    if date_col_name is None:
        raise Exception(f"No date column found in script {first_script.id}")

    date_index = "date"
    summary_df.rename(columns={date_col_name: date_index}, inplace=True)

    # convert data column to datetime and change name
    summary_df[date_index] = pd.to_datetime(summary_df[date_index])
    summary_df = summary_df[[date_index,
                             meta[str(first_script.id)]["table_col_name"]]]

    # naming the data for each script in the summary df with its unique ID
    summary_df.rename(
        columns={meta[str(first_script.id)]["table_col_name"]: first_script.id}, inplace=True)

    # for each script, merge it into the df on matching dates

    signal_columns_names = []
    for sid in script_ids[1:]:
        script = Script.objects.get(id=sid)
        date_col_name = get_date_col(script)
        if date_col_name is None:
            raise Exception(
                f"Script {script.name} has no valid date column in its table data")
        sdf = pd.read_csv(script.table_data_file)[
            [date_col_name, meta[str(script.id)]["table_col_name"]]]
        sdf[date_col_name] = pd.to_datetime(sdf[date_col_name])
        # naming the data for each script in the summary df with its unique ID
        sdf.rename(columns={meta[str(script.id)]["table_col_name"]: sid}, inplace=True)
        summary_df = pd.merge(
            summary_df, sdf, left_on=date_index, right_on=date_col_name, how="inner")
        signal_columns_names.append(meta[str(script.id)]["table_col_name"])

    # get sum of all cols and sort by date index descending
    # we can now sum only the relevant data by indexing by ID
    summary_df['signal sum'] = summary_df[script_ids].sum(axis=1)
    summary_df = summary_df.sort_values(date_index, ascending=False)
    # update meta last value
    for sid in script_ids:
        meta[str(sid)]["table_col_last_value"] = float(summary_df[sid].iloc[0])

    # keep date format
    summary_df[date_index] = summary_df[date_index].map(
        lambda x: x.isoformat())
    summary_df = summary_df[[date_index, "signal sum"]]
    # https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_json.html
    summary_json = df_to_json_no_index(summary_df[[date_index, 'signal sum']])
    return summary_json, meta


def df_to_json_no_index(df: pd.DataFrame) -> object:
    df_dict = dict({
        col: df[col].to_list()
        for col in df.columns
    })
    return df_dict
