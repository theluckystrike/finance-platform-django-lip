import { FC } from 'react';
import Modal from 'react-bootstrap/Modal';

interface ReportUpdateConfirmModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ReportUpdateConfirmModal: FC<ReportUpdateConfirmModalProps> = ({
  show,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      size="lg"
      fullscreen="md-down"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={onCancel}
    >
      <Modal.Body
        className="bg-light-green"
        style={{ borderRadius: '25px', overflow: 'hidden' }}
      >
        <div className="mb-3">
          <div className="row mx-0 px-3">
            <div className="col-12 m-0"></div>
            <div className="col-12  ">
              <h4>Report Update Confirm</h4>
              <p>Are you sure you want to update this report?</p>
            </div>
            <div className="col-12 row justify-content-evenly m-0">
              <button
                onClick={onCancel}
                className="btn btn-danger col-3 px-3 fw-bold"
                type="button"
              >
                Cancel
              </button>

              <button
                onClick={onConfirm}
                className="btn btn-light border border-2 border-dark col-3 px-3 fw-bold"
                type="button"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ReportUpdateConfirmModal;
