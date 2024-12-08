
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CustomInput from "../../Components/Custominput";
import { Link } from "react-router-dom";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // Hook for navigation

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
  
    console.log('Login Attempt:', { email, password }); 
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    console.log('Server Response:', result);

      if (response.status === 200) {
        localStorage.setItem('token', result.token);  // Store token in localStorage
        localStorage.setItem('role', result.role);    // Optionally store user role

        if (result.data.role === 'SuperAdmin') {
          navigate('/admin');  // Redirect to admin dashboard
        } else if (result.data.role === 'ContentAdmin') {
          navigate('/Content-Admin');   // Redirect to content admin dashboard
        } else if (result.data.role === 'DeliveryAdmin') {
          navigate('/DeliveryAdmin');   // Redirect to delivery admin dashboard
        } else if (result.data.role === 'seller') {
          navigate('/seller');   // Redirect to seller dashboard
        } else {
          navigate('/'); // Default redirect if role is undefined or unexpected
        }
  
        console.log('Login successful');
      } else {
        setError(result.message || 'Invalid login credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
      console.error('Login error:', error);
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
