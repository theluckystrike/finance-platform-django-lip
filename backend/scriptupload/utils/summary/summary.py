import pandas as pd
from scriptupload.models import Script


def get_date_col(script):
    for col in script.table_data.table_meta['columns']:
        if col['type'] == "date":
            return col['name']
    return None


def make_summary_table(summary) -> pd.DataFrame:
    meta = summary.meta.get("scripts", None)
    if meta is None:
        raise Exception(f"Meta on summary {summary.id} is empty")

    script_ids = [int(k) for k in meta.keys()]
    first_script = Script.objects.get(id=script_ids[0])
    summary_df = pd.read_csv(first_script.table_data_file)
    date_col_name = get_date_col(first_script)
    if date_col_name is None:
        raise Exception(f"No date column found in script {first_script.id}")
    summary_df[date_col_name] = pd.to_datetime(summary_df[date_col_name])

    summary_df = summary_df[[date_col_name,
                             meta[str(first_script.id)]["table_col_name"]]]
    date_index = date_col_name
    summary_df[date_col_name].name = date_index

    for sid in script_ids[1:]:
        script = Script.objects.get(id=sid)
        date_col_name = get_date_col(script)
        if date_col_name is None:
            continue
        sdf = pd.read_csv(script.table_data_file)[
            [date_col_name, meta[str(script.id)]["table_col_name"]]]
        sdf[date_col_name] = pd.to_datetime(sdf[date_col_name])
        summary_df = pd.merge(
            summary_df, sdf, left_on=date_index, right_on=date_col_name, how="inner")

    summary_df['total'] = summary_df[summary_df.columns[1:]].sum(axis=1)
    summary_df = summary_df.sort_values(date_index, ascending=False)
    for sid in script_ids:
        meta[str(sid)]["table_col_last_value"] = float(summary_df[meta[str(
            sid)]["table_col_name"]].iloc[0])
    return summary_df, meta
