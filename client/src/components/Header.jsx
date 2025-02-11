import React from 'react'
import { useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  
  const {user} = useSelector((state) => state.user);
  const userId = user._id;
  const adminEmail = ['karthik.raja.007a@gmail.com', 'karthikraja2@gmail.com']
  return (
    <header className="flex items-center justify-between bg-blue-600 h-20 px-10 shadow-md">
      {/* Logo or Title */}
      <h1 className="text-3xl font-semibold text-white cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105" onClick={() => navigate('/')}>
        DeepCode
      </h1>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-6">
          <Link to='/profile'>
            {user ? (
              <img className='w-10 h-10 rounded-full object-cover' src ={user.avatar} alt='profile'/>
              ) : (
                <li className='text-white hover:underline'> Sign In</li>
              )}
          </Link>
          <Link to={`/problem/user/${userId}`}>
          <button className='bg-green-500 text-white font-medium px-2 py-2 rounded-full hover:bg-green-700 transition duration-200 ease-in-out'>Try yourself</button>
        </Link>
        {user && adminEmail.includes(user.gmail) && (
         <button 
         onClick={() => navigate('/admin')} 
         className="bg-orange-500 text-white text-lg font-medium px-5 py-2 rounded-full hover:bg-orange-600 transition duration-200 ease-in-out focus:outline-none"
          >
         Admin
       </button>  
        )}
       

      </div>
    </header>
  );
}
