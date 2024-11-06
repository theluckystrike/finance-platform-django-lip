import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import Icon from "../../Comopnent/ui/icon/Icon";
import { GetSatusreportByIDs } from "../../Redux/Report/Slice";
import { useDispatch, useSelector } from "react-redux";
import { GetsummeryByIDs, Updatesummariess } from "../../Redux/TapeSummary/Slice";
import ScatterLineChart from "../../Comopnent/Charts/LineScatter";
import LineChart from "../../Comopnent/Charts/LineChart";

import { TapeSummaryData } from "../../DummyData/TableData";
import DeleteModal from "./DeleteModal";
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
  const location = useLocation(); 
   const ChartComponent = Components[TapeSummaryData[0].chartType];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedScript, setSelectedScript] = useState<number | null>(null);

  const { summery } = useSelector((i: any) => i?.summary);
  
  const summery2 = summery?.meta?.scripts
    ? Object.entries(summery.meta.scripts).map(([id, script]: any) => ({
        id: Number(id),
        name: script.name,
        tableColName: script.table_col_name,
        score: script.table_col_last_value || 0, // Default score if null
      }))
    : []; // Fallback to an empty array if `summery.meta.scripts` is undefined

  console.log(summery2);

  const getStatus = async () => {
    await dispatch(Updatesummariess({ id }));
  };

  useEffect(() => {
    dispatch(GetsummeryByIDs({ id }));
  }, [dispatch, id]);

  const [deleteshow,setDeleteShow]=useState(false)

  return (
    <>
      <div className="mx-4 mb-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center px-3 pt-3 pb-2 mb-3">
          <div>
            <h1 className="h1">{summery?.name}</h1>
            <h6 className="ps-1">Last update :{summery?.created} </h6>
          </div>
          <div className="btn-toolbar mb-2 mb-md-0">
            <button type="button" className="btn icon-button my-1 mx-2">
              <Icon icon="Edit" size="20px" />
              <span>Edit</span>
            </button>
            <button onClick={getStatus} className="btn icon-button my-1 mx-2">
              <Icon icon="PlayArrow" size="20px" />
              <span>Update</span>
            </button>
            <button type="button" onClick={()=>setDeleteShow(true)} className="btn icon-button my-1 mx-2">
              <Icon icon="Delete" size="20px" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="container row mx-auto p-4">
          <Card className="col-12 mb-8  ">
            <Card.Header className="bg-light-green">
              <Card.Title> Summary of stock market performance and model predictions</Card.Title>
              
            </Card.Header>
            <Card.Body>
            <ChartComponent data={TapeSummaryData[0]?.chartData} />
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
                    className={`h-20 rounded-3 bg-light-green m-2 p-3 ${selectedScript === script.id ? 'border-primary ' : ''} col-5 p-4`}
                    onClick={() => setSelectedScript(script.id)}
                  >
                    <div className="text-left">
                      <div>{script.name}</div>
                      <div>{script.tableColName}</div>
                      <div className={`text-sm ${script.score > 0 ? 'text-success' : 'text-danger'}`}>
                        Score: {script.score }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>

          {selectedScript && (
            <Card className="mt-8">
              <Card.Header>
                <Card.Title>Script Details</Card.Title>
                <Card.Subtitle>Detailed information for the selected script</Card.Subtitle>
              </Card.Header>
              <Card.Body>
                <p>Details for Script {selectedScript} would be displayed here.</p>
              </Card.Body>
            </Card>
          )}
        </div>
      </div>


      <DeleteModal
        show={deleteshow}
       data={summery}
        handleClose={()=>setDeleteShow(false)}
      />
    </>
  );
};

export default TapeSummaryResult;
