import { Editor } from '@monaco-editor/react';
import React, { useState } from 'react'
import { FaPaperPlane, FaPlay, FaPlus } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import debounce from 'lodash.debounce';
import { useCallback } from 'react';


export default function UserEditor({dataset}) {
    const [loading, setLoading] = useState(false);
    const [isloading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: '' });
    const [isVisible, setIsVisible] = useState(false);
    const [isloadings, setIsLoadings] = useState(false);
    const [cells, setCells] = useState([{ id: 1, code: '', output: '', isError: false, }]);
    const {user} = useSelector((state) => state.user);
    const userId = user?._id;
    

    const triggerApplause = () => {
        setIsVisible(true);
        setTimeout(() => {
          setIsVisible(false);
        }, 5000);
      };
      const showToast = (message) => {
        setIsLoading(false);
        setIsLoadings(false);
        setToast({ visible: true, message });
        setTimeout(() => {
          setToast({ visible: false, message: '' });
        }, 3000); // Auto-hide after 5 seconds
      };

      const executeCode = async (cellId) => {
        const combinedCode = cells
          .filter(c => c.id <= cellId)
          .map(c => c.code)
          .join('\n');
          if(user!==null)
          {
          try {
          {
            const response = await fetch('http://localhost:5000/runcode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: combinedCode, dataset: dataset?.filename, userId: userId }),  
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
      }else
        {
          setIsLoadings(false);
          showToast("Please sign in to run the code");
        }     
      };
     
    
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

      const saveCodeToServer = async (cellId) => {
        const codeToSave = cells.find((c) => c.id === cellId)?.code || '';
        try {
          const response = await fetch('/api/v1/user/save/usercode', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: userId, code: codeToSave }),
          });
          }
       catch (error) {
          console.error('Error saving code:', error);
        }
      };

      const fetchSavedCode = async (cellId) => {
        try {
          const response = await fetch(`/api/v1/user/code/${userId}`);
          const data = await response.json();
          if (response.ok) {
            setCells([{ id: cellId, code: data.code || '', output: '' }]);
          }
        } catch (error) {
          console.error('Error fetching saved code:', error);
        }
      };
      const debouncedSave = useCallback(debounce(saveCodeToServer, 1000), [cells]);

        useEffect(() => {
          if (userId) {
            fetchSavedCode(1);
          }
        }, [userId]);


  return (
    <div>
        <div >
        {cells.map(cell => (
          <div key={cell.id} className="mb-6">
            <Editor
              height="300px"
              width="100%"
              theme="vs-dark"
              defaultLanguage="python"
              value={cell.code}
              onChange={(value) => updateCode(value, cell.id)}
              options={{ fontSize: 14 }}
              className='border border-gray-800 rounded-md mr-2'
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
              maxHeight: '200px', 
              maxWidth: '100%',
              overflowY: 'auto', 
              overflowX: 'auto', 
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
            <img 
            src=""
            />
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
        
       
        </div>

    
      </div>
    </div>
  )
}
