import React from 'react'
import CustomInput from "../../Components/Custominput"
const RestPassword = () => {
  return (
    <div className="py-5" style={{background:"#ffd333", minHeight:"100vh"}}>
        <div className="my-5 w-25 bg-white rounded-3 mx-auto p-4">
         <h3 className="text-center">Reset Password</h3>
         <p className="text-center">please insert new password</p>
         <form acrion="">
         <CustomInput type="password" label="New Password" id="pass"/>
         <CustomInput type="password" label="Comfirm Password" id="pass"/>
        <button className="border-0 px-3 py-2 text-white fw-bold w-100" style={{background:"#ffd333"}} type="submit">
            Reset Password
        </button>
         </form>
        </div>
    </div>
  )
}

export default RestPassword