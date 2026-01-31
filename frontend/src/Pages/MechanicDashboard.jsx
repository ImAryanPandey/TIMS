import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const MechanicDashboard = () => {
  const [tools, setTools] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (!userInfo) {
      navigate('/');
      return; 
    }

    const fetchTools = async () => {
      try {
        const { data } = await API.get(`/issues/my-tools/${userInfo._id}`);
        setTools(data);
      } catch (error) {
        console.error("Failed to load tools", error);
      }
    };

    fetchTools();

  }, [navigate]);

  const handleReturn = async (issueId) => {
    if(!window.confirm("Return this tool?")) return;
    try {
      await API.put(`/issues/${issueId}/return`);
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Error returning tool");
    }
  };

  const user = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8 flex items-center justify-between rounded bg-white p-4 shadow">
        <h1 className="text-xl font-bold">Welcome, {user?.name}</h1>
        <button 
            onClick={() => { localStorage.clear(); navigate('/'); }} 
            className="text-red-500 font-medium"
        >
            Logout
        </button>
      </header>

      <h2 className="mb-4 text-lg font-semibold">My Issued Tools</h2>
      
      {tools.length === 0 ? (
        <p className="text-gray-500">No tools currently issued to you.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((issue) => (
            <div key={issue._id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow border border-gray-200">
              <div>
                <h3 className="font-bold text-gray-800">{issue.tool?.title || 'Tool'}</h3>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                    {issue.tool?.category}
                </span>
                <p className="mt-2 text-sm text-gray-600">Qty: {issue.qty_issued}</p>
              </div>
              <button 
                onClick={() => handleReturn(issue._id)}
                className="rounded bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600"
              >
                Return
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MechanicDashboard;