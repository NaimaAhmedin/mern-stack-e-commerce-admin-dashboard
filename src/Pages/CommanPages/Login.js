import React from 'react';
import CustomInput from "../../Components/Custominput";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-400">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-2">Login</h3>
        <p className="text-center text-gray-600 mb-6">Login to your account to continue</p>
        <form className="space-y-4">
          <CustomInput type="text" label="Email Address" id="email" />
          <CustomInput type="password" label="Password" id="pass" />
          <div className="flex justify-between items-center">
            <Link to="/forgot-password" className="text-blue-500 hover:text-blue-600">Forgot password?</Link>
           
          </div>
          <Link 
            to="/admin" 
            className="block w-full py-3 text-center text-white font-semibold bg-yellow-400 rounded-md hover:bg-yellow-500 transition-colors"
          >
            Login
          </Link>
         <span>New here? <Link to="/register" className="text-blue-500 hover:text-blue-600 ">Create an account</Link></span>
        </form>
      </div>
    </div>
  );
};

export default Login;
