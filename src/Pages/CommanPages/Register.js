import React, { useState } from 'react';
import CustomInput from "../../Components/Custominput";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // To navigate after successful registration

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:1337/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: name, 
          email, 
          password,
          confirmPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        alert("Registration successful!");
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        localStorage.setItem('token', data.token);
        navigate('/seller'); // Redirect to login or another page
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during registration:", err);
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-yellow-400">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h3 className="text-2xl font-semibold text-center text-gray-800 mb-2">Create Account</h3>
        <p className="text-center text-gray-600 mb-6">Sign up to get started</p>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <CustomInput type="text" label="Full Name" id="name" value={name} onChange={(e) => setName(e.target.value)} />
          <CustomInput type="email" label="Email Address" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <CustomInput type="password" label="Password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <CustomInput type="password" label="Confirm Password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          <button 
            type="submit" 
            className={`block w-full py-3 text-center text-white font-semibold bg-yellow-400 rounded-md hover:bg-yellow-500 transition-colors ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <span className="block text-center text-gray-600 mt-4">
            Already have an account? <Link to="/" className="text-blue-500 hover:text-blue-600">Login</Link>
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;
