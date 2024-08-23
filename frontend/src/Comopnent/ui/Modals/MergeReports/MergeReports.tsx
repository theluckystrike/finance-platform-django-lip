import { FC, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { ActiveRoute } from '../../../../Menu';
import { Categoryarray } from '../../../../DummyData/TableData';

interface MergeReportsProps {
  show: boolean;
  handleClose: () => void;
}

const MergeReports: FC<MergeReportsProps> = ({show, handleClose }) => {
  const navigate = useNavigate()

  const [selectVlaue,setSelectValue]=useState('')
  return (
    <>
      <Modal  size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered show={show} onHide={handleClose}>
       
        <Modal.Body className='bg-light-green' style={{
          borderRadius:'25px',
          overflow:'hidden'
        }}> 
        <h5>Merge Reports</h5>

        <form  method="post" encType="multipart/form-data">
          <div className="mb-3">
            <div className="row mx-0 px-3">
              <div className="col-12 m-0  ">
            <label htmlFor="name" className="form-label"> Name</label>
                <input
                  id="name"
                  name="name"
                  className="form-control m-0"
                  required
                >
                   
                </input>
              </div>
        
              <div className="col-12  ">
            <label htmlFor="category" className="form-label">Report 1</label>

            <div className="dropdown">
                <input type="text" placeholder="All" />
                <div className="dropdown-content">
                  <span className="hover-span">Chart</span>
                  <span className="hover-span">Table</span>
                  <span className="hover-span">Chart and Table</span>
                </div>
              </div>
                </div>
                <div className="col-12  ">
            <label htmlFor="category" className="form-label">Report 2</label>

            <div className="dropdown">
                <input type="text" placeholder="All" />
                <div className="dropdown-content">
                  <span className="hover-span">Chart</span>
                  <span className="hover-span">Table</span>
                  <span className="hover-span">Chart and Table</span>
                </div>
              </div>
                </div>
              
            <div className="col-12 row  justify-content-evenly m-0  ">
            <label style={{  height: '33px'
}} htmlFor="category" className="invisible">Last Updated</label>
 
 
              <button
              onClick={handleClose}
                className="btn btn-dark col-5  px-3   fw-bold  "
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
}

export default MergeReports;
