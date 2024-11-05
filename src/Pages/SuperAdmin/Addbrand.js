import React from 'react'
import Custominput from '../../Components/Custominput'

const Addbrand = () => {
  return (
    <div>
       <h3 className='mb-5 title'> Add Brand</h3> 
         <div> 
            <form action="">
                <Custominput type='text' label='Add brand'/>
                <button type='submit' className='btn-success border-0 roundede-3 my-3'>Add brand</button>

            </form>
            </div>  
    </div>
  )
}

export default Addbrand