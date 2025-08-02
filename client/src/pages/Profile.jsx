import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

export default function Profile() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [name, setName] = useState(user.username);
  const [email, setEmail] = useState(user.gmail);
  const [avatar, setAvatar] = useState(user.avatar);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatar(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const update = await fetch('api/v1/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, avatar }),
      });
    } catch (error) {
      
    }
  }
 

  return (
    <div className="p-5 flex justify-center flex-col items-center bg-blue-100 rounded-lg shadow-md max-w-md mx-auto mt-4">
      <h1 className="text-3xl font-bold mb-5">Edit Profile</h1>
      <div className="relative">
        <label htmlFor="avatar-upload" className="cursor-pointer">
          <img
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
            src={avatar}
            alt="profile"
          />
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
      <div className="mt-5 w-full">
        <label className="block text-gray-700 font-medium">Username:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md"
        />
      </div>
      <div className="mt-3 w-full">
        <label className="block text-gray-700 font-medium">Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mt-1 border border-gray-300 rounded-md"
        />
      </div>
      <button
        onClick={handleSave}
        className="mt-5 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Save
      </button>
    </div>
  );
}
