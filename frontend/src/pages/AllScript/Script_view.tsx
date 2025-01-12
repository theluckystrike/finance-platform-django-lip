import React, { useEffect, useState } from 'react';

import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import AddchartIcon from '@mui/icons-material/Addchart';
import BarChartIcon from '@mui/icons-material/BarChart';
import TableChartIcon from '@mui/icons-material/TableChart';
import InfoIcon from '@mui/icons-material/Info';

import type { RootState } from '../../Store';
import '../../assest/css/AllScript.css';
import { useNavigate, useParams } from 'react-router-dom';
import { ActiveRoute } from '../../Menu';
import { useDispatch, useSelector } from 'react-redux';
import {
  GetSatusScriptByIDs,
  getScriptByIDAction,
  RunScripts,
  ScriptState,
} from '../../Redux/Script/ScriptSlice';
import { loginUSer } from '../../customHook/getrole';
import { formatIsoDate } from '../../utils/formatDate';
import DeleteModal from '../../Comopnent/ui/Modals/DeleteModal/DeleteModal';
import Loader from '../../Comopnent/ui/Loader';
import CsvTable from '../../Comopnent/TableData/CsvTable';
import StockMultiChartPlot from './Ploty_Chart';

const ScriptView = () => {
  const [dynmicView, setDynmicView] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const [loginUser, setLoginUser] = useState<any>(null);

  const {
    ScriptStatus,
    Script: ScriptData,
    loading,
  } = useSelector<RootState, ScriptState>((state) => state.script);

  // Effect to retrieve loginUser from localStorage on component mount
  useEffect(() => {
    const storedLoginUser = localStorage.getItem('login');
    if (storedLoginUser) {
      setLoginUser(JSON.parse(storedLoginUser));
    }
  }, []);

  const getStatus = () => {
    dispatch(GetSatusScriptByIDs({ id: id, token: loginUser?.access }));
  };

  const loadScriptData = async () => {
    if (loginUser?.access && id) {
      dispatch(getScriptByIDAction({ id: id, token: loginUser?.access }));
      getStatus();
    }
  };

  useEffect(() => {
    loadScriptData();
  }, [loginUser, id]);

  useEffect(() => {
    let intervalId: any;
    if (ScriptStatus.status === 'running') {
      intervalId = setInterval(() => {
        getStatus();
      }, 5000);
    }

    if (ScriptStatus.status === 'success') {
      dispatch(getScriptByIDAction({ id: id, token: loginUser?.access }));

      clearInterval(intervalId);
    }
    if (ScriptStatus.status === 'failure') {
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [ScriptStatus]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };

  const editScript = () => {
    navigate(`/${ActiveRoute.ScriptEdit.path}`);
  };

  const [changeView, setChangeView] = useState(false);

  const runScript = async () => {
    try {
      setTimeout(async () => {
        await dispatch(RunScripts({ id: id, token: loginUser?.access }));
        getStatus();
      }, 200);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <>
      <div className="mx-4">
        <div className="row justify-content-between flex-wrap flex-md-nowrap  px-3 pt-3 pb-2 mb-3">
          <div className="col-md-7">
            {ScriptData.name && (
              <>
                <h2 className="h2">{ScriptData.name}</h2>
                <h6 className="ps-1">
                  {`Last update ${formatIsoDate(ScriptData.last_updated)}`}
                </h6>
              </>
            )}
          </div>
          <div className="col-md-5 btn-toolbar mb-2 mb-md-0 div-flex-end">
            <button
              onClick={editScript}
              type="button"
              className="btn icon-button my-1 mx-2"
            >
              <EditIcon fontSize="small" />
              <span>Edit</span>
            </button>

            <button
              type="button"
              onClick={runScript}
              className="btn icon-button my-1 mx-2"
              disabled={ScriptStatus.status === 'running'}
            >
              {ScriptStatus.status === 'running' ? (
                <>
                  <Loader />
                  <span>Running</span>
                </>
              ) : (
                <>
                  <PlayArrowIcon fontSize="small" />
                  <span>Play</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleShow}
              className="btn icon-button my-1 mx-2"
            >
              <DeleteIcon fontSize="small" />
              <span>Delete</span>
            </button>
            {ScriptData?.output_type === 'pd plt' && (
              <button
                onClick={() => setChangeView(!changeView)}
                type="button"
                className="btn icon-button my-1 mx-2"
              >
                {changeView ? (
                  <AddchartIcon fontSize="small" />
                ) : (
                  <TableChartIcon fontSize="small" />
                )}
                <span>{changeView ? 'Chart' : 'Table'}</span>
              </button>
            )}

            {ScriptData?.output_type !== 'pd' && (
              <button
                onClick={() => setDynmicView(!dynmicView)}
                type="button"
                className="btn icon-button my-1 mx-2"
              >
                {!dynmicView ? (
                  <BarChartIcon fontSize="small" />
                ) : (
                  <AddchartIcon fontSize="small" />
                )}
                <span>{!dynmicView ? 'Static view' : 'Plotly view'}</span>
              </button>
            )}
            {/* <button type="submit" form="customReportForm" className="btn icon-button my-1 mx-2  ">
                    <Icon icon='Info' size='20px'/>
                        <span>Info</span>
                    </button> */}
            <button
              className="tooltip-btn btn icon-button my-1 mx-2"
              type="submit"
              form="customReportForm"
            >
              {' '}
              <InfoIcon fontSize="small" />
              <span>Info</span>
              <div className="tooltip-text">
                <div className="tooltip_text_row d-flex justify-content-between  mb-2 text-left">
                  <h6>Created:</h6>
                  <p>{` Last update ${formatIsoDate(ScriptData.created)} `}</p>
                </div>
                <div className="tooltip_text_row d-flex justify-content-between  mb-2 text-left">
                  <h6>Last Run:</h6>
                  <p>{` Last update ${formatIsoDate(ScriptData.last_updated)} `}</p>
                </div>

                {/* tooltip two */}
                <div>
                  <div className="tooltip_text_row justify-content-between d-flex  mb-2">
                    <h6>ID (for API)</h6>
                    <p>{ScriptData.id}</p>
                  </div>
                  <div className="tooltip_text_row justify-content-between d-flex  mb-2">
                    <h6>Category:</h6>
                    <p>{ScriptData.category?.name}</p>
                  </div>
                  <div className="tooltip_text_row justify-content-between d-flex  mb-2">
                    <h6>Uploaded: </h6>
                    <p>April 28,2024,6:45 pm.</p>
                  </div>
                  <div className="tooltip_text_row justify-content-between d-flex  mb-2">
                    <h6>Last Updated: </h6>
                    <p>{`${formatIsoDate(ScriptData.last_updated)}`}</p>
                  </div>
                  <div className="tooltip_text_row justify-content-between d-flex  mb-2">
                    <h6>Output data type: </h6>
                    <p>Chart(Using matplotlib.pyplot.savefig())</p>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        <div>
          {ScriptStatus.status === 'failure' ? (
            <>
              <div
                style={{
                  color: 'red',
                  background: '#ffe6e6',
                  padding: '10px',
                  borderRadius: '5px',
                }}
              >
                <h3>Error</h3>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                  {ScriptStatus.error_message}
                </pre>
              </div>
            </>
          ) : (
            <div>
              {ScriptData?.output_type === 'plt' ||
              (ScriptData?.output_type === 'pd plt' && changeView === false) ? (
                <>
                  {dynmicView ? (
                    <div
                      style={{
                        width: '100%',
                        margin: '0 auto',
                      }}
                    >
                      {/* <LineChart /> */}
                      <img
                        src={ScriptData?.chart_data?.image_file}
                        alt=""
                        width="100%"
                      />
                    </div>
                  ) : (
                    <div>
                      {ScriptData?.chart_data.plotly_config.data && (
                        <StockMultiChartPlot
                          data={ScriptData?.chart_data.plotly_config.data}
                          layout={ScriptData?.chart_data.plotly_config.layout}
                        />
                      )}
                    </div>
                  )}
                </>
              ) : (
                <CsvTable csvUrl={ScriptData?.table_data?.csv_data} />
              )}
            </div>
          )}
        </div>
      </div>

      <DeleteModal
        show={show}
        token={loginUSer?.access}
        data={ScriptData}
        handleClose={handleClose}
      />
    </>
  );
};

export default ScriptView;
