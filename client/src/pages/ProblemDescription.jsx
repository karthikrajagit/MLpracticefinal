import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Editor } from '@monaco-editor/react';
import { FaPlay, FaPlus, FaPaperPlane } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback } from 'react';
import debounce from 'lodash.debounce';
import { Howl } from 'howler';


export default function ProblemDescription() {
  const {user} = useSelector((state) => state.user);
  const userId = user?._id;
  const { id: problemIdFromUrl } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isloading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const [isVisible, setIsVisible] = useState(false);
  const [isloadings, setIsLoadings] = useState(false);


  const saveCodeToServer = async (cellId) => {
    const codeToSave = cells.find((c) => c.id === cellId)?.code || '';
    try {
      const response = await fetch('/api/v1/user/save-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, problemId: problemIdFromUrl, code: codeToSave }),
      });
      console.log(response);
      }
   catch (error) {
      console.error('Error saving code:', error);
    }
  };


  

  const triggerApplause = () => {
    setIsVisible(true);

    // Remove applause after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

 


  const fetchSavedCode = async (cellId) => {
    try {
      const response = await fetch(`/api/v1/user/code/${userId}/${problemIdFromUrl}`);
      const data = await response.json();
      if (response.ok) {
        setCells([{ id: cellId, code: data.code || '', output: '' }]);
      }
    } catch (error) {
      console.error('Error fetching saved code:', error);
    }
  };

  // State to manage code cells and outputs
  const [cells, setCells] = useState([{ id: 1, code: '', output: '', isError: false, }]);
  const [submissionStatus, setSubmissionStatus] = useState(''); 

  // Fetch problem data
 
  
  useEffect(() => {
    const getProblemById = async (problemIdFromUrl) => {
      
      try {
        setLoading(true);
        const response = await fetch(`/api/v1/admin/problems/${problemIdFromUrl}`);
        const data = await response.json();
        if (response.ok) {
          setLoading(false);
          setProblem(data);
        } else {
          setLoading(false);
          console.error('Error fetching problem data:', data.message);
        }
      } catch (error) {
        setLoading(false);
        console.error('Fetch error:', error);
      }
    };
    getProblemById(problemIdFromUrl);
  }, [problemIdFromUrl]);


  useEffect(() => {
    if (isVisible) {
      console.log('Playing sound');
      const audio = new Howl({
        src: ['success-1-6297.mp3'], // Ensure this file is in the `public` folder
        volume: 1.0,
        preload: true,
        onload: () => {
          console.log('Audio loaded, now playing...');
          audio.play();
        },
        onloaderror: (error) => {
          console.error('Error loading audio:', error);
        },
      });
      console.log('Howl initialized:', audio);
    }
  }, [isVisible]);
  


  useEffect(() => {
    if (userId && problemIdFromUrl) {
      fetchSavedCode(1);
    }
  }, [userId, problemIdFromUrl]);
  

  const showToast = (message) => {
    setIsLoading(false);
    setIsLoadings(false);
    setToast({ visible: true, message });
    setTimeout(() => {
      setToast({ visible: false, message: '' });
    }, 3000); // Auto-hide after 5 seconds
  };

  // Function to handle code execution (sending to backend for evaluation)
  const executeCode = async (cellId) => {
    const combinedCode = cells
      .filter(c => c.id <= cellId)
      .map(c => c.code)
      .join('\n');
      if(user!==null)
      {
      try {
      {
        const response = await fetch('http://localhost:5000/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: combinedCode, dataset: problem.filename, userId: userId }),  
      });
      const data = await response.json();
      if (response.ok) {
        setIsLoadings(false);
        setCells(cells.map(c => c.id === cellId ? { ...c, output: data.output, isError: false } : c, ));
        
      } else {
        setIsLoadings(false);
        setCells(cells.map(c => c.id === cellId ? { ...c, output: data.error, isError: true } : c));
      }
    }
  }   
    catch (error) {
      setIsLoadings(false);
      setCells(cells.map(c => c.id === cellId ? { ...c, output: 'Error executing code' } : c));
    }
  }
    else
    {
      setIsLoadings(false);
      showToast("You need to sign in to execute code");
    }     
  };
  const handleButtonClick2 = () => {
    submitAllCells();
    setIsLoading(true);
  }

  const handleButtonClick1 = (cellId) => {
    executeCode(cellId);
    setIsLoadings(true);
  }
  // Add new code cell
  const addNewCell = () => {
    setCells([...cells, { id: cells.length + 1, code: '', output: '' }]);
  };

  // Update code in a cell
  const updateCode = (value, cellId) => {
    setCells(cells.map(c => c.id === cellId ? { ...c, code: value } : c));
    debouncedSave(cellId);  

  };
  const debouncedSave = useCallback(debounce(saveCodeToServer, 1000), [cells]);


  // Submit all code cells
  
 // Submit all code cells
const submitAllCells = async () => {
  const combinedCode = cells
    .map(c => c.code)  // Get code from all cells, not just the last one
    .join('\n');

  try {
    if (user !== null) {
      const response = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: combinedCode, 
          datasets: problem.datasets, 
          outputs: problem.outputs,
          userId: userId
        }),
      });
      const data = await response.json();
      if (response.ok) {
        // Update all cells' outputs based on the response
        setCells(cells.map(c => ({ ...c, output: data.output , isError: false })));
        setIsLoading(false);
        setSubmissionStatus('Accepted');
        triggerApplause();
      } else {
        if(data.error)
        {
        setIsLoading(false);
        setCells(cells.map(c => ({ ...c, output: data.error, isError: true })));
        }
        else {
          setCells(cells.map(c => ({
            ...c,
            output: (
              <div style={{ color: 'black', fontSize: '16px', whiteSpace: 'pre-wrap' }}>
                {`Actual Output: ${data.actual_output}\nExpected Output: ${data.expected_output}`}
              </div>
            ),
            isError: false
          })));
        }
        setIsLoading(false);
        setSubmissionStatus('Not Accepted');
      }
    } else {
      setIsLoading(false);
      showToast("You need to sign in to execute code");
    }
  } catch (error) {
    setCells(cells.map(c => ({ ...c, output: 'Error executing code' })));
    setIsLoading(false);
    setSubmissionStatus('Not Accepted');
  }
};

  if (loading) {
    return <div className="text-center mt-8 text-gray-600">Loading problem details...</div>;
  }

  if (!problem) {
    return <div className="text-center mt-8 text-red-500">Error: Problem not found!</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row mt-2 lg:space-x-4">

{toast.visible && (
  <AnimatePresence>
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 1, y: -50 }}
      transition={{ duration: 0.5 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white text-sm font-medium px-4 py-2 rounded shadow-lg z-50"
      style={{ maxWidth: '300px', textAlign: 'center' }}
    >
      {toast.message}
    </motion.div>
  </AnimatePresence>
)}

      {/* Left Section: Problem Description */}
      <div className="lg:w-1/2 bg-white rounded-lg shadow-lg p-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{problem.title}</h2>
        {problem.level==='Easy' && (<p className="text-green-500 mb-2">
          
          <span className=" text-gray-800 font-semibold ">Level: </span> {problem.level}
        </p>)}
        {problem.level==='Medium' && (<p className="text-yellow-500 mb-2">
          
          <span className="text-gray-800 font-semibold">Level: </span> {problem.level}
        </p>)}
        {problem.level==='Hard' && (<p className="text-red-500 mb-2">
          
          <span className="text-gray-800 font-semibold">Level: </span> {problem.level}
        </p>)}
        

        <h1 className="text-2xl font-semibold text-blue-600 mt-4">Problem Details</h1>
        <p className="text-gray-700 mb-4">
          <span className="font-bold">Description:</span> {problem.description}
        </p>
        <p className="text-gray-700 mb-4">
          <span className="font-bold">Output:</span> {problem.output}
        </p>
        <p className="text-gray-700 mb-4">
          <span className="font-bold">Dataset:</span> {problem.filename}
        </p>

        <h2 className="text-lg font-bold text-gray-800 mt-6">First 5 Rows of Dataset:</h2>
        <div className="overflow-auto mt-4">
          <table className="table-auto border border-gray-300 w-full">
            <thead className="bg-gray-100">
              <tr>
                {problem.firstFiveRows && Object.keys(problem.firstFiveRows[0]).map((header, idx) => (
                  <th key={idx} className="border border-gray-300 px-4 py-2 text-sm text-gray-700">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {problem.firstFiveRows && problem.firstFiveRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  {Object.values(row).map((value, i) => (
                    <td key={i} className="border border-gray-300 px-4 py-2 text-sm text-gray-600">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Divider */}
      <div className="border-l-2 border-gray-300 hidden lg:block"></div>

      {/* Right Section: Code Editor and Output */}
      <div className="lg:w-1/2 mt-6 lg:mt-0">
        {cells.map(cell => (
          <div key={cell.id} className="mb-6">
            <Editor
              height="200px"
              width="100%"
              theme="vs-dark"
              defaultLanguage="python"
              value={cell.code}
              onChange={(value) => updateCode(value, cell.id)}
              options={{ fontSize: 14 }}
            />
            <button
            className={`mt-2 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-transform transform hover:scale-105 ${
            isloading ? "cursor-not-allowed" : ""
            }`}
            onClick={() => handleButtonClick1(cell.id)}
            disabled={isloadings} // Disable the button while loading
            >
        {isloadings ? (
          // Spinner
          <svg
            className="w-5 h-5 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : (
          <>
            <FaPlay className="mr-2" /> Run Code
          </>
        )}
      </button>
            <div
            className={`bg-gray-100 rounded p-4 mt-2 shadow-inner overflow-auto`}
            style={{
              maxHeight: '200px', // Max height to enable vertical scrolling
              maxWidth: '100%', // Flexible width
              overflowY: 'auto', // Vertical scroll when content overflows
              overflowX: 'auto', // Horizontal scroll when content overflows
            }}
          >
            <h4 className="font-semibold text-gray-800">Output:</h4>
            <pre
              className={`text-sm whitespace-pre-wrap ${
                cell.isError ? 'text-red-500' : 'text-black'
              }`}
            >
              {cell.output}
            </pre>
          </div>



          </div>
        ))}
        <div className="flex items-center space-x-2 mt-4">
          <button
            className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-transform transform hover:scale-105"
            onClick={addNewCell}
          >
            <FaPlus className="mr-2" /> Add New Cell
          </button>
          <button
        className={`flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-transform transform hover:scale-105 ${
          isloading ? "cursor-not-allowed" : ""
        }`}
        onClick={handleButtonClick2}
        disabled={isloading} // Disable the button while loading
      >
        {isloading ? (
          // Spinner
          <svg
            className="w-5 h-5 text-white animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        ) : (
          <>
            <FaPaperPlane className="mr-2" /> Submit
          </>
        )}
      </button>
        </div>

        {submissionStatus && (
          <div className={`mt-4 font-bold text-lg ${submissionStatus === 'Accepted'  ? 'text-green-500' : 'text-red-500'}`}>
            {submissionStatus}
            {isVisible && (
              <div
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-10 py-6 rounded-lg shadow-xl text-2xl font-semibold border-4 border-yellow-500"
              >
                🎉 👏 Successfully Accepted 👏 🎉
              </div>
             
            )}

          
            
          </div>
        )}
        
      </div>
    </div>
  );
}
