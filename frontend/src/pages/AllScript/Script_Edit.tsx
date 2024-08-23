 
import React  from 'react';
import '../../assest/css/AllScript.css'
import Icon from '../../Comopnent/ui/icon/Icon';
 
 
import { useNavigate } from 'react-router-dom';
  
import CodeEdit from '../../Comopnent/CodeEditer/CodeEditer';
 
const ScriptEdit
 = () => {
    const Navigate =useNavigate()
   
 
    return (
<>
<div className="m-4 ">
      <div className="d-flex justify-content-center flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 text-center">
       <button className='btn mb-3' onClick={()=>Navigate(-1)}><Icon icon='ArrowBack'size='45px'  color="dark"/></button> <h1 className="h1 fw-bold">Editing (S&P 500 Sectors RoC On October 2008)</h1>
      </div>

      <div className="d-flex justify-content-center">
        <form
          className="w-75"
          
          method="post"
          encType="multipart/form-data"
        >
       

       
          <div className="mb-3">
            <label htmlFor="Description" className="form-label">
            Description
            </label>
            <textarea
            rows={3}
              id="Description"
              name="Description"
              className="form-control"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="Code" className="form-label">
              Code
            </label>
            {/* <textarea
              rows={15}
              id="Code"
              name="Code"
              className="form-control"
            /> */}

            <CodeEdit/>
          </div>
 

          <div className="mx-auto text-center">
            <button type="submit" className="btn btn-dark px-5">
              Save Changes
            </button>
          </div>
        </form>
      </div>
       
    </div>
        
        </>
    );
};

export default ScriptEdit
;
