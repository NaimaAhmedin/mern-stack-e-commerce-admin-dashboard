import React from 'react';
import CustomInput from "../../Components/Custominput";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-400">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-2">Create Account</h3>
        <p className="text-center text-gray-600 mb-6">Sign up to get started</p>
        <form className="space-y-4">
          <CustomInput type="text" label="Full Name" id="name" />
          <CustomInput type="email" label="Email Address" id="email" />
          <CustomInput type="password" label="Password" id="password" />
          <CustomInput type="password" label="Confirm Password" id="confirmPassword" />
          <Link 
            to="/admin" 
            className="block w-full py-3 text-center text-white font-semibold bg-yellow-400 rounded-md hover:bg-yellow-500 transition-colors"
          >
            Register
          </Link>
          <span className="block text-center text-gray-600 mt-4">
            Already have an account? <Link to="/" className="text-blue-500 hover:text-blue-600">Login</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
