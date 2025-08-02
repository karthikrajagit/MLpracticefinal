
import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';




const RecentUpdates = () => {
  const navigate = useNavigate();
  const [topics, setTopics] = useState([]);
  const [subtopics, setSubtopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    const retrieveTopics = async () => {
      try {
      const response = await axios.get("/api/v1/topics/retrievetopics");
      const topicNames = response.data.topics.map(item => item.topic);
      setTopics(topicNames);
      } catch (error) {
      console.log(error); 
      } 
    };
    retrieveTopics();
  }, []);


   const handleTopicClick = async (topic) => {
    setSelectedTopic(topic);
    try {
      const res = await axios.post('/api/v1/topics/retrievesubtopics', {topic}); 
      setSubtopics(res.data.subtopics); 
    } catch (err) {
      console.log("Error fetching subtopics:", err);
      setSubtopics([]);
    }
  };

  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 p-4 border-r">
        <h2 className="text-xl font-bold mb-4">Topics</h2>
        <ul className="space-y-2">
          {topics.map((topic) => (
            <li key={topic}>
              <button
                onClick={() => handleTopicClick(topic)}
                className={`text-left text-blue-600 font-semibold hover:underline ${
                  selectedTopic === topic ? "underline" : ""
                }`}
              >
                {topic}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Recent ML Articles</h1>

        {selectedTopic ? (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              Subtopics under: <span className="text-blue-700">{selectedTopic}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subtopics.map((sub) => (
                <Link to={`/content/${sub.replace(/\s+/g, '-')}`}>
                    <div
                      key={sub}
                      className="border border-blue-800 rounded-xl p-4 hover:shadow-lg transition-all"
                    >
                      <h3 className="text-xl text-gray-800 font-semibold">{sub}</h3>
                      <p className="text-sm text-gray-500">{selectedTopic}</p>
                    </div>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-600">Click a topic on the left to view its subtopics.</p>
        )}
      </main>
    </div>
  );
};

export default RecentUpdates;