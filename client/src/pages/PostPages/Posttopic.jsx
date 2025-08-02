import React, { useState } from 'react';
import axios from 'axios';

const Posttopic = () => {
  const [topic, setTopic] = useState('');

  const handleChange = (e) => {
    setTopic(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (topic.trim()) {
      
      try {
        const response = axios.post('/api/v1/admin/posttopic', { topic });
      } catch (error) {
        console.log(error);
      }
      setTopic('');
    } else {
      alert('Please enter a topic.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-black via-blue-800 to-black shadow-md rounded-xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Post Topic
        </h1>
        <input
          type="text"
          name="topic"
          value={topic}
          onChange={handleChange}
          placeholder="Enter the topic"
          className="w-full border border-gray-300 rounded-md p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Posttopic;
