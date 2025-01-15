import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';

import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import useToast from '../../customHook/toast';
import Icon from '../../Comopnent/ui/icon/Icon';
import type { RootState } from '../../Store';
import { Createsummerys, GetAllsummerys } from '../../Redux/TapeSummary/Slice';
import {
  getScriptByIDAction,
  ScriptState,
  GetAllScripts,
} from '../../Redux/Script/ScriptSlice';
import AutoComplete from '../../Comopnent/AutoComplete';
import { Button } from 'react-bootstrap';
interface ScriptOption {
  value: string;
  label: string;
}

const CreateSummary = () => {
  const dispatch = useDispatch();
  const handleToast = useToast();
  const { loading, scripts, count } = useSelector<RootState, ScriptState>(
    (state) => state.script,
  );

  useEffect(() => {
    dispatch(GetAllScripts({ query: 'for_summary=1' }));
  }, []);

  const [name, setName] = useState('');
  const [selectedScriptId, setSelectedScriptId] = useState<ScriptOption | null>(
    null,
  );
  const [selectScript, setSelectScript] = useState<any[]>([]);
  const [selectedScriptIds, setSelectedScriptIds] = useState<{
    [key: string]: string;
  }>({});

  const availableScriptOptions: ScriptOption[] = useMemo(() => {
    // const filterScript = scripts.filter(
    //   (i: any) => i.output_type === 'pd plt' || i.output_type === 'pd',
    // );
    return scripts.map((script: any) => ({
      value: script.id,
      label: script.name,
    }));
  }, [scripts]);

  const addScript = async () => {
    if (selectedScriptId) {
      const res = await dispatch(getScriptByIDAction({ id: selectedScriptId }));
      if (res.meta.requestStatus === 'fulfilled')
        setSelectScript((prev) => [...prev, res.payload]);
      setSelectedScriptId(null);
    }
  };

  const handleSubmit = async () => {
    const values = { name, scripts: selectedScriptIds };

    try {
      await dispatch(Createsummerys({ values }));
      handleToast.SuccessToast('Summary created successfully!');
      setSelectedScriptIds({});
      setName('');
      await dispatch(GetAllsummerys({}));
    } catch (error) {
      handleToast.ErrorToast('Failed to create summary. Please try again.');
      console.error('Error creating summary:', error);
    }
  };

  const handleSelectChange = (selectedOption: any, scriptId: string) => {
    setSelectedScriptIds((prevSelected) => ({
      ...prevSelected,
      [scriptId]: selectedOption ? selectedOption.value : '',
    }));
  };

  return (
    <>
      <div className="mx-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h1 className="h1 ">Create Model</h1>
        </div>
        <div className="col-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            {/* <TextField
              id="filled-basic"
              label="Name"
              variant="filled"
              sx={{ width: '300px' }}
            /> */}
            <div className="d-flex col-12 mb-4">
              <div className="col-8">
                <List
                  sx={{
                    bgcolor: 'background.paper',
                  }}
                  aria-labelledby="scripts-list-subheader"
                  subheader={
                    <ListSubheader component="div" id="scripts-list-subheader">
                      Available Scripts
                    </ListSubheader>
                  }
                >
                  {availableScriptOptions.map((option, i) => (
                    <ListItem>
                      <ListItemButton selected={i === 0}>
                        <ListItemText primary={option.label} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </div>
              <div className="col-4">
                <List
                  aria-labelledby="columns-subheader"
                  subheader={
                    <ListSubheader component="div" id="columns-subheader">
                      Data Columns
                    </ListSubheader>
                  }
                >
                  <ListItem disablePadding>
                    <ListItemButton selected>
                      <ListItemText primary="Model Score 1" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton selected>
                      <ListItemText primary="Model Score 2" />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemText primary="Model Score 3" />
                    </ListItemButton>
                  </ListItem>
                </List>
              </div>
            </div>

            <div className="d-flex col-12 mb-4">
              <Stack direction="row" spacing={1}>
                <Chip label="Model Score 1" onDelete={() => {}} />
                <Chip label="Model Score 2" onDelete={() => {}} />
              </Stack>
            </div>

            <Button type="submit">Create</Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateSummary;
