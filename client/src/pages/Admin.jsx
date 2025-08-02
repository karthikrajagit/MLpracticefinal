import React from 'react';
import { Link } from 'react-router-dom';

const adminSections = [
  {
    title: 'Post Problem',
    path: '/postproblem',
    label: 'Add New Problem',
  },
  {
    title: 'Post Topic',
    path: '/posttopic',
    label: 'Add New Topic',
  },
  {
    title: 'Post Subtopic',
    path: '/postsubtopic',
    label: 'Add New Subtopic',
  },
  {
    title: 'Post Content',
    path: '/postcontent',
    label: 'Add New Content',
  },
];

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
        {adminSections.map((section) => (
          <div key={section.title} className="bg-gradient-to-br from-black via-blue-800 to-black rounded-2xl shadow-md p-6 flex flex-col items-center justify-between">
            <h2 className="text-xl font-semibold mb-4 text-white">{section.title}</h2>
            <Link to={section.path}>
              <button className="bg-green-500 text-white font-medium px-4 py-2 rounded-full hover:bg-green-600 transition-all duration-200">
                {section.label}
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
