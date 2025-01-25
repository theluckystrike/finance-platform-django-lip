import React, { useEffect, useState } from 'react';
import '../../assest/css/AllScript.css';
import { ActiveRoute } from '../../Menu';

import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { formatIsoDate } from '../../utils/formatDate';
import Loader from '../../Comopnent/ui/Loader';
import PaginationButtons from '../../Comopnent/ui/PaginationButtons';
import Icon from '../../Comopnent/ui/icon/Icon';
import useSortableData from '../../customHook/useSortable';
import { getAllSummaries, SummaryState } from '../../Redux/TapeSummary/Slice';
import type { RootState } from '../../Store';

const ModelSummary: React.FC = () => {
  const dispatch = useDispatch();

  const { loading, summaries, count } = useSelector<RootState, SummaryState>(
    (state) => state.summary,
  );

  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const fetchData = async () => {
    try {
      await dispatch(getAllSummaries({ page: currentPage, per_page: perPage }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (perPage && currentPage) {
      fetchData();
    }
  }, [currentPage, perPage]);

  const navigate = useNavigate();

  const handleCheckboxChange = (event: React.ChangeEvent<any>, id: string) => {
    if (event) event.stopPropagation();
    console.log(
      'handleCheckboxChange',
      selectedModels,
      id,
      id in selectedModels,
    );
    const newSelectedModels = selectedModels.includes(id)
      ? selectedModels.filter((m) => m != id)
      : selectedModels.concat(id);
    setSelectedModels(newSelectedModels);
  };

  const { items, requestSort, getClassNamesFor } = useSortableData(
    summaries || [],
  );

  const isAllSelected = selectedModels.length === items.length;

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Select all scripts
      const allScriptIds: any = items.map((script: any) => script.id);
      setSelectedModels(allScriptIds);
    } else {
      // Deselect all scripts
      setSelectedModels([]);
    }
  };

  return (
    <>
      <div className="mx-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h1 className="h1 ">
            Model Summary <span id="headerInfo">({items.length})</span>
          </h1>

          <div className="btn-toolbar mb-2 mb-md-0  ">
            <button
              className="btn bg-green opacity-100 text-light col py-2 px-3 justify-content-center"
              type="button"
              onClick={() => navigate(`/${ActiveRoute.CreateSummary.path}`)}
            >
              Create Summary
            </button>
          </div>
        </div>
        <div>
          {!loading ? (
            <div style={{ overflow: 'auto' }} id="customReportForm">
              <div className="py-2">
                <PaginationButtons
                  data={items}
                  count={count}
                  label="Scripts"
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
                      <Checkbox
                        id="selectAllCheckbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th
                      scope="col"
                      className="col-4"
                      onClick={() => requestSort('name')}
                    >
                      <h6>
                        <span>Name</span>
                        <Icon
                          size="10px"
                          className={getClassNamesFor('name')}
                          icon="FilterList"
                        />
                      </h6>
                    </th>

                    <th
                      scope="col"
                      className="col-2 text-center mx-auto"
                      onClick={() => requestSort('created')}
                    >
                      <h6>
                        <span>Created</span>
                        <Icon
                          size="10px"
                          className={getClassNamesFor('created')}
                          icon="FilterList"
                        />
                      </h6>
                    </th>
                  </tr>
                </thead>
                <tbody id="scriptsCheckboxes">
                  {items.length > 0 ? (
                    items.map((summary: any, index: any) => (
                      <React.Fragment key={summary.id}>
                        <tr
                          key={index}
                          className="table-card rounded-3 bg-light-green mb-2 p-3"
                          style={{ borderRadius: '10px' }}
                        >
                          <td className="col-1">
                            <Checkbox
                              checked={selectedModels.includes(summary.id)}
                              onChange={(ev) =>
                                handleCheckboxChange(ev, summary.id)
                              }
                            />
                          </td>
                          <td className="col-4">
                            <Link
                              to={`/model-summary-results/${summary.id}`}
                              className="text-decoration-none text-black"
                            >
                              <span className="fw-bold">{summary.name}</span>
                            </Link>
                          </td>

                          <td className="col-2 text-center mx-auto">
                            {formatIsoDate(summary.created)}
                          </td>
                        </tr>
                        <tr style={{ height: '10px' }}></tr>
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        {count === 0 ? <p>No summaries found</p> : <Loader />}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <span className="text-large">
              <Loader />
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default ModelSummary;
