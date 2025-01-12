import React, { useEffect, useState } from 'react';

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
} from '../../Redux/Report/Slice';
import { formatIsoDate } from '../../utils/formatDate';
import useToast from '../../customHook/toast';
import Loader from '../../Comopnent/ui/Loader';
import DeleteModal from './ReportDelete';
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

  const [selectScript, setSelectScript] = useState({
    name: '',
    id: '',
  });

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [deleteshow, setDeleteShow] = useState(false);

  const handleClose = () => setShowScheduleModal(false);
  const handleShowScheduleModal = () => {
    setShowScheduleModal(true);
  };

  const handleUpdate = async () => {
    await dispatch(
      Updatereports({
        values: {
          name: report.name,
          scripts: [...report.scripts, selectScript.id],
        },
        id,
      }),
    );

    handleToast.SuccessToast(`Update Report successfully`);
  };

  const removeScript = async (val: any) => {
    try {
      const newReportScripts = report.scripts.filter((i: any) => i.id !== val);

      await dispatch(
        Updatereports({
          values: {
            name: report.name,
            scripts: newReportScripts.map((s: any) => s.id),
          },
          id,
        }),
      );
      handleToast.SuccessToast(`Remove Script successfully`);
    } catch (error) {
      handleToast.ErrorToast(`Failed remove script`);
    } finally {
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

  return (
    <>
      <div className="mx-5 py-3">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-5">
          <h1 className="h1">
            Report Details <span id="headerInfo">({report.name})</span>
          </h1>
          <div className="btn-toolbar mb-2 mb-md-0">
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
        <div>
          {!loading ? (
            <div id="customReportForm" style={{ overflow: 'auto' }}>
              <table className="table   w-100" style={{ minWidth: '1000px' }}>
                <thead>
                  <tr className="fw-bold mb-2 p-2">
                    <th scope="col" className="col-5">
                      <h5>
                        <input type="checkbox" id="selectAllCheckbox" /> Name
                      </h5>
                    </th>
                    <th scope="col" className="col-2 text-center mx-auto">
                      Category
                    </th>
                    <th scope="col" className="col-2 text-center mx-auto">
                      Sub Category 1
                    </th>
                    <th scope="col" className="col-2 text-center mx-auto">
                      Sub Category 2
                    </th>
                    <th scope="col" className="col-2 text-center mx-auto">
                      Created
                    </th>
                    <th scope="col" className="col-1 text-center mx-auto">
                      Remove
                    </th>
                  </tr>
                </thead>
                <tbody id="reportsCheckboxes">
                  {report.scripts ? (
                    report.scripts.map((script: any) => (
                      <>
                        <tr
                          key={script.id}
                          className="table-card rounded-3 bg-light-green mb-2 p-3"
                        >
                          <td className="col-5">
                            <Link
                              to={`/ScriptDetails/${script.id}`}
                              className="text-decoration-none text-black"
                            >
                              <span className="fw-bold fs-6">
                                <input
                                  className="chbx"
                                  type="checkbox"
                                  name="scripts"
                                  value={script.id}
                                />
                                {script.name}
                              </span>
                            </Link>
                          </td>
                          <td className="col-2 text-center mx-auto wrap-word">
                            {script?.category?.name}
                          </td>
                          <td className="col-2 text-center wrap-word mx-auto">
                            {script.category?.parent_category?.name}
                          </td>
                          <td className="col-2 text-center wrap-word mx-auto">
                            {
                              script.category?.parent_category?.parent_category
                                ?.name
                            }
                          </td>

                          <td className="col-2 text-center mx-auto">
                            {formatIsoDate(script.created)}
                          </td>
                          <td className="col-1 text-center mx-auto">
                            <DeleteIcon
                              onClick={() => removeScript(script.id)}
                            />
                          </td>
                        </tr>
                        <tr style={{ height: '10px' }}></tr>
                      </>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5}>
                        <p>No scripts found</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <Loader />
          )}
        </div>
      </div>
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
