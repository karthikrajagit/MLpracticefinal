import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import OAuth from '../components/OAuth';
import { signInstart,signInfailure, signInsuccess } from '../redux/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState({})
  const {loading} = useSelector((state) => state.user);
  const [error, setError] = useState(null);
  const handleChange = (e) => {
    setFormdata({...formdata, [e.target.name]:e.target.value})
  }
    const handleSubmit = async (e) => {
      e.preventDefault();
      dispatch(signInstart());
      try {
        const response = await fetch('/api/v1/user/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formdata)
        });
        const data = await response.json();
        if(response.ok){
          dispatch(signInsuccess(data));
          navigate('/');
        }
        else{
          setError(data.message);
          dispatch(signInfailure(data.message));
        }
      } catch (error) {
        setError(error.message);
        dispatch(signInfailure(error.message));
      }
    };
  return (
    <div>
    <div className="flex items-center justify-center min-h-screen bg-gray-100 flex-col">
      <form className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Sign Up</h2>
        
        <div className="flex flex-col mb-4">
          <label className="text-gray-600 font-medium mb-1" >Username</label>
          <input 
            type="text" 
            name="username" 
            placeholder="username" 
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col mb-4">
          <label className="text-gray-600 font-medium mb-1">Email</label>
          <input 
            type="gmail" 
            name="gmail" 
            placeholder="example@domain.com" 
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col mb-6">
          <label className="text-gray-600 font-medium mb-1">Password</label>
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
            'Sign Up'
          )}
        </button>
        <div className="flex items-center justify-center my-2">
          <span className="text-gray-600 text-lg font-semibold">or</span>
        </div>

        <OAuth />
      </form>
      {error!==null && <p className='text-red-500'>{error}</p>}
      <div className='mt-5 flex flex-row gap-2'>
      <p>Have an account? </p>
      <Link to="/signin">
        <span className='text-blue-700 hover:underline'>Sign In</span>
      </Link>
      </div>
      </div>
    </div>
  )
}
