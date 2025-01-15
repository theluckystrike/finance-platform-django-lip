import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';
import useToast from '../../customHook/toast';
import Icon from '../../Comopnent/ui/icon/Icon';
import type { RootState } from '../../Store';
import { Createsummerys, GetAllsummerys } from '../../Redux/TapeSummary/Slice';
import {
  getScriptByIDAction,
  ScriptState,
  GetAllScripts,
} from '../../Redux/Script/ScriptSlice';

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
    dispatch(GetAllScripts({ query: '' }));
  }, []);
  const filterScript = scripts.filter(
    (i: any) => i.output_type === 'pd plt' || i.output_type === 'pd',
  );
  const [name, setName] = useState('');
  const [selectedScriptId, setSelectedScriptId] = useState<string>('');
  const [selectScript, setSelectScript] = useState<any[]>([]);
  const [selectedScriptIds, setSelectedScriptIds] = useState<{
    [key: string]: string;
  }>({});

  const availableScriptOptions: ScriptOption[] = filterScript
    .filter(
      (script: any) => !Object.keys(selectedScriptIds).includes(script.id),
    )
    .map((script: any) => ({
      value: script.id,
      label: script.name,
    }));

  const addScript = async () => {
    if (selectedScriptId) {
      const res = await dispatch(getScriptByIDAction({ id: selectedScriptId }));
      if (res.meta.requestStatus === 'fulfilled')
        setSelectScript((prev) => [...prev, res.payload]);
      setSelectedScriptId('');
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
        <div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className="mb-3">
              <div className="row mx-0 px-3">
                <div className="col-12 m-0">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    className="form-control m-0"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="col-10 mb-2">
                  <label htmlFor="scripts" className="form-label">
                    Select Script
                  </label>
                  <Select
                    id="scripts"
                    options={availableScriptOptions}
                    value={
                      availableScriptOptions.find(
                        (option) => option.value === selectedScriptId,
                      ) || null
                    }
                    onChange={(selectedOption) =>
                      setSelectedScriptId(
                        selectedOption ? selectedOption.value : '',
                      )
                    }
                    placeholder="Select a Script"
                  />
                </div>

                <div className="col-2 mb-3 text-center">
                  <label
                    htmlFor="column"
                    className="form-label  d-block invisible"
                  >
                    {' dfdd'}
                  </label>
                  <button
                    type="button"
                    className="btn btn-dark"
                    onClick={addScript}
                  >
                    <Icon size="20px" icon="Add" />
                  </button>
                </div>

                <div
                  className="col-12"
                  style={{ maxHeight: '300px', overflow: 'auto' }}
                >
                  <h6>Scripts to Include:</h6>
                  <ul>
                    {selectScript.map((scriptItem: any) => (
                      <li key={uuidv4()}>
                        Script ID: {scriptItem?.id}, Column:{' '}
                        {selectedScriptIds[scriptItem.id]}
                        <Select
                          id="columns"
                          options={scriptItem?.table_data?.table_meta?.columns.map(
                            (column: any) => ({
                              value: column.name,
                              label: column.name,
                            }),
                          )}
                          value={
                            scriptItem?.table_data?.table_meta?.columns
                              .map((column: any) => ({
                                value: column.name,
                                label: column.name,
                              }))
                              .find(
                                (option: any) =>
                                  option.value ===
                                  selectedScriptIds[scriptItem.id],
                              ) || null
                          }
                          onChange={(selectedOption) =>
                            handleSelectChange(selectedOption, scriptItem.id)
                          }
                          placeholder="Select a Column"
                        />
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="submit"
                  className="btn btn-dark col-5 px-3 fw-bold"
                >
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateSummary;
