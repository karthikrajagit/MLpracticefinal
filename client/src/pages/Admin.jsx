import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadStart, uploadSuccess, uploadFailure } from '../redux/admin/adminSlice';

export default function Admin() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    output: [], // Initialize output as an array
    level: '',
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [currentOutput, setCurrentOutput] = useState(''); // Temporary input for array items

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFiles = (e) => {
    setFile(e.target.files);
  };

  const handleAddOutput = () => {
    if (currentOutput.trim()) {
      setFormData({ ...formData, output: [...formData.output, currentOutput.trim()] });
      setCurrentOutput(''); // Clear the input field
    }
  };

  const handleRemoveOutput = (index) => {
    setFormData({
      ...formData,
      output: formData.output.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(uploadStart());
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('output', JSON.stringify(formData.output)); // Append output as JSON
    data.append('level', formData.level);
    if (file) {
      Array.from(file).forEach((f) => data.append('files', f));
    }
    try {
      const response = await fetch('/api/v1/admin/upload', {
        method: 'POST',
        body: data,
      });

      if (response.ok) {
        const responseData = await response.json();
        dispatch(uploadSuccess(responseData));
        setStatus('Uploaded Successfully');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      dispatch(uploadFailure(error.message));
      setStatus('Upload Failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Admin Upload</h2>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="title" className="text-gray-600 font-medium mb-1">Title</label>
            <input
              type="text"
              name="title"
              placeholder="Enter title"
              onChange={handleChange}
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="description" className="text-gray-600 font-medium mb-1">Description</label>
            <textarea
              name="description"
              placeholder="Enter description"
              onChange={handleChange}
              className="border rounded-lg p-3 h-24 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              required
            ></textarea>
          </div>

          <div className="flex flex-col">
            <label htmlFor="output" className="text-gray-600 font-medium mb-1">Expected Outputs</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={currentOutput}
                placeholder="Add an output"
                onChange={(e) => setCurrentOutput(e.target.value)}
                className="border rounded-lg p-3 flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddOutput}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
              >
                Add
              </button>
            </div>
            <div className="mt-2">
              {formData.output.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="bg-gray-200 px-3 py-1 rounded-lg">{item}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOutput(index)}
                    className="text-red-500 font-semibold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="Level" className="text-gray-600 font-medium mb-1">Level</label>
            <input
              type="text"
              name="level"
              placeholder="Enter Level"
              onChange={handleChange}
              className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="files" className="text-gray-600 font-medium mb-1">Upload Dataset (.csv)</label>
            <input
              type="file"
              accept=".csv"
              multiple
              onChange={handleFiles}
              className="border rounded-lg p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white border-opacity-75"></div>
            ) : (
              'Submit'
            )}
          </button>
          
          {status === 'Uploaded Successfully' && (
            <span className="text-green-500 font-semibold mt-4">{status}</span>
          )}
          {status === 'Uploaded Failed' && (
            <span className="text-red-500 font-semibold mt-4">{status}</span>
          )}
          
        </form>
      </div>
    </div>
  );
}
