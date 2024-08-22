import React, { useState } from "react";
import Icon from "../../Comopnent/ui/icon/Icon";

const UploadScriptForm = ( ) => {
 

  return (
    <>
    <div className=" UploadScript_main_wrap mt-3">
        <h1 className="h1 fw-bold">Upload a Script</h1>

      <div className="d-flex justify-content-center">
        <form className="w-75" style={{ maxWidth: "600px" }} method="post" encType="multipart/form-data">
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <div className="row mx-0 p-0">
              <div className="col-11 m-0 p-0 pe-1">
              <div className="dropdown">
                    <input type="text" placeholder="All" />
                    <div className="dropdown-content">
                      <a>Returns</a>
                      <a>USD</a>
                      <a>Bonds</a> <a>CAD</a>{" "}
                      <a>Breadth</a>
                    </div>
                  </div>
              </div>
              <button
                className="btn btn-dark col col-1 p-0 justify-content-center"
                type="button"
                data-bs-toggle="modal"
                data-bs-target="#newCategoryModal"
              >
               <Icon icon='Add' size='30px'/>
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="output_type" className="form-label">How would you like to view data?</label>
            <div className="dropdown">
                    <input type="text" placeholder="All" />
                    <div className="dropdown-content">
                      <a>Chart</a>
                      <a>Table</a>
                      <a>Chart and Table</a> 
                    </div>
                  </div>
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">Script name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
             
              required
            />
          </div>

          
          <div className="mb-3">
            <label htmlFor="file" className="form-label">Select a file</label>
            <input
              type="file"
              id="file"
              name="file"
              className="form-control"
              
              required
            />
          </div>

          <div className="mx-auto text-center d-flex justify-content-between">
            <button type="submit" className="btn btn-dark px-5">Upload</button>
            <button type="submit" className="btn btn-light bordered-button px-5">Reset</button>
          </div>
        </form>

        <div className="modal fade" id="newCategoryModal" tabIndex={-1} aria-labelledby="newCategoryModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content px-3">
              <form action="{% url 'create_category' %}" method="post" encType="multipart/form-data">
                {/* <div className="modal-header">
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div> */}
                <div className="modal-body">
                  <div className="mb-2">
                    <label htmlFor="modal-name" className="form-label">Category name</label>
                    <input
                      type="text"
                      id="modal-name"
                      name="name"
                      className="form-control mb-0" placeholder="Name"
                      required
                    />
                  </div>
                  <div className="mb-0">
                    <div className="dropdown">
                    <label htmlFor="parent" className="form-label">Parent category</label>
                    <input type="text" placeholder="All" />
                    <div className="dropdown-content custom-scrollbar">
                      <a>None</a>
                      <a>USD</a>
                      <a>USD -- Economics</a> <a>USD -- Combo </a>{" "}
                      <a>USD -- Benchmark Yeilds</a>
                      <a>Tape</a>
                      <a>Bonds</a>
                      <a>Bonds -- Cross Market</a>
                      <a>Bonds -- USD Bonds</a>
                      <a>Bonds -- CAD Bonds</a>
                      <a>CAD</a>
                      <a>CAD -- Rendom</a>
                      <a>CAD -- Money and Credit</a>
                      <a>Breadth</a>
                      <a>Breadth -- Breadth 1</a>


                    </div>
                  </div>
                  </div>
                </div>
                <div className="modal-footer pt-0 border-none d-flex justify-content-between">
                    <button type="button" className="btn btn-secondary px-3">Close</button>
                  <button type="submit" className="btn btn-dark px-3">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>
    </>
  );
};

export default UploadScriptForm;
