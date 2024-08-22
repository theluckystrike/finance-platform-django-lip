import { FC } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { ActiveRoute } from '../../../../Menu';

interface CategoryModalProps {
 
  show: boolean;
  handleClose: () => void;
}

const CategoryModal: FC<CategoryModalProps> = ({show, handleClose }) => {
  const navigate = useNavigate()
  return (
    <>
      <Modal  size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered show={show} onHide={handleClose}>
       
        <Modal.Body className='bg-light-green' style={{
          borderRadius:'25px',
          overflow:'hidden'
        }}> 

        <form  method="post" encType="multipart/form-data">
          <div className="mb-3">
            <div className="row mx-0 px-3">
              <div className="col-12 m-0  ">
            <label htmlFor="category" className="form-label">Category Name</label>
                <input
                  id="category"
                  name="category"
                  className="form-control m-0"
                  
                  required
                >
                   
                </input>
              </div>
            <div className="col-12 m-0  ">
            <label htmlFor="category" className="form-label">Parent Category</label>
                <select
                  id="category"
                  name="category"
                  className="form-select m-0"
                  
                  required
                >
                  <option value="" disabled selected>All</option>
                  <option value="Returns">Returns</option>
                  <option value="USD">USD</option>

                  <option value="Bonds">Bonds</option>

                  <option value="CAD">CAD</option>

                  <option value="Breadth">Breadth</option>

                </select>
              </div>
              
            <div className="col-12 row  justify-content-evenly m-0  ">
            <label style={{  height: '33px'
}} htmlFor="category" className="invisible">Last Updated</label>
 
 <button
              onClick={ ()=>navigate(`/account/${ActiveRoute.CategoryManager.path}`)}
                className="btn  border border-dark col-5  px-3   fw-bold  "
                type="button"
           
              >
               Edit Category
              </button>
              <button
              onClick={handleClose}
                className="btn btn-dark col-5  px-3   fw-bold  "
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
}

export default CategoryModal;
