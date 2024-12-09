import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('/api/v1/admin/problems');
        const data = await response.json();
        if (response.ok) {
          setProblems(data);
        } else {
          console.log('Error fetching problems:', response.statusText);
        }
      } catch (error) {
        console.log('Error:', error.message);
      }
    };
    fetchProblems();
  }, []);

  return (
    <div className="p-5">
      <h1 className="text-4xl font-bold mb-5">Problems</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2 text-left">S.No</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
              <th className="border border-gray-300 px-4 py-2 text-left">Level</th>  
              <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>      
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr key={problem._id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{problem.title}</td>
                {problem.level === 'Medium' &&
                <td className='border border-gray-300 px-4 py-2 text-yellow-400'>{problem.level}</td>
                }
                {problem.level === 'Easy' &&
                <td className='border border-gray-300 px-4 py-2 text-green-500'>{problem.level}</td>
                }
                {problem.level === 'Hard' &&
                <td className='border border-gray-300 px-4 py-2 text-red-600'>{problem.level}</td>
                }
                <td className="border border-gray-300 px-4 py-2">

                  <Link
                    to={`/problem/${problem._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Problem
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
