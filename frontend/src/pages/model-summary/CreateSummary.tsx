import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';

import Button from '@mui/material/Button';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import ListItemIcon from '@mui/material/ListItemIcon';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import useToast from '../../customHook/toast';

import type { RootState } from '../../Store';
import { Createsummerys, GetAllsummerys } from '../../Redux/TapeSummary/Slice';
import {
  getScriptByIDAction,
  ScriptState,
  GetAllScripts,
} from '../../Redux/Script/ScriptSlice';
import Loader from '../../Comopnent/ui/Loader';
interface ScriptOption {
  value: string;
  label: string;
}

const WHITELIST_IDS = [1225];

const CreateSummary = () => {
  const dispatch = useDispatch();
  const handleToast = useToast();
  const { loading, scripts, count, loadingById, scriptsMap } = useSelector<
    RootState,
    ScriptState
  >((state) => state.script);
  const [name, setName] = useState('');
  const [activeScript, setActiveScript] = useState<string>('');
  const [activeColumns, setActiveColumns] = useState([]);
  const [columnsForModelMap, setColumnsForModelMap] = useState<{
    [key: string]: any;
  }>({});
  const forSummaryScripts: ScriptOption[] = useMemo(() => {
    // const filterScript = scripts.filter(
    //   (i: any) => i.output_type === 'pd plt' || i.output_type === 'pd',
    // );

    const filtered = scripts?.length
      ? scripts
          .filter(
            (i: any) => i.output_type === 'pd plt' || i.output_type === 'pd',
          )
          .map((script: any) => ({
            value: script.id,
            label: script.name,
          }))
      : [];

    filtered.push({ value: 1225, label: 'Tape' });
    setActiveScript(filtered.length ? filtered[0].value : null);
    return filtered;
  }, [scripts]);

  useEffect(() => {
    dispatch(GetAllScripts({ query: 'for_summary=1' }));
    // dispatch(GetAllScripts({}));
  }, []);

  // const addScript = async () => {
  //   if (selectedScriptId) {
  //     const res = await dispatch(getScriptByIDAction({ id: selectedScriptId }));
  //     if (res.meta.requestStatus === 'fulfilled')
  //       setSelectScript((prev) => [...prev, res.payload]);
  //     setSelectedScriptId(null);
  //   }
  // };

  const fetchDataColumnsByScript = (id: string) => {
    dispatch(getScriptByIDAction({ id }));
  };

  useEffect(() => {
    if (activeScript) {
      let dataColumns = scriptsMap[activeScript];
      if (dataColumns) {
        // setActiveColumns(scriptsMap[activeScript])
        setActiveColumns(
          dataColumns['table_data']?.['table_meta']?.['columns'] || [],
        );
      } else {
        fetchDataColumnsByScript(activeScript);
      }
    }
  }, [activeScript]);

  useEffect(() => {
    if (scriptsMap[activeScript]) {
      let dataColumns = scriptsMap[activeScript];
      setActiveColumns(dataColumns['table_data']['table_meta']['columns']);
    }
  }, [scriptsMap]);

  const tagsForActiveColumns = useMemo(() => {
    return Object.entries(columnsForModelMap).flatMap(([scriptId, columns]) =>
      columns.map((column: string) => ({ scriptId: scriptId, column })),
    );
  }, [columnsForModelMap]);

  const resetForm = () => {
    setColumnsForModelMap([]);
    setName('');
  };

  const handleSubmit = async () => {
    const values = {
      name,
      scripts: tagsForActiveColumns.reduce((scripts, tag) => {
        scripts[tag.scriptId] = tag.column;
        return scripts;
      }, {}),
    };

    try {
      await dispatch(Createsummerys({ values }));
      handleToast.SuccessToast('Summary created successfully!');
      resetForm();
    } catch (error) {
      handleToast.ErrorToast('Failed to create summary. Please try again.');
      console.error('Error creating summary:', error);
    }
  };

  const handleScriptChange = (id: string) => {
    setActiveScript(id);
  };

  const handleColumnChange = (name: string) => {
    const tempColumnsMap = { ...columnsForModelMap };
    let activeColumns = tempColumnsMap[activeScript];

    /**** multiple data columns case ****/
    // if (!activeColumns) {
    //   activeColumns = [name];
    // } else if (activeColumns.includes(name)) {
    //   activeColumns.splice(activeColumns.indexOf(name), 1);
    // } else {
    //   activeColumns.push(name);
    // }

    /**** single data column only ****/
    if (!activeColumns) {
      activeColumns = [name];
    } else if (activeColumns.includes(name)) {
      activeColumns = [];
    } else {
      activeColumns = [name];
    }

    tempColumnsMap[activeScript] = activeColumns;
    setColumnsForModelMap(tempColumnsMap);
  };

  const getScriptNameByID = (id: string) => {
    return forSummaryScripts.filter((sc) => sc.value == id)?.[0]?.label;
  };

  const handleDeleteTag = (tag: { scriptId: string; column: string }) => {
    const tempColumnsMap = { ...columnsForModelMap };
    tempColumnsMap[tag.scriptId] = [];
    setColumnsForModelMap(tempColumnsMap);
  };

  return (
    <div className="mx-4 justify-content-center align-items-center">
      <div className="pt-3 mb-5 textalign-center">
        <h1 className="h1 ">Create Model</h1>
      </div>
      <div className="col-8 offset-2">
        <div className="d-flex col-12 mb-4">
          <div className="col-8">
            <List
              className="border-2px summary-list"
              style={{
                height: '650px',
                overflowY: 'auto',
              }}
              aria-labelledby="scripts-list-subheader"
              subheader={
                <ListSubheader
                  component="div"
                  id="scripts-list-subheader"
                  className="text-center"
                >
                  Available Scripts
                </ListSubheader>
              }
            >
              {loading ? (
                <Loader />
              ) : (
                forSummaryScripts.map((option, i) => (
                  <ListItem key={option.label}>
                    <ListItemButton
                      onClick={() => handleScriptChange(option.value)}
                      selected={option.value === activeScript}
                    >
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        {option.value === activeScript ? (
                          <IndeterminateCheckBoxIcon fontSize="medium" />
                        ) : (
                          <CheckBoxOutlineBlankIcon fontSize="medium" />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={option.label} />
                    </ListItemButton>
                  </ListItem>
                ))
              )}
            </List>
          </div>
          <div className="col-4">
            <List
              className="border-2px summary-list"
              aria-labelledby="columns-subheader"
              style={{ height: '650px', overflowY: 'auto' }}
              subheader={
                <ListSubheader
                  component="div"
                  id="columns-subheader"
                  className="text-center"
                >
                  Data Columns
                </ListSubheader>
              }
            >
              {loadingById ? (
                <Loader />
              ) : (
                activeColumns.map((col: any) => (
                  <ListItem key={col.name} disablePadding>
                    <ListItemButton
                      onClick={() => handleColumnChange(col.name)}
                      selected={columnsForModelMap[activeScript]?.includes(
                        col.name,
                      )}
                    >
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        {columnsForModelMap[activeScript]?.includes(
                          col.name,
                        ) ? (
                          <CheckBoxIcon fontSize="small" />
                        ) : (
                          <CheckBoxOutlineBlankIcon fontSize="small" />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={col.name} />
                    </ListItemButton>
                  </ListItem>
                ))
              )}
            </List>
          </div>
        </div>

        <div className="d-flex col-12 mb-4">
          <Stack direction="row" spacing={1}>
            {tagsForActiveColumns.map((tag) => (
              <Chip
                key={`${tag.scriptId} => ${tag.column}`}
                label={`${getScriptNameByID(tag.scriptId)} => ${tag.column}`}
                onDelete={() => handleDeleteTag(tag)}
              />
            ))}
          </Stack>
        </div>
        <div className="space-between col-12">
          <TextField
            id="filled-basic"
            label="Model Name"
            variant="filled"
            sx={{ width: '80%', marginRight: '20px' }}
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!(name && tagsForActiveColumns.length > 0)}
          >
            Create Model
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateSummary;
