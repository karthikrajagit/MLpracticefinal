import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OAuth from '../components/OAuth';
import { useDispatch, useSelector } from 'react-redux';
import { signInsuccess, signInfailure, signInstart } from '../redux/user/userSlice';

export default function Signin() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState({});
  const {loading} = useSelector((state) => state.user);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
    console.log(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInstart()); // Start loading
    try {
      const response = await fetch('/api/v1/user/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formdata),
      });
      const data = await response.json();
      if (response.ok) {
        dispatch(signInsuccess(data));
        navigate('/');
      } else {
        setError(data.message);
        dispatch(signInfailure(data.message));
      }
    } catch (error) {
      setError(error.message);
      dispatch(signInfailure(error.message));
    } 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 flex-col">
      <form className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign In</h2>
        
        <div className="flex flex-col mb-4">
          <label className="text-gray-600 font-medium mb-1" htmlFor="email">Email</label>
          <input
            type="email"
            name="gmail"
            placeholder="example@domain.com"
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col mb-6">
          <label className="text-gray-600 font-medium mb-1" htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="password"
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-opacity-75"></div>
          ) : (
            'Sign In'
          )}
        </button>

        <div className="flex items-center justify-center my-2">
          <span className="text-gray-600 text-lg font-semibold">or</span>
        </div>

        <OAuth />
      </form>

      { (error === 'User not found' || error === 'Incorrect password') && <span className="text-red-500 font-semibold mt-2">{error}</span> }


      <div className="mt-5 flex flex-row gap-2">
        <p>Don't have an account?</p>
        <Link to="/signup">
          <span className="text-blue-700 hover:underline">Sign Up</span>
        </Link>
      </div>
    </div>
  );
}
