import React from 'react'
import Custominput from '../../Components/Custominput'

const Addblogcat = () => {
  return (
    <div>
       <h3 className='mb-5 title'> Add blog category</h3> 
         <div> 
            <form action="">
                <Custominput type='text' label='enter blog category'/>
                <button type='submit' className='btn-success border-0 roundede-3 my-3'>Add Blog Category</button>

            </form>
            </div>  
    </div>
  )
}

export default Addblogcat