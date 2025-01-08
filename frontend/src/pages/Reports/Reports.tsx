import React, { useEffect, useState } from 'react';

import MergeIcon from '@mui/icons-material/Merge';

import '../../assest/css/AllScript.css';
import { Link } from 'react-router-dom';
import MergeReports from '../../Comopnent/ui/Modals/MergeReports/MergeReports';
import { GetAllreports } from '../../Redux/Report/Slice';
import { useDispatch, useSelector } from 'react-redux';
import useSortableData from '../../customHook/useSortable';
import Loader from '../../Comopnent/ui/Loader';
import { formatIsoDate } from '../../utils/formatDate';
import PaginationButtons, {
  dataPagination,
  PER_COUNT,
} from '../../Comopnent/ui/PaginationButtons';
import type { RootState } from '../../Store';
import type { ReportState } from '../../types/stateTypes';

const Report = () => {
  const dispatch = useDispatch();
  const [loginUser, setLoginUser] = useState<any>(null);
  const { reports: allreport } = useSelector<RootState, ReportState>(
    (state) => state.report,
  );
  const { items, requestSort, getClassNamesFor } = useSortableData(
    allreport || [],
  );

  const loadData = async () => {
    try {
      await dispatch(GetAllreports({ token: loginUser?.access }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const storedLoginUser = localStorage.getItem('login');
    if (storedLoginUser) {
      setLoginUser(JSON.parse(storedLoginUser));
    }
  }, []);

  useEffect(() => {
    if (loginUser?.access) {
      loadData();
    }
  }, [loginUser]);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(PER_COUNT['10']);

  const [mergeshow, setShowmerges] = useState(false);

  return (
    <div className="mx-4">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
        <h1 className="h1 fw-bold">Reports </h1>

        <div className="btn-toolbar mb-2 mb-md-0">
          <button
            onClick={() => setShowmerges(true)}
            type="button"
            className="btn icon-button my-1 mx-2"
          >
            <MergeIcon fontSize="small" />
            <span>Merge</span>
          </button>
        </div>
      </div>
      <div>
        {items.length > 0 ? (
          <div style={{ overflow: 'auto' }} id="customReportForm">
            <div className="py-2">
              <PaginationButtons
                data={items}
                label="Reports"
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            </div>
            <table className="table" style={{ minWidth: '1000px' }}>
              <thead>
                <tr className="fw-bold mb-2 p-2">
                  <th scope="col" className="col-1">
                    <h5>Sr no.</h5>
                  </th>
                  <th scope="col" className="col-7">
                    <h5>Report Name</h5>
                  </th>
                  <th scope="col" className="col-2 text-center mx-auto">
                    Created
                  </th>
                  <th scope="col" className="col-2 text-center mx-auto">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody id="scriptsCheckboxes">
                {items &&
                  dataPagination(items, currentPage, perPage).map(
                    (script: any, index: any) => (
                      <>
                        <tr
                          key={script.id}
                          className="table-card rounded-3 bg-light-green mb-2 p-3"
                        >
                          <td className="col-1 fw-bold fs-6">{index + 1}</td>
                          <td className="col-7 fw-bold fs-6">
                            <Link
                              to={`/ReportDetails/${script.id}`}
                              className="text-decoration-none text-black"
                            >
                              {script.name}
                            </Link>
                          </td>
                          <td className="col-2 text-center mx-auto">
                            {formatIsoDate(script.created)}
                          </td>
                          <td className="col-2 text-center mx-auto">
                            {formatIsoDate(script.last_updated)}
                          </td>
                        </tr>
                        <tr style={{ height: '10px' }}></tr>
                      </>
                    ),
                  )}
              </tbody>
            </table>
          </div>
        ) : (
          <Loader />
        )}
      </div>

      {mergeshow && (
        <MergeReports
          show={mergeshow}
          handleClose={() => setShowmerges(false)}
          allreport={allreport}
        />
      )}
    </div>
  );
};

export default Report;
