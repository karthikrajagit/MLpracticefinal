import React, { useState } from 'react';
import axios from 'axios';

const Postsubtopic = () => {
  const [data, setData] = useState({
    topic: "",
    subtopic: ""
});

 const handleChange = (e) => {
  const { name, value } = e.target;
  setData(prevData => ({
    ...prevData,
    [name]: value
  }));
};


  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
        const response = await axios.post('/api/v1/admin/postsubtopic',  data);
      } catch (error) {
        console.log(error);
      }  
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-black via-blue-800 to-black shadow-md rounded-xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Post SubTopic
        </h1>
        <input
          type="text"
          name="topic"
          value={data.topic}
          onChange={handleChange}
          required
          placeholder="Enter the topic"
          className="w-full border border-gray-300 rounded-md p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
         <input
          type="text"
          name="subtopic"
          value={data.subtopic}
          onChange={handleChange}
          required
          placeholder="Enter the Subtopic"
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

export default Postsubtopic;
