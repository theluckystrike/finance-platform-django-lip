import { FC } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

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
            borderRadius: '25px',
            overflow: 'hidden',
          }}
        >
          <form method="post" encType="multipart/form-data">
            <div className="mb-3">
              <div className="row mx-0 px-5">
                <div className="col-lg-6 m-0 px-4 mb-3">
                  <div className="dropdown">
                    <label htmlFor="">Category</label>
                    <input type="text" placeholder="All" />
                    <div className="dropdown-content">
                      <a>Returns</a>
                      <a>USD</a>
                      <a>Bonds</a> <a>CAD</a> <a>Breadth</a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 m-0 px-4 mb-3">
                  <div className="dropdown">
                    <label htmlFor="">Sub-Category</label>
                    <input type="text" placeholder="All" />
                    <div className="dropdown-content">
                      <a>Returns</a>
                      <a>USD</a>
                      <a>Bonds</a> <a>CAD</a> <a>Breadth</a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 m-0 px-4 mb-3">
                  <div className="dropdown">
                    <label htmlFor="">Sub-Category 2</label>
                    <input type="text" placeholder="All" />
                    <div className="dropdown-content">
                      <a>Returns</a>
                      <a>USD</a>
                      <a>Bonds</a> <a>CAD</a> <a>Breadth</a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 m-0 px-4 mb-3">
                  <div className="dropdown">
                    <label htmlFor="">Added</label>
                    <input type="text" placeholder="All" />
                    <div className="dropdown-content">
                      <a>Returns</a>
                      <a>USD</a>
                      <a>Bonds</a> <a>CAD</a> <a>Breadth</a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 m-0 px-4 mb-3">
                  <div className="dropdown">
                    <label htmlFor="">Last Updated</label>
                    <input type="text" placeholder="All" />
                    <div className="dropdown-content">
                      <a>Returns</a>
                      <a>USD</a>
                      <a>Bonds</a> <a>CAD</a> <a>Breadth</a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 m-0 px-4 mb-3  dropdown">
                  <label htmlFor="" className="invisible">
                    bh
                  </label>
                  <div className="d-flex justify-content-between">
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
                  <div />
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FilterModal;
