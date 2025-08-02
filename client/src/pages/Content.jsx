import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ContentPage = () => {
  const { subtopic } = useParams();
  const [contents, setContents] = useState([]); 
  const [error, setError] = useState('');

  const retrieveContent = async () => {
    try {
      const res = await axios.get(`/api/v1/topics/content/${subtopic}`);
      setContents(res.data.contents); 
      setError('');
    } catch (err) {
      setError("Content not found");
    }
  };

  useEffect(() => {
    retrieveContent();
  }, [subtopic]);

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white shadow-xl rounded-2xl mt-10">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6 border-b pb-2">
        {subtopic ? subtopic.replace(/-/g, ' ') : 'Loading...'}
      </h1>

      {error ? (
        <p className="text-red-500 text-lg font-medium">{error}</p>
      ) : (
        <div className="text-gray-900 space-y-8"> {/* adds spacing between each paragraph */}
          {contents.map((item, index) => (
            <div key={index}>
              <h2 className="text-xl font-bold text-blue-800 mb-2">{item.title}</h2>
              <p className="text-lg leading-relaxed">{item.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContentPage;
