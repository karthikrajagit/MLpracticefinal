import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserEditor from '../components/UserEditor';

export default function Practice() {
  const { user } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [dataset, setDataset] = useState(null);
  const navigate = useNavigate();

  const userId = user?._id;

  useEffect(() => {
    if (!user) {
      navigate("/signin");
      return;
    }

    const getDataset = async () => {
      try {
        const response = await fetch(`/api/v1/user/getuserdataset/${userId}`, {
          method: "GET",
        });
        const data = await response.json();
        setDataset(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching dataset:", error);
      }
    };

    if (userId) {
      getDataset();
    }
  }, [userId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const data = new FormData();
    data.append("file", file);
    data.append("userId", userId);

    try {
      const result = await fetch("/api/v1/user/userupload", {
        method: "POST",
        body: data,
      });
      const response = await result.json();
      console.log(response);
      setDataset(response);
      location.reload();
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="p-5 flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Left Section: File Upload */}
      <div className="flex flex-col gap-7 p-8 border-r-4 border-blue-500 bg-white shadow-md rounded-lg w-full lg:w-1/3">
        <h1 className="text-2xl font-bold text-gray-800">
          📂 Upload Your File
        </h1>

        <input 
          type="file" 
          accept=".csv" 
          className="border border-gray-300 p-2 rounded-md text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setFile(e.target.files[0])} 
        />

        <button
          className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold shadow-md hover:bg-blue-700 transition-all"
          onClick={handleSubmit}
        >
          Upload File 🚀
        </button>

        <div className="mt-4">
          <span className="text-lg font-medium text-gray-700">
            {dataset?.filename ? `✅ Uploaded File: ${dataset.filename}` : "No file uploaded yet"}
          </span>
        </div>
      </div>

      {/* Right Section: UserEditor (Hidden on small screens) */}
      <div className="lg:w-2/3 bg-white shadow-md p-5 rounded-lg mt-0">
        <UserEditor dataset={dataset}/>
      </div>
    </div>
  );
}
