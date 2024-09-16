import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import LineChart from "../../Comopnent/Charts/LineChart";
import ScatterLineChart from "../../Comopnent/Charts/LineScatter";
import TapeSummaryResltTable from "../../Comopnent/Table/tapeSummaryResultTable";
import { ActiveRoute } from "../../Menu";
import { TapeSummaryData } from "../../DummyData/TableData";

const Components: any = { 
  ScatterLineChart: ScatterLineChart,
  LineChart: LineChart,
};

const TapeSummaryResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);

  const scriptIds: string[] = (searchParams.get("scriptIds") || "").split(",");

  const selectedData = TapeSummaryData.filter((data: any) =>
    scriptIds.includes(data.id.toString())
  );

  const [activeComponent, setActiveComponent] = useState("chart");
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>('0');

  useEffect(() => {
    // Effect to restore the last opened chart when component mounts or activeComponent changes
    if (activeComponent === "chart" && expandedAccordion === null && selectedData.length > 0) {
      setExpandedAccordion('0'); // or any default value or logic to set a meaningful default
    }
  }, [activeComponent, selectedData]);

  const today = new Date();
  const dateOnly = today.toISOString().split("T")[0];

  const editScript = () => {
    navigate(`/account/${ActiveRoute.ScriptEdit.path}`);
  };

  return (
    <>
      <div className="mx-4 mb-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center px-3 pt-3 pb-2 mb-3">
          <div>
            <h1 className="h1">
              {" "}
              Selected Scripts{" "}
              <span id="headerInfo">({selectedData.length})</span>{" "}
            </h1>
            <h6 className="ps-1">Last update {dateOnly}</h6>
          </div>
          <div className="btn-toolbar mb-2 mb-md-0">
            {/* Add any additional buttons or controls here */}
          </div>
        </div>

        <div className="row justify-content-center">
          <div className="col-3 text-center position-relative">
            <span
              onClick={() => {
                setActiveComponent("chart");
                // Preserve the last opened chart when switching to chart view
                if (expandedAccordion === null && selectedData.length > 0) {
                  setExpandedAccordion('0'); // or set the default logic here
                }
              }}
              className={`toggle-item ${activeComponent === "chart" ? "active" : ""}`}
            >
              <h5> Chart</h5> 
            </span>
            <span
              onClick={() => setActiveComponent("table")}
              className={`toggle-item ${activeComponent === "table" ? "active" : ""}`}
            >
              <h5>Table</h5>
            </span>
            <div
              className="slider"
              style={{
                transform: `translateX(${activeComponent === "chart" ? "78%" : "220%"})`,
              }}
            ></div>
          </div>
        </div>

        {activeComponent === "table" && expandedAccordion !== null && (
          <div style={{ width: "85%", margin: "0px auto" }}>
            {selectedData.map((data: any, index: number) => (
              expandedAccordion === index.toString() && (
                <TapeSummaryResltTable
                  key={data.id}
                  TableData={data.tableData}
                />
              )
            ))}
          </div>
        )}

        {activeComponent === "chart" && (
          <Accordion
            activeKey={expandedAccordion}
            onSelect={(eventKey) => setExpandedAccordion(eventKey as string || null)}
          >
            {selectedData.map((data: any, index: any) => {
              const ChartComponent = Components[data.chartType];
              return (
                <Accordion.Item eventKey={index.toString()} key={data.id}>
                  <Accordion.Header>{data.title}</Accordion.Header>
                  <Accordion.Body>
                    <div style={{ width: "85%", margin: "0px auto" }}>
                      <ChartComponent data={data?.chartData} />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        )}
      </div>
    </>
  );
};

export default TapeSummaryResult;
