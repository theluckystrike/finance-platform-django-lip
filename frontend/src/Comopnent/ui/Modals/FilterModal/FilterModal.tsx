import { FC } from "react";
import Modal from "react-bootstrap/Modal";
import ArrowDown from '../../../../assest/image/arrow-down.png'

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
                <div className="col-6 m-0 px-4 mb-2">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <div className="dropdown">
                    <div className="arrow_down">
                      <img src={ArrowDown} alt="" />
                    </div>
                    <input type="text" placeholder="All" />
                    <div className="dropdown-content">
                      <span>Returns</span>
                      <span>USD</span>
                      <span>Bonds</span> <span>CAD</span>{" "}
                      <span>Breadth</span>
                    </div>
                  </div>
                </div>
                <div className="col-6 m-0 px-4 mb-2">
                  <label htmlFor="category" className="form-label">
                    Add Script
                  </label>
                  <div className="dropdown">
                    <div className="arrow_down">
                      <img src={ArrowDown} alt="" />
                    </div>
                    <input type="text" placeholder="All" />
                    <div className="dropdown-content">
                      <span>Returns</span>
                      <span>USD</span>
                      <span>Bonds</span> <span>CAD</span>{" "}
                      <span>Breadth</span>
                    </div>
                  </div>
                </div>
                <div className="col-6 m-0 px-4 mb-2">
                  <label htmlFor="category" className="form-label">
                    Sub-Category
                  </label>
                  <div className="dropdown">
                  <div className="arrow_down">
                      <img src={ArrowDown} alt="" />
                    </div>
                    <input type="text" placeholder="All" />
                    <div className="dropdown-content">
                      <span>Returns</span>
                      <span>USD</span>
                      <span>Bonds</span> <span>CAD</span>{" "}
                      <span>Breadth</span>
                    </div>
                  </div>
                </div>
                <div className="col-6 m-0 px-4 mb-2">
                  <label htmlFor="category" className="form-label">
                    Sub-Category 2
                  </label>
                  <div className="dropdown">
                    <div className="arrow_down">
                      <img src={ArrowDown} alt="" />
                    </div>
                    <input type="text" placeholder="All" />
                    <div className="dropdown-content">
                      <span>Returns</span>
                      <span>USD</span>
                      <span>Bonds</span> <span>CAD</span>{" "}
                      <span>Breadth</span>
                    </div>
                  </div>
                </div>
                <div className="col-6 m-0 px-4">
                  <label htmlFor="category" className="form-label">
                    Added
                  </label>
                  <div className="dropdown">
                    <div className="arrow_down">
                      <img src={ArrowDown} alt="" />
                    </div>
                    <input type="text" placeholder="All" />
                    <div className="dropdown-content">
                      <span>Returns</span>
                      <span>USD</span>
                      <span>Bonds</span> <span>CAD</span>{" "}
                      <span>Breadth</span>
                    </div>
                  </div>
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
