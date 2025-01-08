import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

import EditIcon from '@mui/icons-material/Edit';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';

import { useDispatch, useSelector } from 'react-redux';
import {
  GetSatussummeryByIDs,
  GetsummeryByIDs,
  Updatesummariess,
} from '../../Redux/TapeSummary/Slice';
import ScatterLineChart from '../../Comopnent/Charts/LineScatter';
import LineChart from '../../Comopnent/Charts/LineChart';

import { TapeSummaryData } from '../../DummyData/TableData';
import DeleteModal from './DeleteModal';
import EditSummary from '../../Comopnent/ui/Modals/CreateSummary/ModalEditSummary';
import Loader from '../../Comopnent/ui/Loader';
import Plot from 'react-plotly.js';
const Components: any = {
  ScatterLineChart: ScatterLineChart,
  LineChart: LineChart,
};
// Mock data for the chart
const chartData = [
  { date: '2023-01', stockMarket: 0.5, modelScore: 1 },
  { date: '2023-02', stockMarket: 0.8, modelScore: 1 },
  { date: '2023-03', stockMarket: 0.3, modelScore: 0 },
  { date: '2023-04', stockMarket: -0.2, modelScore: -1 },
  { date: '2023-05', stockMarket: -0.5, modelScore: -1 },
  { date: '2023-06', stockMarket: 0.1, modelScore: 0 },
  { date: '2023-07', stockMarket: 0.6, modelScore: 1 },
];

// Mock data for the scripts
const scriptData = [
  { id: 1, name: 'Script 1', score: 0.8 },
  { id: 2, name: 'Script 2', score: -0.3 },
  { id: 3, name: 'Script 3', score: 0.5 },
  { id: 4, name: 'Script 4', score: 1.0 },
  { id: 5, name: 'Script 5', score: -0.7 },
  { id: 6, name: 'Script 6', score: 0.2 },
];

const TapeSummaryResult: React.FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [selectedScript, setSelectedScript] = useState<number | null>(null);
  const store: any = useSelector((i) => i);

  const { summery } = useSelector((i: any) => i?.summary);
  console.log(summery, 'summerysummery');

  const summery2 = summery?.meta?.scripts
    ? Object.entries(summery.meta.scripts).map(([id, script]: any) => ({
        id: Number(id),
        name: script.name,
        tableColName: script.table_col_name,
        score: script.table_col_last_value || 0, // Default score if null
      }))
    : []; // Fallback to an empty array if `summery.meta.scripts` is undefined

  // console.log(summery2);
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
  console.log(summeryStatus);

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

  return (
    <>
      <div className="mx-4 mb-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center px-3 pt-3 pb-2 mb-3">
          <div>
            <h1 className="h1">{summery?.name}</h1>
            <h6 className="ps-1">Last update :{summery?.created} </h6>
          </div>
          <div className="btn-toolbar mb-2 mb-md-0">
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
          <div className="container row mx-auto p-4">
            <Card className="col-12 mb-8  ">
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
                        mode: 'lines+markers',
                        marker: { color: 'green' },
                        name: 'Signal Sum', // Name for the legend
                      },
                    ]}
                    layout={{
                      title: summery.name.replace(/\b\w/g, (char: any) =>
                        char.toUpperCase(),
                      ),
                      xaxis: { title: 'Date' },
                      yaxis: {
                        title: 'Signal Sum',
                        range: [-1, 1], // Fixed y-axis range from -1 to 1
                        dtick: 1, // Step of 1 for ticks, so only -1, 0, and 1 appear
                      },
                      showlegend: true, // Enable the legend
                      legend: {
                        x: 1, // Position legend on the right
                        y: 1,
                        xanchor: 'right',
                        yanchor: 'top',
                      },
                    }}
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <div>No data available for plotting</div>
                )}
              </Card.Body>
            </Card>

            <Card className="col-12 ">
              <Card.Header className="bg-light-green">
                <Card.Title>Scripts</Card.Title>
                <Card.Subtitle>Individual script performance</Card.Subtitle>
              </Card.Header>
              <Card.Body>
                <div className="row justify-content-evenly">
                  {summery2.map((script: any) => (
                    <div
                      key={script.id}
                      className={`h-20 rounded-3 bg-light-green m-2 p-3 ${
                        selectedScript === script.id ? 'border-primary ' : ''
                      } col-5 p-4`}
                      onClick={() => setSelectedScript(script.id)}
                    >
                      {' '}
                      <Link
                        to={`/ScriptDetails/${script.id}`}
                        className="text-decoration-none text-black"
                      >
                        <div className="text-left">
                          <div>{script.name}</div>
                          <div>{script.tableColName}</div>
                          <div
                            className={`text-sm ${
                              script.score > 0 ? 'text-success' : 'text-danger'
                            }`}
                          >
                            Score: {script.score}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            {selectedScript && (
              <Card className="mt-8">
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
            )}
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
          handleClose={() => setEditShow(false)}
        />
      ) : null}
    </>
  );
};

export default TapeSummaryResult;
