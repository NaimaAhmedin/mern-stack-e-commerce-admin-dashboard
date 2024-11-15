import React, { useState } from 'react';
import CustomInput from "../../Components/Custominput";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Reset error message before each login attempt

    try {
      const response = await fetch('http://localhost:1337/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if(data.user){
        alert('login successful')
        
      }
      else {
        alert('please check username and password')
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-400">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-2">Login</h3>
        <p className="text-center text-gray-600 mb-6">Login to your account to continue</p>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <CustomInput
            type="text"
            label="Email Address"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CustomInput
            type="password"
            label="Password"
            id="pass"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <Link to="/forgot-password" className="text-blue-500 hover:text-blue-600">Forgot password?</Link>
          </div>
          <button 
            type="submit"
            className="block w-full py-3 text-center text-white font-semibold bg-yellow-400 rounded-md hover:bg-yellow-500 transition-colors"
          >
            Login
          </button>
          <span>New here? <Link to="/register" className="text-blue-500 hover:text-blue-600">Create an account</Link></span>
        </form>
      </div>
    </div>
  );
};

export default Login;
