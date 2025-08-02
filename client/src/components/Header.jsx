import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {useSelector} from 'react-redux'
import { Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';

export default function Header() {
  const navigate = useNavigate();
  
  const {user} = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

    useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  
  const adminEmail = ['karthik.raja.007a@gmail.com', 'karthikraja2@gmail.com', 'karthik.raja.007c@gmail.com']
  return (
    <header className="flex items-center justify-between bg-gradient-to-br from-gray-900 via-blue-950 to-black h-16  px-10 shadow-md">
      {/* Logo or Title */}
      <h1 className="text-3xl font-semibold text-white cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105" onClick={() => navigate('/home')}>
        DeepCode
      </h1>

      <div className='flex gap-5'>
        <Link to = '/home'>
          <span className='text-white font-semibold hover:underline hover:text-blue-500'>Home</span>
        </Link>

        <Link to = '/recentupdates'>
          <span className='text-white font-semibold hover:underline hover:text-blue-500'>Recent Updates</span>
        </Link>  
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center space-x-6" ref={dropdownRef}>
                 
         
        {user && adminEmail.includes(user.gmail) && (
         <button 
         onClick={() => navigate('/admin')} 
         className="bg-orange-500 text-white text-lg font-medium px-5 py-2 rounded-full hover:bg-orange-600 transition duration-200 ease-in-out focus:outline-none"
          >
         Admin
       </button>  
        )}

        <ProfileDropdown/>
      </div>
    </header>
  );
}
