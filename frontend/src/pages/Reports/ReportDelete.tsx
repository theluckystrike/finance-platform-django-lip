import { FC, useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { log } from 'console';
import { useDispatch } from 'react-redux';
import { DeleteScriptByIDs } from '../../Redux/Script/ScriptSlice';
import { DeleteReportsByIDs } from '../../Redux/Report/Slice';

interface DeleteModalProps {
  show: boolean;
  handleClose: () => void;
  data: any;
}

const DeleteModal: FC<DeleteModalProps> = ({ show, handleClose, data }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleDelete = () => {
    dispatch(DeleteReportsByIDs({ id: data.id }));

    handleClose();
    navigate(-1);
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
              <h4>Delete Report</h4>
              <p>Are you sure you want to delete {data.name} report?</p>
            </div>
            <div className="col-12 row justify-content-evenly m-0">
              <button
                onClick={handleDelete}
                className="btn btn-danger col-3 px-3 fw-bold"
                type="button"
              >
                Delete
              </button>

              <button
                onClick={handleClose}
                className="btn btn-light border border-2 border-dark col-3 px-3 fw-bold"
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
