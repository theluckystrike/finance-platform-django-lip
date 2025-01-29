import { FC, useState, useEffect, useMemo } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import useToast from '../../../../customHook/toast';
import {
  getScriptByIDAction,
  GetAllScripts,
  ScriptState,
} from '../../../../Redux/Script/ScriptSlice';
import { Updatesummeryss } from '../../../../Redux/TapeSummary/Slice';
import Loader from '../../Loader';

import type { RootState } from '../../../../Store';

interface ScriptOption {
  value: string;
  label: string;
}

interface EditSummaryProps {
  show: boolean;
  handleClose: () => void;
  data: any;
}

const EditSummary: FC<EditSummaryProps> = ({ show, handleClose, data }) => {
  const dispatch = useDispatch();
  const handleToast = useToast();

  const { loading, scripts, scriptsMap } = useSelector<
    RootState,
    ScriptState
  >((state) => state.script);


  const [name, setName] = useState('');
  const [activeScript, setActiveScript] = useState<string>('');
  const [activeColumns, setActiveColumns] = useState([]);
  const [columnsForModelMap, setColumnsForModelMap] = useState<{
    [key: string]: any;
  }>(() => {
    const initialMap: { [key: string]: any } = {};
    Object.entries(data?.meta?.scripts || {}).forEach(([scriptId, column]) => {
      initialMap[scriptId] = [column];
    });
    return initialMap;
  });


  useEffect(() => {
      setName(data?.name)
      dispatch(GetAllScripts({ query: 'for_summary=1' }));
  }, [data]);


  useEffect(() => {
    if (activeScript) {
      let dataColumns = scriptsMap[activeScript];
      if (dataColumns) {
        setActiveColumns(
          dataColumns?.['table_data']?.['table_meta']?.['columns'] || [],
        );
      } else {
        dispatch(getScriptByIDAction({ id: activeScript }));
      }
    }
  }, [activeScript, scriptsMap]);


  const forSummaryScripts: ScriptOption[] = useMemo(() => {
    return scripts?.length
      ? scripts.map((script: any) => ({
          value: script.id,
          label: script.name,
        }))
      : [];
  }, [scripts]);


  const tagsForActiveColumns = useMemo(() => {
    return Object.entries(columnsForModelMap).flatMap(([scriptId, columns]) =>
      columns.map((column: string) => ({ scriptId: scriptId, column })),
    );
  }, [columnsForModelMap]);


  const handleColumnChange = (name: string) => {
    const tempColumnsMap = { ...columnsForModelMap };
    let activeColumns = tempColumnsMap[activeScript];

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


  const handleDeleteTag = (tag: { scriptId: string; column: string }) => {
    const tempColumnsMap = { ...columnsForModelMap };
    tempColumnsMap[tag.scriptId] = [];
    setColumnsForModelMap(tempColumnsMap);
  };


  const resetForm = () => {
    setName(data?.name || '');
    setColumnsForModelMap(
      Object.entries(data?.meta?.scripts || {}).reduce((acc, [scriptId, column]) => {
        acc[scriptId] = [column];
        return acc;
      }, {} as { [key: string]: any }),
    );
  };


  const handleSubmit = async () => {
    const values = {
        name,
        scripts: tagsForActiveColumns.reduce((scripts, tag) => {
            scripts[tag.scriptId] = tag.column;
            return scripts;
        }, {}),
    };

    if (Object.keys(values.scripts).length === 0) {
        handleToast.ErrorToast('Scripts cannot be empty.');
        return;
    }

    try {
        await dispatch(Updatesummeryss({ id: data?.id, values }));
        handleToast.SuccessToast('Summary updated successfully!');
        handleClose();
        resetForm();
    } catch (error) {
        handleToast.ErrorToast('Failed to update summary. Please try again.');
        console.error('Error updating summary:', error);
        resetForm();
    }
  };

  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      show={show}
      onHide={handleClose}
    >
      <Modal.Body className="bg-light-green" style={{ borderRadius: '25px' }}>
        <h4 className="text-center mb-4">Edit Summary {data?.id}</h4>
        <div className="col-12 d-flex flex-column align-center justify-content-center w-100">
          <div className="bg-white d-flex col-9 mb-4">
            <div className="col-8">
              <List
                className="border-2px summary-list"
                style={{
                  height: '350px',
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
                  forSummaryScripts.map((option) => (
                    <ListItem key={option.label}>
                      <ListItemButton
                        onClick={() => setActiveScript(option.value)}
                        selected={option.value === activeScript}
                      >
                        <ListItemIcon sx={{ minWidth: '30px' }}>
                          {option.value === activeScript ? (
                            <CheckBoxIcon fontSize="medium" />
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
            <div className="col-8">
              <List
                className="border-2px summary-list bg-white"
                aria-labelledby="columns-subheader"
                style={{ height: '350px', overflowY: 'auto' }}
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
                {activeColumns.map((col: any) => (
                  <ListItem key={col.name} disablePadding>
                    <ListItemButton
                      onClick={() => handleColumnChange(col.name)}
                      selected={columnsForModelMap[activeScript]?.includes(
                        col.name,
                      )}
                    >
                      <ListItemIcon sx={{ minWidth: '30px' }}>
                        {columnsForModelMap[activeScript]?.includes(col.name) ? (
                          <CheckBoxIcon fontSize="small" />
                        ) : (
                          <CheckBoxOutlineBlankIcon fontSize="small" />
                        )}
                      </ListItemIcon>
                      <ListItemText primary={col.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </div>
          </div>

          <div className="d-flex col-12 mb-4">
            <Stack direction="row" spacing={1}>
              {tagsForActiveColumns.map((tag) => (
                <Chip
                  key={`${tag.scriptId} => ${tag.column}`}
                  label={`${tag.scriptId} => ${tag.column}`}
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
            >
              Update Summary
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditSummary;
