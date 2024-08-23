import React from 'react'
import OrgChartTree from '../../Comopnent/Charts/TreeChart'
import { useNavigate } from 'react-router-dom'
import Icon from '../../Comopnent/ui/icon/Icon'

const CategoryManger = () => {
  const Navigate =useNavigate()
  return (
    <div className='m-4'>
         <div className="d-flex justify-content-start flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 text-center">
       <button className='btn mb-3' onClick={()=>Navigate(-1)}><Icon icon='ArrowBack'size='45px'  color="dark"/></button> <h3 className="h1 fw-bold">Category manager</h3>
      </div>
        <OrgChartTree/>
    </div>
  )
}

export default CategoryManger