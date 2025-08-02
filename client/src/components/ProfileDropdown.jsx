import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const ProfileDropdown = () => {

    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const {user} = useSelector((state) => state.user);
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
      
  return (
    <div ref={dropdownRef}>
        {user ? (
          <div className='flex flex-row gap-5'>
            <Link to={`/practice/${user._id}`}>
            <button className='bg-green-500 text-white font-medium px-2 py-2 rounded-full hover:bg-green-700 transition duration-200 ease-in-out'>
                Try yourself
            </button>
            </Link> 
        
            <img className='w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-800 hover:scale-105 transition duration-200' src ={user.avatar} alt='profile' 
            onClick={() => setIsOpen(!isOpen)}/>
        
            {isOpen && (
            <div className='absolute right-0 mt-14 mr-6 py-2 w-70 bg-gray-800 rounded-md shadow-lg'>
            <div className='px-4 py-2'>
                <p className='text-white font-semibold'>{user.username}</p>
                <p className='text-gray-400'>{user.gmail}</p>
            </div>
            <div className='px-4 py-2 border-t border-gray-700'>
                <button className='text-white hover:text-gray-400' 
                onClick={() => navigate('/profile')}>Profile</button>
            </div>
            <div className='px-4 py-2 border-t border-gray-700'>
                <button className='text-white hover:text-gray-400' 
                onClick={() => navigate('/contribution')}>Contribution</button>
            </div>
            </div>
            )}
        </div>
        ) : (
            <li className='text-white hover:underline'> Sign In</li>
        )}            
    </div>
  )
}

export default ProfileDropdown