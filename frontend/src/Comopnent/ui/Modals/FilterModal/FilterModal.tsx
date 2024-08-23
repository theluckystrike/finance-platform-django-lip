import { FC } from "react";
import Modal from "react-bootstrap/Modal";

interface FilterModalProps {
  show: boolean;
  handleClose: () => void;
}

const FilterModal: FC<FilterModalProps> = ({ show, handleClose }) => {
  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={show}
        onHide={handleClose}
      >
        <Modal.Body
          className="bg-light-green"
          style={{
            borderRadius: "25px",
            overflow: "hidden",
          }}
        >
          <form method="post" encType="multipart/form-data">
            <div className="mb-3">
              <div className="row mx-0 px-5">
                <div className="col-6 m-0 px-4">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="form-select m-0"
                    required
                  >
                    <option value="" disabled selected>
                      All
                    </option>
                    <option value="Returns">Returns</option>
                    <option value="USD">USD</option>
                    <option value="Bonds">Bonds</option>
                    <option value="CAD">CAD</option>
                    <option value="Breadth">Breadth</option>
                  </select>
                </div>
                <div className="col-6 m-0 px-4">
                  <label htmlFor="category" className="form-label">
                    Add Script
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="form-select m-0"
                    required
                  >
                    <option value="" disabled selected>
                      All
                    </option>
                    <option value="Returns">Returns</option>
                    <option value="USD">USD</option>

                    <option value="Bonds">Bonds</option>

                    <option value="CAD">CAD</option>

                    <option value="Breadth">Breadth</option>
                  </select>
                </div>
                <div className="col-6 m-0 px-4">
                  <label htmlFor="category" className="form-label">
                    Sub-Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="form-select m-0"
                    required
                  >
                    <option value="" disabled selected>
                      All
                    </option>
                    <option value="Returns">Returns</option>
                    <option value="USD">USD</option>

                    <option value="Bonds">Bonds</option>

                    <option value="CAD">CAD</option>

                    <option value="Breadth">Breadth</option>
                  </select>
                </div>
                <div className="col-6 m-0 px-4">
                  <label htmlFor="category" className="form-label">
                    Sub-Category 2
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="form-select m-0"
                    required
                  >
                    <option value="" disabled selected>
                      All
                    </option>
                    <option value="Returns">Returns</option>
                    <option value="USD">USD</option>

                    <option value="Bonds">Bonds</option>

                    <option value="CAD">CAD</option>

                    <option value="Breadth">Breadth</option>
                  </select>
                </div>
                <div className="col-6 m-0 px-4">
                  <label htmlFor="category" className="form-label">
                    Added
                  </label>
                  <select
                    id="category"
                    name="category"
                    className="form-select m-0"
                    required
                  >
                    <option value="" disabled selected>
                      All
                    </option>
                    <option value="Returns">Returns</option>
                    <option value="USD">USD</option>

                    <option value="Bonds">Bonds</option>

                    <option value="CAD">CAD</option>

                    <option value="Breadth">Breadth</option>
                  </select>
                </div>
                <div className="col-6 row m-0 px-4">
                  <label htmlFor="category" className="form-label invisible">
                    Last Updated
                  </label>

                  <button
                    onClick={handleClose}
                    className="btn btn-light  border-2px col-5 mx-auto   fw-bold  "
                    type="button"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleClose}
                    className="btn btn-dark   col-5 mx-auto   fw-bold  "
                    type="button"
                  >
                    Apply
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

export default FilterModal;
