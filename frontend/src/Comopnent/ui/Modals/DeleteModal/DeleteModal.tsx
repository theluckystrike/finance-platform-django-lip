import { FC, useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  DeleteScriptByIDs,
  GetAllScripts,
} from '../../../../Redux/Script/ScriptSlice';

interface DeleteModalProps {
  show: boolean;
  handleClose: () => void;
  token: any;
  data: any;
}

const DeleteModal: FC<DeleteModalProps> = ({
  show,
  handleClose,
  data,
  token,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    dispatch(DeleteScriptByIDs({ token, id: data.id }));
    await dispatch(GetAllScripts({}));
    handleClose();
    navigate('/account/allscripts');
  };

  return (
    <Modal
      size="lg"
      fullscreen="md-down"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={handleClose}
    >
      <Modal.Body
        className="bg-light-green"
        style={{ borderRadius: '25px', overflow: 'hidden' }}
      >
        <div className="mb-3">
          <div className="row mx-0 px-3">
            <div className="col-12 m-0"></div>
            <div className="col-12  ">
              {/* <label htmlFor="parent_category" className="form-label" style={{
                    width:'400px'
                  }}>
                   Delete {data.name} script 
                  </label> */}
              <h4>Delete Script</h4>
              <p>Are you sure you want to delete {data?.name} script?</p>
            </div>
            <div className="col-12 row justify-content-evenly m-0">
              <label
                style={{ height: '33px' }}
                htmlFor="category"
                className="invisible"
              >
                Actions
              </label>

              <button
                onClick={handleDelete}
                className="btn btn-danger col-12 col-sm-12 col-md-6 col-lg-3 px-3 my-1 fw-bold"
                type="button"
              >
                Delete
              </button>

              <button
                onClick={handleClose}
                className="btn btn-light border border-2 border-dark col-12 col-sm-12 col-md-6 col-lg-3 px-3 my-1 fw-bold"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteModal;
