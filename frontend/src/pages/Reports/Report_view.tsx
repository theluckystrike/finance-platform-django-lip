import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';

import { Tab, Tabs } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

import '../../assest/css/AllScript.css';
import ScheduleEmailModal from '../../Comopnent/ui/Modals/ScheduleEmailModal/ScheduleEmailModal';

import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import type { RootState } from '../../Store';
import {
  GetreportByIDs,
  GetSatusreportByIDs,
  Updatereports,
  UpdateReportss,
  ReportState,
  RemoveScriptFromReports,
  RemoveSummaryFromReports,
} from '../../Redux/Report/Slice';
import { formatIsoDate } from '../../utils/formatDate';
import useToast from '../../customHook/toast';
import Loader from '../../Comopnent/ui/Loader';
import DeleteModal from './ReportDelete';
import AddScriptModal from './ReportUpdateModal';
import ReportScriptTabView from './ReportScriptTabView';
import ReportSummaryTabView from './ReportSummaryTabView';
// Plugins
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Create new plugin instance

const ReportView = () => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  // Get the search parameters from the URL
  const { id } = useParams();
  const dispatch = useDispatch();
  const handleToast = useToast();

  const { loading, reportStatus, report } = useSelector<RootState, ReportState>(
    (state) => state.report,
  );

  const [selectedTabKey, setSelectedTabKey] = useState<any>('script');

  const getStatus = () => {
    dispatch(GetSatusreportByIDs({ id }));
  };

  const getreport = async () => {
    dispatch(GetreportByIDs({ id }));
    getStatus();
    // await dispatch(GetAllScripts({ token: loginUser?.access }));
  };

  useEffect(() => {
    getreport();
  }, []);

  useEffect(() => {
    let intervalId: any;
    if (reportStatus === 'running') {
      intervalId = setInterval(() => {
        getStatus();
      }, 5000);
    } else if (reportStatus === 'success') {
      dispatch(GetreportByIDs({ id }));
      clearInterval(intervalId);
    }

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, [reportStatus]);

  const [showAddScript, setShowAddScript] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [deleteshow, setDeleteShow] = useState(false);

  const handleClose = () => setShowScheduleModal(false);
  const handleShowScheduleModal = () => {
    setShowScheduleModal(true);
  };

  const removeScript = async (val: any) => {
    try {
      await dispatch(
        RemoveScriptFromReports({ reportId: report.id, scriptId: val }),
      );
      handleToast.SuccessToast(`Remove Script successfully`);
    } catch (error) {
      handleToast.ErrorToast(`Failed remove script`);
    } finally {
      getreport();
    }
  };

  const removeSummary = async (val: any) => {
    try {
      await dispatch(
        RemoveSummaryFromReports({ reportId: report.id, summaryId: val }),
      );
      handleToast.SuccessToast(`Remove Summary successfully`);
    } catch (error) {
      handleToast.ErrorToast(`Failed remove summary`);
    } finally {
      getreport();
    }
  };

  const openPdfInNewTab = (url: any) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      handleToast.SuccessToast(
        'Please update the script first, then wait for the PDF to generate successfully.',
      );
      updateRepost();
    }
  };

  const updateRepost = async () => {
    const res = await dispatch(UpdateReportss({ id }));
    getStatus();
    if (res.payload) {
      handleToast.SuccessToast(res.payload.message);
    }
  };

  const handleAddScripts = async (values: any) => {
    console.log('values: ', values);
    await dispatch(
      Updatereports({
        values: {
          name: report.name,
          scripts: values.scripts,
          summaries: values.summaries,
        },
        id,
      }),
    );

    setShowAddScript(false);

    handleToast.SuccessToast(`Update Report successfully`);
  };

  console.log('report.scripts: ', report.scripts);

  return (
    <>
      <Helmet>
        <title>{report.name || 'Oland investments'}</title>
      </Helmet>
      <div className="mx-5 py-3">
        <div className="row justify-content-between flex-wrap flex-md-nowrap  px-3 pt-3 pb-2 mb-3">
          <div className="col-md-7">
            {report.name && (
              <>
                <h2 className="h2">{report.name}</h2>
                <h6 className="ps-1">
                  {report.last_updated ? `Last update ${formatIsoDate(report.last_updated)}` : ''}
                </h6>
              </>
            )}
          </div>
          <div className="col-md-5 btn-toolbar mb-2 mb-md-0 div-flex-end">
            <button
              onClick={() => setShowAddScript(true)}
              type="button"
              className="btn icon-button my-1 mx-2"
            >
              <AddIcon fontSize="small" />
              <span>Add Scripts</span>
            </button>
            <button
              onClick={handleShowScheduleModal}
              type="button"
              className="btn icon-button my-1 mx-2"
            >
              <CalendarTodayIcon fontSize="small" />
              <span>Schedule Email</span>
            </button>
            <button
              type="button"
              onClick={() => openPdfInNewTab(report?.latest_pdf)}
              className="btn icon-button my-1 mx-2"
              disabled={reportStatus === 'running'}
            >
              {reportStatus === 'running' ? (
                <>
                  <Loader />
                  <span>Running</span>
                </>
              ) : (
                <>
                  <VisibilityIcon fontSize="small" />
                  <span>View Latest</span>
                </>
              )}
            </button>
            <button
              type="button"
              className="btn icon-button my-1 mx-2"
              onClick={() => setDeleteShow(true)}
            >
              <DeleteIcon fontSize="small" />
              <span>Delete</span>
            </button>
            <button
              type="button"
              className="btn icon-button my-1 mx-2"
              onClick={updateRepost}
              disabled={reportStatus === 'running'}
            >
              <SystemUpdateAltIcon fontSize="small" />
              <span>Update</span>
            </button>
            {/* <button type="submit" className="btn icon-button my-1 mx-2">
              <InfoIcon fontSize="small" />
              <span>info</span>
            </button> */}
          </div>
        </div>

        {/* <form
          className="w-75"
          style={{ maxWidth: '600px' }}
          method="post"
          encType="multipart/form-data"
        >
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Add report
            </label>
            <div className="row mx-0 p-0">
              <div className="col-10 m-0 p-0 pe-1">
                <div className="dropdown">
                  <input
                    type="text"
                    placeholder="All"
                    value={selectScript.name}
                  />
                  <div
                    className="dropdown-content"
                    style={{ height: '200px', overflow: 'auto' }}
                  >
                    {reportScripts.map((script: any, index: any) => (
                      <span
                        key={index}
                        onClick={() =>
                          setSelectScript({
                            name: script.name,
                            id: script.id,
                          })
                        }
                        className="hover-span"
                      >
                        {script.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                className="btn btn-dark col col-2 p-0 fw-bold justify-content-center"
                type="button"
                disabled={selectScript.name == ''}
                onClick={handleUpdate}
              >
                Add
              </button>
            </div>
          </div>
        </form> */}
        <Tabs
          id="report-tabs"
          activeKey={selectedTabKey}
          onSelect={(k) => setSelectedTabKey(k)}
          className={`mb-3 ${report.summaries && report.summaries?.length > 0 ? '' : 'tabs-hidden'}`}
        >
          <Tab eventKey="script" title="Scripts">
            <ReportScriptTabView
              loading={loading}
              remove={removeScript}
              report={report}
            />
          </Tab>
          <Tab eventKey="summary" title="Summaries">
            <ReportSummaryTabView
              loading={loading}
              remove={removeSummary}
              report={report}
            />
          </Tab>
        </Tabs>
      </div>
      <AddScriptModal
        show={showAddScript}
        handleClose={() => setShowAddScript(false)}
        selectedScripts={report.scripts.map((script: any) => script.id)}
        selectedSummaries={report.summaries ? report.summaries.map((summary: any) => summary.id) : []}
        onSave={handleAddScripts}
      />
      {showScheduleModal && (
        <ScheduleEmailModal
          show={showScheduleModal}
          handleClose={handleClose}
        />
      )}
      <DeleteModal
        show={deleteshow}
        handleClose={() => setDeleteShow(false)}
        data={report}
      />
    </>
  );
};

export default ReportView;
