import React from 'react'
import Custominput from '../../Components/Custominput'

const Addcolor = () => {
  return (
    <div>
       <h3 className='mb-5 title'> Add color</h3> 
         <div> 
            <form action="">
                <Custominput type='color' label='Add color'/>
                <button type='submit' className='btn-success border-0 roundede-3 my-3'>Add color</button>

            </form>
            </div>  
    </div>
  )
}

export default Addcolor