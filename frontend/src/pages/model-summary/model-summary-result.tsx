import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { useDispatch, useSelector } from 'react-redux';
import {
  GetSatussummeryByIDs,
  GetsummeryByIDs,
  Updatesummariess,
  SummaryState,
} from '../../Redux/TapeSummary/Slice';
import type { RootState } from '../../Store';
import ScatterLineChart from '../../Comopnent/Charts/LineScatter';
import LineChart from '../../Comopnent/Charts/LineChart';

import { TapeSummaryData } from '../../DummyData/TableData';
import DeleteModal from './DeleteModal';
import EditSummary from '../../Comopnent/ui/Modals/CreateSummary/ModalEditSummary';
import Loader from '../../Comopnent/ui/Loader';
import Plot from 'react-plotly.js';
import { formatIsoDate } from '../../utils/formatDate';
import JsonTable from '../../Comopnent/TableData/JsonTable';
const Components: any = {
  ScatterLineChart: ScatterLineChart,
  LineChart: LineChart,
};

const TapeSummaryResult: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [selectedScript, setSelectedScript] = useState<number | null>(null);
  const store: any = useSelector((i) => i);

  const { summery } = useSelector((i: any) => i?.summary);
  // const { summery } = useSelector<RootState, SummaryState>(
  //   (state) => state.summary,
  // );
  const summery2 = summery?.meta?.scripts
    ? Object.entries(summery.meta.scripts).map(([id, script]: any) => ({
        id: Number(id),
        name: script.name,
        tableColName: script.table_col_name,
        score: script.table_col_last_value || 0, // Default score if null
      }))
    : []; // Fallback to an empty array if `summery.meta.scripts` is undefined

  const [upLoad, setUpload] = useState(false);
  const getupdate = async () => {
    setUpload(true);
    await dispatch(Updatesummariess({ id }));
    getStatus();
    setUpload(false);
  };

  useEffect(() => {
    dispatch(GetsummeryByIDs({ id }));
    getStatus();
  }, [dispatch, id]);

  const [deleteshow, setDeleteShow] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const summeryStatus = store?.summary?.summeryStatus;

  const getStatus = async () => {
    await dispatch(GetSatussummeryByIDs({ id: id }));
  };

  useEffect(() => {
    let intervalId: any;
    if (summeryStatus.status === 'running') {
      intervalId = setInterval(() => {
        getStatus();
      }, 5000);
    }

    if (summeryStatus.status === 'success') {
      dispatch(GetsummeryByIDs({ id }));
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [summeryStatus]);

  const handleEditClose = async () => {
    await dispatch(GetsummeryByIDs({ id }));
    setEditShow(false);
  };

  return (
    <>
      <div className="container-fluid px-4 pt-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mb-5">
          <div className="">
            <h1 className="h1">{summery?.name}</h1>
            <h6 className="ps-1">
              Last update {formatIsoDate(summery?.last_updated)}{' '}
            </h6>
          </div>
          <div className="btn-toolbar">
            <button
              type="button"
              onClick={() => setEditShow(true)}
              className="btn icon-button my-1 mx-2"
            >
              <EditIcon fontSize="small" />
              <span>Edit</span>
            </button>
            {summeryStatus?.status === 'running' && (
              <button type="button" className="btn icon-button my-1 mx-2">
                <Loader />
                <span>Running</span>
              </button>
            )}
            <button onClick={getupdate} className="btn icon-button my-1 mx-2">
              <PlayArrowIcon fontSize="small" />
              <span>Update</span>
            </button>
            <button
              type="button"
              onClick={() => setDeleteShow(true)}
              className="btn icon-button my-1 mx-2"
            >
              <DeleteIcon fontSize="small" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {upLoad ? (
          <Loader />
        ) : (
          <div>
            <Card className="col-12 mb-5">
              <Card.Header className="bg-light-green">
                <Card.Title>
                  {' '}
                  Summary of stock market performance and model predictions
                </Card.Title>
              </Card.Header>
              <Card.Body>
                {/* <ChartComponent data={TapeSummaryData[0]?.chartData} /> */}

                {summery && summery.signal_plot_data ? (
                  <Plot
                    data={[
                      {
                        x: summery.signal_plot_data.date,
                        y: summery.signal_plot_data['signal sum'],
                        type: 'scatter',
                        mode: 'lines',
                        line: { color: 'blue' },
                        name: `Model Score (${formatIsoDate(summery?.last_updated)} = ${summery.meta.latest_score})`,
                      },
                    ]}
                    layout={{
                      autosize: true,
                      title: 'Model Score Over Time',
                      xaxis: {linewidth: 2, linecolor: 'black', mirror: true},
                      yaxis: {linewidth: 2, linecolor: 'black', mirror: true},
                      showlegend: true,
                      legend: {
                        x: 0.01,
                        y: 0.99,
                        xanchor: 'left',
                        yanchor: 'top',
                        borderwidth: 2,
                        bordercolor: 'gray',
                        bgcolor: 'rgba(255, 255, 255, 0.7)',
                        font: {color: "black"},
                      },
                    }}
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <div>No data available for plotting</div>
                )}
              </Card.Body>
            </Card>

            {summery?.meta?.model_performance && (
              <Card className="col-12 mb-5">
                <Card.Header className="bg-light-green">
                  <Card.Title>Model Performance</Card.Title>
                </Card.Header>
                <Card.Body>
                  <JsonTable data={summery?.meta?.model_performance} />
                </Card.Body>
              </Card>
            )}

            <Card className="col-12">
              <Card.Header className="bg-light-green">
                <Card.Title>Scripts</Card.Title>
                <Card.Subtitle>Individual script performance</Card.Subtitle>
              </Card.Header>
              <Card.Body>
                <div className="row gy-3">
                  {summery2.map((script: any) => (
                    <div
                      key={script.id}
                      className={`${
                        selectedScript === script.id ? 'border-primary ' : ''
                      } col-6`}
                      onClick={() => setSelectedScript(script.id)}
                    >
                      <div className="position-relative text-left p-3 rounded-3 bg-light-green">
                        {' '}
                        <Link
                          to={`/ScriptDetails/${script.id}`}
                          className="text-decoration-none text-black"
                          rel="noopener noreferrer" // Security best practice
                        >
                          <OpenInNewIcon
                            className="position-top-right"
                            fontSize="small"
                          />
                        </Link>
                        <p>{`Script: ${script.name}`}</p>
                        <p>{`Column: ${script.tableColName}`}</p>
                        <p
                          className={`text-sm ${
                            script.score > 0 ? 'text-success' : 'text-danger'
                          }`}
                        >
                          Score: {script.score}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {/* {selectedScript && (
              <Card className="mt-3">
                <Card.Header>
                  <Card.Title>Script Details</Card.Title>
                  <Card.Subtitle>
                    Detailed information for the selected script
                  </Card.Subtitle>
                </Card.Header>
                <Card.Body>
                  <p>
                    Details for Script {selectedScript} would be displayed here.
                  </p>
                </Card.Body>
              </Card>
            )} */}
          </div>
        )}
      </div>

      <DeleteModal
        show={deleteshow}
        data={summery}
        handleClose={() => setDeleteShow(false)}
      />

      {summery ? (
        <EditSummary
          data={summery}
          show={editShow}
          handleClose={handleEditClose}
        />
      ) : null}
    </>
  );
};

export default TapeSummaryResult;
