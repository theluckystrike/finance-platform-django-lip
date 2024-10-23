import React, { useEffect, useState } from "react";
import "../../assest/css/AllScript.css";
import FilterModal from "../../Comopnent/ui/Modals/FilterModal/FilterModal";
import { ActiveRoute } from "../../Menu";
import SaveModal from "../../Comopnent/ui/Modals/SaveModal/SaveModal";
import { ScriptData, TapeSummaryData } from "../../DummyData/TableData";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetAllScripts } from "../../Redux/Script/ScriptSlice";
import DateFormatter from "../../customHook/useTImeformnt";
import Loader from "../../Comopnent/ui/Loader";
import PaginationButtons, {
  dataPagination,
  PER_COUNT,
} from "../../Comopnent/ui/PaginationButtons";
import Icon from "../../Comopnent/ui/icon/Icon";
import useSortableData from "../../customHook/useSortable";

const TapeSummary: React.FC = () => {
  const dispatch = useDispatch();

  // const { data, error, isLoading } = useGetAllProjectQuery({ token:'fds', page_no:1, page_size:1000 });

  const store: any = useSelector((i) => i);

  const [selectedScripts, setSelectedScripts] = useState<string[]>([]);
  const { loading } = store?.script;
  const allscripts = store?.script?.Scripts?.results;

  const [loginUser, setLoginUser] = useState<any>(null);

  // Effect to retrieve loginUser from localStorage on component mount
  useEffect(() => {
    const storedLoginUser = localStorage.getItem("login");
    if (storedLoginUser) {
      setLoginUser(JSON.parse(storedLoginUser));
    }
  }, []);
  useEffect(() => {
    if (loginUser) {
      const getDAta = async () => {
        try {
          await dispatch(GetAllScripts({ token: loginUser?.access }));
        } catch (error) {
          console.log(error);
        }
      };
      getDAta();
    }
  }, [loginUser]);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState<number>(PER_COUNT["10"]);

  const [show, setShow] = useState(false);
  const [saveShow, setSaveShow] = useState(false);
  const navigate = useNavigate();

  const toggleSelectAll = (event: React.ChangeEvent<any>) => {
    const checkboxes = document.querySelectorAll(
      '#scriptsCheckboxes input[type="checkbox"]'
    );
    checkboxes.forEach(
      (checkbox: any) => (checkbox.checked = event.target.checked)
    );
    handleCheckboxChange();
  };

  const handleCheckboxChange = (event?: React.ChangeEvent<any>) => {
    if (event) event.stopPropagation();

    const selected = Array.from(
      document.querySelectorAll(
        '#scriptsCheckboxes input[type="checkbox"]:checked'
      )
    ).map((checkbox: any) => checkbox.value);

    setSelectedScripts(selected);
  };

  const handleGetResults = () => {
    if (selectedScripts.length > 0) {
      const query = new URLSearchParams({
        scriptIds: selectedScripts.join(","),
      }).toString();
      navigate(`/account/${ActiveRoute.TapeSummaryResult.path}?${query}`);
    }
  };
  const { items, requestSort, getClassNamesFor } = useSortableData(
    allscripts || []
  );
  const isAllSelected = selectedScripts.length === items.length;

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

  return (
    <>
      <div className="mx-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
          <h1 className="h1">
            Tape Summary <span id="headerInfo">({items.length})</span>
          </h1>
          <div className="btn-toolbar mb-2 mb-md-0">
            <button
              className="btn bg-green opacity-100 text-light col py-2 px-3 justify-content-center"
              type="button"
              onClick={handleGetResults}
              disabled={selectedScripts.length === 0}
            >
              Get Result
            </button>
          </div>
        </div>
        <div>
          {!loading ? (
            <div style={{ overflow: "auto" }} id="customReportForm">
              <div className="py-2">
                <PaginationButtons
                  data={items}
                  label="Scripts"
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  perPage={perPage}
                  setPerPage={setPerPage}
                />
              </div>
              <table className="table" style={{ minWidth: "1000px" }}>
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
                      onClick={() => requestSort("name")}
                    >
                      <h6>
                        <span>Name</span>
                        <Icon
                          size="10px"
                          className={getClassNamesFor("name")}
                          icon="FilterList"
                        />
                      </h6>
                    </th>

                    <th
                      scope="col"
                      className="col-1 text-center mx-auto"
                      onClick={() => requestSort("category.name")}
                    >
                      <h6>
                        <span>Category</span>
                        <Icon
                          size="10px"
                          className={getClassNamesFor("category.name")}
                          icon="FilterList"
                        />
                      </h6>
                    </th>
                    <th
                      scope="col"
                      className="col-2 text-center mx-auto"
                      onClick={() => requestSort("sub category 1 ")}
                    >
                      <h6>
                        <span>Sub Category 1 </span>
                        <Icon
                          size="10px"
                          className={getClassNamesFor("sub category 1 ")}
                          icon="FilterList"
                        />
                      </h6>
                    </th>
                    <th
                      scope="col"
                      className="col-2 text-center mx-auto"
                      onClick={() => requestSort("sub category 1 ")}
                    >
                      <h6>
                        <span>Sub Category 2 </span>
                        <Icon
                          size="10px"
                          className={getClassNamesFor("sub category 1 ")}
                          icon="FilterList"
                        />
                      </h6>
                    </th>
                    <th
                      scope="col"
                      className="col-2 text-center mx-auto"
                      onClick={() => requestSort("created")}
                    >
                      <h6>
                        <span>Created</span>
                        <Icon
                          size="10px"
                          className={getClassNamesFor("created")}
                          icon="FilterList"
                        />
                      </h6>
                    </th>
                    <th
                      scope="col"
                      className="col-2 text-center mx-auto"
                      onClick={() => requestSort("last_updated")}
                    >
                      <h6>
                        <span>Updated</span>
                        <Icon
                          size="10px"
                          className={getClassNamesFor("last_updated")}
                          icon="FilterList"
                        />
                      </h6>
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
                            style={{ borderRadius: "10px" }}
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
                                to={`/account/ScriptDetails/${script.id}`}
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
                              <DateFormatter isoString={script.created} />
                            </td>
                            <td className="col-2 text-center mx-auto">
                              <DateFormatter isoString={script.last_updated} />
                            </td>
                          </tr>
                          <tr style={{ height: "10px" }}></tr>
                        </>
                      )
                    )
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        {store?.script?.Scripts?.count === 0 ? (
                          <p>No scripts found</p>
                        ) : (
                          <Loader />
                        )}
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

      <SaveModal show={saveShow} handleClose={() => setSaveShow(false)} />
    </>
  );
};

export default TapeSummary;
