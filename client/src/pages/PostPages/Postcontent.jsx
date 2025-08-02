import React, { useState } from 'react';
import axios from 'axios';

const Postcontent = () => {
  const [data, setData] = useState({
    subtopic: '',
    title: '',
    content: ''
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/v1/admin/postcontent', data);
      setStatus(res.data.message);
      setData({subtopic: '', title: '', content: '' }); 
    } catch (err) {
      setStatus("Error submitting content");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-black via-blue-800 to-black shadow-md rounded-xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Post Content
        </h1>


        <input
          type="text"
          name="subtopic"
          value={data.subtopic}
          onChange={handleChange}
          required
          placeholder="Enter the Subtopic"
          className="w-full border border-gray-300 rounded-md p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

          <input
          type="text"
          name="title"
          value={data.title}
          onChange={handleChange}
          required
          placeholder="Enter the Title"
          className="w-full border border-gray-300 rounded-md p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          name="content"
          value={data.content}
          onChange={handleChange}
          required
          placeholder="Enter the Content"
          rows="6"
          className="w-full border border-gray-300 rounded-md p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>

        {status && (
          <p className="text-center text-white mt-4">{status}</p>
        )}
      </form>
    </div>
  );
};

export default Postcontent;
