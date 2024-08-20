import React, { useState } from "react";
import Icon from "../../Comopnent/ui/icon/Icon";

const UploadScriptForm = ( ) => {
 

  return (
    <>
      <div className="d-flex justify-content-center flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 text-center">
        <h1 className="h1 fw-bold">Upload a Script</h1>
      </div>

      <div className="d-flex justify-content-center">
        <form className="w-75" style={{ maxWidth: "600px" }} method="post" encType="multipart/form-data">
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Category</label>
            <div className="row mx-0 p-0">
              <div className="col-11 m-0 p-0 pe-1">
                <select
                  id="category"
                  name="category"
                  className="form-select m-0"
                  
                  required
                >
                  <option value="" disabled selected>Select a category</option>
                  
                </select>
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
            <select
              name="outputType"
              className="form-select"
              
              required
            >
              <option value="" disabled selected>Select an option</option>
               
            </select>
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
            <label htmlFor="description" className="form-label">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              className="form-control"
             
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

          <div className="mx-auto text-center">
            <button type="submit" className="btn btn-dark px-5">Upload</button>
          </div>
        </form>

        <div className="modal fade" id="newCategoryModal" tabIndex={-1} aria-labelledby="newCategoryModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <form action="{% url 'create_category' %}" method="post" encType="multipart/form-data">
                <div className="modal-header">
                  <h5 className="modal-title" id="newCategoryModalLabel">Create a category</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="mb-4">
                    <label htmlFor="modal-name" className="form-label">Category name</label>
                    <input
                      type="text"
                      id="modal-name"
                      name="name"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="parent" className="form-label">Parent category</label>
                    <select id="parent" name="parent" className="form-control" required>
                      <option value="" selected>Select a category</option>
                      <option value="-1">None</option>
                       
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <a href="{% url 'manage_categories' %}">
                    <button type="button" className="btn btn-secondary">Edit All Categories</button>
                  </a>
                  <button type="submit" className="btn btn-dark">Save changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadScriptForm;
