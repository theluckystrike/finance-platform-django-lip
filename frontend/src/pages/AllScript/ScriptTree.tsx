import React from 'react'
import ScriptChart from '../../Comopnent/Charts/ScriptChart'
import { useNavigate } from 'react-router-dom'
import Icon from '../../Comopnent/ui/icon/Icon'

const ScriptTree = () => {
  const Navigate =useNavigate()
  return (
    <div className='m-4'>
         <div className="d-flex justify-content-start flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-2 text-center">
       <button className='btn mb-3' onClick={()=>Navigate(-1)}><Icon icon='ArrowBack'size='45px'  color="dark"/></button> <h3 className="h1 fw-bold">Script Tree By Category</h3>
      </div>
        <ScriptChart/>
    </div>
  )
}

export default ScriptTree