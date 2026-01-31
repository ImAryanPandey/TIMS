import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const MechanicDashboard = () => {
  const [myTools, setMyTools] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [activeTab, setActiveTab] = useState('my_tools');
  const navigate = useNavigate();

  // 1. Get User
  const user = JSON.parse(localStorage.getItem('userInfo'));
  // 2. Extract ID (Primitive String) to safely use in useEffect
  const userId = user?._id;

  useEffect(() => {
    if (!userId) {
      navigate('/');
      return; 
    }

    const fetchData = async () => {
      try {
        // Use userId (Stable variable) instead of user._id
        const myRes = await API.get(`/issues/my-tools/${userId}`);
        setMyTools(myRes.data);

        const invRes = await API.get('/tools');
        setInventory(invRes.data);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    fetchData();

  }, [navigate, userId]); // <--- Now safe to include userId

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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="mb-8 flex items-center justify-between rounded bg-white p-4 shadow">
        <h1 className="text-xl font-bold">Mechanic Panel: {user?.name}</h1>
        <button 
            onClick={() => { localStorage.clear(); navigate('/'); }} 
            className="text-red-500 font-medium hover:underline"
        >
            Logout
        </button>
      </header>

      {/* TABS */}
      <div className="mb-6 flex space-x-4 border-b border-gray-200 bg-white p-2 rounded shadow-sm">
        <button 
            onClick={() => setActiveTab('my_tools')}
            className={`px-4 py-2 font-medium ${activeTab === 'my_tools' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
            My Issued Tools
        </button>
        <button 
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 font-medium ${activeTab === 'inventory' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
        >
            Shop Inventory
        </button>
      </div>

      {/* TAB 1: MY TOOLS & RETURN INTERFACE */}
      {activeTab === 'my_tools' && (
        <>
            {myTools.length === 0 ? (
                <p className="text-gray-500">No tools currently issued to you.</p>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {myTools.map((issue) => (
                    <div key={issue._id} className="flex items-center justify-between rounded-lg bg-white p-4 shadow border border-gray-200">
                    <div>
                        <h3 className="font-bold text-gray-800">{issue.tool?.title || 'Tool'}</h3>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            {issue.tool?.category}
                        </span>
                        <p className="mt-2 text-sm text-gray-600">Qty Issued: {issue.qty_issued}</p>
                    </div>
                    <button 
                        onClick={() => handleReturn(issue._id)}
                        className="rounded bg-green-500 px-4 py-2 text-sm font-bold text-white hover:bg-green-600 transition"
                    >
                        Return
                    </button>
                    </div>
                ))}
                </div>
            )}
        </>
      )}

      {/* TAB 2: SHOP INVENTORY (READ ONLY) */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded shadow overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-100 border-b">
                    <tr>
                        <th className="p-3">Tool Name</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Available Qty</th>
                    </tr>
                </thead>
                <tbody>
                    {inventory.map(tool => (
                        <tr key={tool._id} className="border-b hover:bg-gray-50">
                            <td className="p-3 font-medium">{tool.title}</td>
                            <td className="p-3 text-gray-600">{tool.category}</td>
                            <td className={`p-3 font-bold ${tool.available_qty === 0 ? 'text-red-500' : 'text-green-600'}`}>
                                {tool.available_qty}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      )}
    </div>
  );
};

export default MechanicDashboard;