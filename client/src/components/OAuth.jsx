// OAuth Component
import React from 'react';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInstart, signInsuccess, signInfailure } from '../redux/user/userSlice';
import { data } from 'autoprefixer';

export default function OAuth() {
    const dispatch = useDispatch();
    const Navigate = useNavigate();
    const {loading} = useSelector((state) => state.user);
    const {error} = useSelector((state) => state.user);
    const handleGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const auth = getAuth(app);
        try {
            const result = await signInWithPopup(auth, provider);
            dispatch(signInstart());
            const response = await fetch('/api/v1/user/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: result.user.displayName,
                    gmail: result.user.email,
                    photo: result.user.photoURL
                })
            });
            if (response.ok) {
                const data = await response.json();
                dispatch(signInsuccess(data));
                Navigate('/');
            } else {
                dispatch(signInfailure(data.message || 'Authentication failed'));
                console.log("Error:", response.statusText);
            }
        } catch (error) {
            dispatch(signInfailure(error.message));
            console.log("Authentication error:", error.message);
        }
    };
    return (
        <div  className="flex items-center justify-center">
        <button
            type="button" // Change to "button" instead of "submit"
            className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition duration-200 flex items-center justify-center"
            disabled={loading}
            onClick={handleGoogle} // Use onClick instead of onSubmit
            >
                {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-opacity-75"></div>
                ) : (
                    'Continue with Google'
                )}
        </button>
        
        </div>
    );
}
