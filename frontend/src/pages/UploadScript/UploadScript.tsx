 

import React, { useState } from "react";
import Icon from "../../Comopnent/ui/icon/Icon";
import CategoryModal from "../../Comopnent/ui/Modals/CategoryModal/CategoryModal";
import { Categoryarray } from "../../DummyData/TableData";
import ArrowDown from '../../assest/image/arrow-down.png'

const UploadScriptForm = () => {
  const [show, setShow] = useState(false);
  const [selectVlaue,setSelectValue]=useState('')

  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
  };
  return (
    <>
      <div className=" UploadScript_main_wrap mt-3">
        <h1 className="h1 fw-bold">Upload a Script</h1>

        <div className="d-flex justify-content-center">
          <form
            className="w-75"
            style={{ maxWidth: "600px" }}
            method="post"
            encType="multipart/form-data"
          >
            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                Category
              </label>
              <div className="row mx-0 p-0">
                <div className="col-11 m-0 p-0 pe-1">
                  <div className="dropdown">
                  <div className="arrow_down">
                      <img src={ArrowDown} alt="" />
                    </div>
                    <input type="text" placeholder="All" value={selectVlaue} />
                    <div className="dropdown-content" style={ {height:'200px',overflow:'auto'}}>
                      {Categoryarray.map((item, index) => (
                        <span className="h6" key={index}>
                          {item.name}

                          {item.subcategory.map((subitem, subindex) => (
                            <span className="text-muted" key={subindex}>
                              {subitem.name}

                              {subitem.innerCategory.map(
                                (inneritem, innerindex) => (
                                  <span
                                    className="fs-6 hover-span"
                                    key={innerindex}
                                    onClick={()=>setSelectValue(inneritem)}
                                  >
                                    {inneritem}
                                  </span>
                                )
                              )}
                            </span>
                          ))}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-dark col col-1 p-0 justify-content-center"
                  type="button"
                  onClick={handleShow}
                >
                  <Icon icon="Add" size="30px" />
                </button>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="output_type" className="form-label">
                How would you like to view data?
              </label>
              <div className="dropdown">
              <div className="arrow_down">
                      <img src={ArrowDown} alt="" />
                    </div>
                <input type="text" placeholder="All" />
                <div className="dropdown-content">
                  <span className="hover-span">Chart</span>
                  <span className="hover-span">Table</span>
                  <span className="hover-span">Chart and Table</span>
                </div>
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Script name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="file" className="form-label">
                Select a file
              </label>
              <input
                type="file"
                id="file"
                name="file"
                className="form-control"
                required
              />
            </div>

            <div className="mx-auto text-center d-flex justify-content-between">
              <button type="submit" className="btn btn-dark px-5">
                Upload
              </button>
              <button
                type="submit"
                className="btn btn-light bordered-button px-5"
              >
                Reset
              </button>
            </div>
          </form>

          <div
            className="modal fade"
            id="newCategoryModal"
            tabIndex={-1}
            aria-labelledby="newCategoryModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content px-3">
                <form
                  action="{% url 'create_category' %}"
                  method="post"
                  encType="multipart/form-data"
                >
                  {/* <div className="modal-header">
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div> */}
                  <div className="modal-body">
                    <div className="mb-2">
                      <label htmlFor="modal-name" className="form-label">
                        Category name
                      </label>
                      <input
                        type="text"
                        id="modal-name"
                        name="name"
                        className="form-control mb-0"
                        placeholder="Name"
                        required
                      />
                    </div>
                    <div className="mb-0">
                      <div className="dropdown">
                        <label htmlFor="parent" className="form-label">
                          Parent category
                        </label>
                        <input type="text" placeholder="All" />
                        <div className="dropdown-content custom-scrollbar">
                          <span className="hover-span">None</span>
                          <span className="hover-span">USD</span>
                          <span className="hover-span">
                            USD -- Economics
                          </span>{" "}
                          <span className="hover-span">USD -- Combo </span>{" "}
                          <span className="hover-span">
                            USD -- Benchmark Yeilds
                          </span>
                          <span className="hover-span">Tape</span>
                          <span className="hover-span">Bonds</span>
                          <span className="hover-span">
                            Bonds -- Cross Market
                          </span>
                          <span className="hover-span">Bonds -- USD Bonds</span>
                          <span className="hover-span">Bonds -- CAD Bonds</span>
                          <span className="hover-span">CAD</span>
                          <span className="hover-span">CAD -- Rendom</span>
                          <span className="hover-span">
                            CAD -- Money and Credit
                          </span>
                          <span className="hover-span">Breadth</span>
                          <span className="hover-span">
                            Breadth -- Breadth 1
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer pt-0 border-none d-flex justify-content-between">
                    <button type="button" className="btn btn-secondary px-3">
                      Close
                    </button>
                    <button type="submit" className="btn btn-dark px-3">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <CategoryModal show={show} handleClose={handleClose} />
    </>
  );
};

export default UploadScriptForm;
