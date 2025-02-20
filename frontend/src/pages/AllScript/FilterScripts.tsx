import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import '../../assest/css/AllScript.css';
import Icon from '../../Comopnent/ui/icon/Icon';
import FilterModal from '../../Comopnent/ui/Modals/FilterModal/FilterModal';
import { ActiveRoute } from '../../Menu';
import SaveModal from '../../Comopnent/ui/Modals/SaveModal/SaveModal';
import ArrowDown from '../../assest/image/arrow-down.png';
import { ScriptData } from '../../DummyData/TableData';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useSortableData from '../../customHook/useSortable';
import type { RootState } from '../../Store';
import {
  GetScriptbyCategorys,
  ScriptState,
} from '../../Redux/Script/ScriptSlice';
import { useGetAllCategoryQuery } from '../../Redux/CategoryQuery';

import { loginUSer } from '../../customHook/getrole';
import { formatIsoDate } from '../../utils/formatDate';
import Loader from '../../Comopnent/ui/Loader';
import CreateReports from '../../Comopnent/ui/Modals/CreateReports/ModalReports';
import PaginationButtons, {
  dataPagination,
  PER_COUNT,
} from '../../Comopnent/ui/PaginationButtons';
import DeleteModal from '../../Comopnent/ui/Modals/DeleteModal/DeleteModal';
import UpdateScriptDialog from './dialogs/UpdateScriptDialog';
import { useUpdateScriptMutation } from '../../Redux/Script';

const FilterScripts = () => {
  const dispatch = useDispatch();
  const { loading, scripts, count } = useSelector<RootState, ScriptState>(
    (state) => state.script,
  );
  const [updateScript, { isLoading, isError, isSuccess }] =
      useUpdateScriptMutation();
  const { data: categoriesData } = useGetAllCategoryQuery({
    page_no: 1,
    page_size: 1000,
  });
  const categories = categoriesData?.results || [];

  const [selectedScripts, setSelectedScripts] = useState<any>([]);
  const [loginUser, setLoginUser] = useState<any>(null);

  const [filterQuery, setFilterQuery] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState<any>(null);

  // Effect to retrieve loginUser from localStorage on component mount
  useEffect(() => {
    const filter = localStorage.getItem('filterquery');

    const storedLoginUser = localStorage.getItem('login');
    if (storedLoginUser) {
      setLoginUser(JSON.parse(storedLoginUser));
    }
    if (filter) {
      setFilterQuery(JSON.parse(filter));
    }
  }, []);

  const getData = async () => {
    try {
      if (filterQuery) {
        await dispatch(
          GetScriptbyCategorys({
            token: loginUser?.access,
            value: filterQuery,
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const filter: any = localStorage.getItem('filterquery');

    if (loginUser) {
      getData();
    }
  }, [loginUser, filterQuery]);

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
  // Check if all scripts are selected
  const { items, requestSort, getClassNamesFor } = useSortableData(
    scripts || [],
  );
  const isAllSelected = selectedScripts.length === items.length;
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(PER_COUNT['10']);

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(null);
    getData();
  };

  const handleCloseUpdateModal = async (
    scriptId: number | null,
    formData: any,
  ) => {
    try {
      if (formData && showUpdateModal) {
        await updateScript({ id: scriptId, data: formData });
        getData();
      }
    } catch (error) {}

    setShowUpdateModal(null);
  };

  return (
    <>
      <div className="mx-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h1 className="h2">
            Filter scripts by <span id="headerInfo">({items.length})</span>
          </h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <button type="button" className="btn icon-button my-1 mx-2">
              <Icon icon="AddBusiness" size="20px" />
              <span>Home</span>
            </button>
            <button
              onClick={handleShow}
              className="btn icon-button my-1 mx-2 position-relative"
            >
              <Icon icon="Filter" size="20px" />
              {filterQuery && <span className="filter-count-badge">1</span>}
              <span>Filter</span>
            </button>

            <button
              onClick={() => setShowReport(true)}
              type="button"
              className="btn icon-button my-1 mx-2"
            >
              <Icon icon="Save" size="20px" />

              <span>Save</span>
            </button>
            <button
              type="submit"
              form="customReportForm"
              className="btn icon-button my-1 mx-2 disabled"
            >
              <Icon icon="Download" size="20px" />
              <span>Download</span>
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
                      <input
                        type="checkbox"
                        id="selectAllCheckbox"
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th
                      scope="col"
                      className="col-2"
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
                      className="col-1 text-center mx-auto"
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
                      className="col-1 text-center mx-auto"
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
                      className="col-1 text-center mx-auto"
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
                      className="col-1 text-center mx-auto"
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
                    <th scope="col" className="col-1 text-center mx-auto">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody id="scriptsCheckboxes">
                  {items.length > 0 ? (
                    dataPagination(items, currentPage, perPage).map(
                      (script: any, index: any) => (
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
                                script.category?.parent_category
                                  ?.parent_category?.name
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
                            <td className="text-center mx-auto">
                              <div className="col-actions">
                                <EditIcon
                                  onClick={() => setShowUpdateModal(script)}
                                />
                                <DeleteIcon
                                  onClick={() => setShowDeleteModal(script)}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr style={{ height: '10px' }}></tr>
                        </>
                      ),
                    )
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
        categories={categories}
      />
      <SaveModal show={Saveshow} handleClose={handleSaveClose} />
      <CreateReports
        show={showReport}
        handleClose={() => setShowReport(false)}
        selectedScripts={selectedScripts}
      />
      {showDeleteModal && (
        <DeleteModal
          show={!!showDeleteModal}
          data={showDeleteModal}
          handleClose={handleCloseDeleteModal}
        />
      )}
      {showUpdateModal && (
        <UpdateScriptDialog
          isOpen={!!showUpdateModal}
          data={showUpdateModal}
          onClose={() => handleCloseUpdateModal(null, null)}
          onSubmit={handleCloseUpdateModal}
          categories={categories}
        />
      )}
    </>
  );
};

export default FilterScripts;
