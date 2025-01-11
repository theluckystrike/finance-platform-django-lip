import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import FilterIcon from '@mui/icons-material/Filter';
import SaveIcon from '@mui/icons-material/Save';

import '../../assest/css/AllScript.css';
import Icon from '../../Comopnent/ui/icon/Icon';
import FilterModal from '../../Comopnent/ui/Modals/FilterModal/FilterModal';
import SaveModal from '../../Comopnent/ui/Modals/SaveModal/SaveModal';
import useSortableData from '../../customHook/useSortable';
import type { RootState } from '../../Store';
import { GetAllScripts, ScriptState } from '../../Redux/Script/ScriptSlice';
import { formatIsoDate } from '../../utils/formatDate';
import Loader from '../../Comopnent/ui/Loader';
import CreateReports from '../../Comopnent/ui/Modals/CreateReports/ModalReports';

import PaginationButtons from '../../Comopnent/ui/PaginationButtons';

const AllScripts = () => {
  const dispatch = useDispatch();
  const store: any = useSelector((i) => i);
  const { loading, scripts, count } = useSelector<RootState, ScriptState>(
    (state) => state.script,
  );
  const [selectedScripts, setSelectedScripts] = useState<any>([]);
  const [perPage, setPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const [filterQuery, setFilterQuery] = useState<any>(null);

  const getData = async () => {
    try {
      await dispatch(
        GetAllScripts({
          page: currentPage,
          per_page: perPage,
        }),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (perPage && currentPage) {
      getData();
    }
  }, [currentPage, perPage]);

  const [show, setShow] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const handleClose = async () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
  const [Saveshow, setSaveShow] = useState(false);
  const handleSaveClose = () => setSaveShow(false);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // Select all scripts
      const allScriptIds: any = items.map((script: any) => script.id);
      setSelectedScripts(allScriptIds);
    } else {
      // Deselect all scripts
      setSelectedScripts([]);
    }
  };

  const handleCheckboxChange = (id: any) => {
    if (selectedScripts.includes(id)) {
      setSelectedScripts(
        selectedScripts.filter((scriptId: any) => scriptId !== id),
      );
    } else {
      setSelectedScripts([...selectedScripts, id]);
    }
  };

  const { items, requestSort, getClassNamesFor } = useSortableData(scripts);
  const isAllSelected = selectedScripts.length === items.length;

  return (
    <>
      <div className="mx-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h1 className="h2">
            All scripts <span id="headerInfo">({items.length})</span>
          </h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <button
              onClick={handleShow}
              className="btn icon-button my-1 mx-2 position-relative"
            >
              <FilterIcon fontSize="small" />
              {filterQuery && <span className="filter-count-badge">1</span>}
              <span>Filter</span>
            </button>

            <button
              onClick={() => setShowReport(true)}
              type="button"
              className="btn icon-button my-1 mx-2"
            >
              <SaveIcon fontSize="small" />
              <span>Save</span>
            </button>
          </div>
        </div>
        <div>
          {!loading ? (
            <div style={{ overflow: 'auto' }} id="customReportForm">
              <div className="py-2">
                <PaginationButtons
                  data={scripts}
                  label="Scripts"
                  count={count}
                  currentPage={currentPage}
                  perPage={perPage}
                  setPerPage={setPerPage}
                  setCurrentPage={setCurrentPage}
                />
              </div>
              <table className="table" style={{ minWidth: '1000px' }}>
                <thead>
                  <tr className="fw-bold mb-2 p-2">
                    <th scope="col" className="col-1">
                      <input
                        type="checkbox"
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
                      className="col-1 text-center mx-auto"
                      onClick={() => requestSort('category.name')}
                    >
                      <h6>
                        <span>Category</span>
                        <Icon
                          size="10px"
                          className={getClassNamesFor('category.name')}
                          icon="FilterList"
                        />
                      </h6>
                    </th>
                    <th
                      scope="col"
                      className="col-2 text-center mx-auto"
                      onClick={() => requestSort('sub category 1 ')}
                    >
                      <h6>
                        <span>Sub Category 1 </span>
                        <Icon
                          size="10px"
                          className={getClassNamesFor('sub category 1 ')}
                          icon="FilterList"
                        />
                      </h6>
                    </th>
                    <th
                      scope="col"
                      className="col-2 text-center mx-auto"
                      onClick={() => requestSort('sub category 1 ')}
                    >
                      <h6>
                        <span>Sub Category 2 </span>
                        <Icon
                          size="10px"
                          className={getClassNamesFor('sub category 1 ')}
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
                    <th
                      scope="col"
                      className="col-2 text-center mx-auto"
                      onClick={() => requestSort('last_updated')}
                    >
                      <h6>
                        <span>Updated</span>
                        <Icon
                          size="10px"
                          className={getClassNamesFor('last_updated')}
                          icon="FilterList"
                        />
                      </h6>
                    </th>
                  </tr>
                </thead>
                <tbody id="scriptsCheckboxes">
                  {items?.length > 0 ? (
                    items.map((script: any, index: any) => (
                      <>
                        <tr
                          key={index}
                          className="table-card rounded-3 bg-light-green mb-2 p-3"
                          style={{ borderRadius: '10px' }}
                        >
                          <td className="col-1">
                            <input
                              type="checkbox"
                              checked={selectedScripts.includes(script.id)}
                              onChange={() => handleCheckboxChange(script.id)}
                            />
                          </td>
                          <td className="col-4">
                            <Link
                              to={`/ScriptDetails/${script.id}`}
                              className="text-decoration-none text-black"
                            >
                              <span className="fw-bold">{script.name}</span>
                            </Link>
                          </td>
                          <td className="col-1 text-center wrap-word mx-auto">
                            {
                              script.category?.parent_category?.parent_category
                                ?.name
                            }
                          </td>

                          <td className="col-2 text-center wrap-word mx-auto">
                            {script.category?.parent_category?.name}
                          </td>
                          <td className="col-2 text-center wrap-word mx-auto">
                            {script?.category?.name}
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        {count === 0 ? <p>No scripts found</p> : <Loader />}
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

      <FilterModal
        show={show}
        handleClose={handleClose}
        filterQuery={filterQuery}
        setFilterQuery={setFilterQuery}
      />
      <SaveModal show={Saveshow} handleClose={handleSaveClose} />
      <CreateReports
        show={showReport}
        handleClose={() => setShowReport(false)}
        selectedScripts={selectedScripts}
      />
    </>
  );
};

export default AllScripts;
