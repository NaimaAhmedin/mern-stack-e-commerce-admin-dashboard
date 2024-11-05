import React from 'react'
import Custominput from '../../Components/Custominput'

const Addcat = () => {
  return (
    <div>
       <h3 className='mb-5 title'> Add category</h3> 
         <div> 
            <form action="">
                <Custominput type='text' label='Add category'/>
                <button type='submit' className='btn-success border-0 roundede-3 my-3'>Add category</button>

            </form>
            </div>  
    </div>
  )
}

export default Addcat