import { FC, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import { ActiveRoute } from '../../../../Menu';
import { Categoryarray } from '../../../../DummyData/TableData';

interface CategoryModalProps {
 
  show: boolean;
  handleClose: () => void;
}

const CategoryModal: FC<CategoryModalProps> = ({show, handleClose }) => {
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
        
              <div className="col-12  ">
            <label htmlFor="category" className="form-label">Parent Category</label>

                  <div className="dropdown">
                    <input type="text" placeholder="All" value={selectVlaue}/>
                    <div className="dropdown-content" style={ {height:'200px',overflow:'auto'}}>
                      {Categoryarray.map((item, index) => (
                        <span className="h6" key={index}>
                          {item.name}

                          {item.subcategory.map((subitem, subindex) => (
                            <span className="text-muted" key={subindex}>
                              {subitem.name}

                              {subitem.innerCategory.map(
                                (inneritem, innerindex) => (
                                  <span
                                    className="fs-6 hover-span"
                                    key={innerindex}
                                    onClick={()=>setSelectValue(inneritem)}
                                  >
                                    {inneritem}
                                  </span>
                                )
                              )}
                            </span>
                          ))}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              
            <div className="col-12 row  justify-content-evenly m-0  ">
            <label style={{  height: '33px'
}} htmlFor="category" className="invisible">Last Updated</label>
 
 <button
              onClick={ ()=>navigate(`/account/${ActiveRoute.CategoryManager.path}`)}
                className="btn  border border-dark col-5  px-3   fw-bold  "
                type="button"
           
              >
               Edit All Category
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
