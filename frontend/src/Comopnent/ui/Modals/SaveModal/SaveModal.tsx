import { FC } from 'react';
import Modal from 'react-bootstrap/Modal';

interface SaveModalProps {
  show: boolean;
  handleClose: () => void;
}

const SaveModal: FC<SaveModalProps> = ({ show, handleClose }) => {
  return (
    <>
      <Modal
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Body
          className="bg-light-green"
          style={{
            borderRadius: '25px',
            overflow: 'hidden',
          }}
        >
          <h5>Create a new custom report</h5>
          <form method="post" encType="multipart/form-data">
            <div className="mb-3">
              <div className="row mx-0 px-3">
                <div className="col-12 m-0  ">
                  <label htmlFor="category" className="form-label">
                    Name
                  </label>
                  <input
                    id="category"
                    name="category"
                    className="form-control m-0"
                    required
                  ></input>
                </div>

                <div className="col-12 row m-0  ">
                  <label
                    style={{ height: '33px' }}
                    htmlFor="category"
                    className="invisible"
                  >
                    Last Updated
                  </label>

                  <button
                    onClick={handleClose}
                    className="btn btn-dark  px-3   fw-bold  "
                    type="button"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
};

export default SaveModal;
