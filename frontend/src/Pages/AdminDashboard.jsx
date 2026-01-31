import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('mechanic');
    const [message, setMessage] = useState('');
    
    // Data States
    const [tools, setTools] = useState([]);
    const [report, setReport] = useState([]);
    const [refresh, setRefresh] = useState(false); // Trigger to reload data

    // Form States
    const [mechForm, setMechForm] = useState({ name: '', email: '', mobile: '', password: '', level: 'New Recruit', picture: '' });
    const [toolForm, setToolForm] = useState({ title: '', category: '', total_qty: 0, image: '' });
    const [issueForm, setIssueForm] = useState({ mechanic_id: '', tool_id: '', qty_issued: 1 });

    // Initial Load & Data Fetching
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('userInfo'));
        if (!user || user.role !== 'Admin') {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            try {
                const toolRes = await API.get('/tools');
                setTools(toolRes.data);

                const reportRes = await API.get('/issues/report');
                setReport(reportRes.data);
            } catch (error) {
                console.error("Error loading data", error);
            }
        };

        fetchData();
    }, [navigate, refresh]); // Re-runs whenever 'refresh' changes

    // --- HANDLERS ---

    const handleCreateMechanic = async (e) => {
        e.preventDefault();
        try {
            await API.post('/auth/register-mechanic', mechForm);
            setMessage('✅ Mechanic Created Successfully!');
            setMechForm({ name: '', email: '', mobile: '', password: '', level: 'New Recruit', picture: '' });
        } catch (err) {
            setMessage(`❌ Error: ${err.response?.data?.message || 'Failed'}`);
        }
    };

    const handleAddTool = async (e) => {
        e.preventDefault();
        try {
            await API.post('/tools', toolForm);
            setMessage('✅ Tool Added!');
            setToolForm({ title: '', category: '', total_qty: 0, image: '' });
            setRefresh(!refresh); // Trigger Reload
        } catch (err) {
            setMessage(`❌ Error: ${err.response?.data?.message || 'Failed'}`);
        }
    };

    const handleIssueTool = async (e) => {
        e.preventDefault();
        try {
            await API.post('/issues', issueForm);
            setMessage('✅ Tool Issued!');
            setIssueForm({ mechanic_id: '', tool_id: '', qty_issued: 1 });
            setRefresh(!refresh); // Trigger Reload
        } catch (err) {
            setMessage(`❌ Error: ${err.response?.data?.message || 'Failed'}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <button onClick={() => { localStorage.clear(); navigate('/'); }} className="text-red-500 font-bold">Logout</button>
            </div>

            {message && <div className="mb-4 p-3 rounded bg-blue-100 text-blue-800 border border-blue-200">{message}</div>}

            {/* TABS */}
            <div className="mb-6 flex space-x-4 border-b border-gray-200 bg-white p-2 rounded shadow-sm">
                {['mechanic', 'tools', 'issue', 'report'].map(tab => (
                    <button 
                        key={tab}
                        onClick={() => { setActiveTab(tab); setMessage(''); }}
                        className={`px-4 py-2 font-medium capitalize ${activeTab === tab ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}
                    >
                        {tab === 'mechanic' ? 'Create Mechanic' : tab === 'issue' ? 'Issue Tools' : tab}
                    </button>
                ))}
            </div>

            <div className="bg-white p-6 rounded shadow-lg max-w-4xl mx-auto">
                
                {/* 1. CREATE MECHANIC */}
                {activeTab === 'mechanic' && (
                    <form onSubmit={handleCreateMechanic} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="border p-2 rounded" placeholder="Name" required onChange={e => setMechForm({...mechForm, name: e.target.value})} value={mechForm.name} />
                        <input className="border p-2 rounded" placeholder="Email" type="email" required onChange={e => setMechForm({...mechForm, email: e.target.value})} value={mechForm.email} />
                        <input className="border p-2 rounded" placeholder="Mobile" maxLength={10} required onChange={e => setMechForm({...mechForm, mobile: e.target.value})} value={mechForm.mobile} />
                        <input className="border p-2 rounded" placeholder="Password (Alpha + Special)" type="password" required onChange={e => setMechForm({...mechForm, password: e.target.value})} value={mechForm.password} />
                        
                        <select className="border p-2 rounded" onChange={e => setMechForm({...mechForm, level: e.target.value})} value={mechForm.level}>
                            {['Expert', 'Medium', 'New Recruit', 'Trainee'].map(l => <option key={l}>{l}</option>)}
                        </select>
                        <input className="border p-2 rounded" placeholder="Picture URL" onChange={e => setMechForm({...mechForm, picture: e.target.value})} value={mechForm.picture} />
                        
                        <button className="col-span-2 bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Create Mechanic</button>
                    </form>
                )}

                {/* 2. ADD TOOLS */}
                {activeTab === 'tools' && (
                    <form onSubmit={handleAddTool} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="border p-2 rounded" placeholder="Title" required onChange={e => setToolForm({...toolForm, title: e.target.value})} value={toolForm.title} />
                        <input className="border p-2 rounded" placeholder="Category" required onChange={e => setToolForm({...toolForm, category: e.target.value})} value={toolForm.category} />
                        <input className="border p-2 rounded" placeholder="Total Qty" type="number" required onChange={e => setToolForm({...toolForm, total_qty: e.target.value})} value={toolForm.total_qty} />
                        <input className="border p-2 rounded" placeholder="Image URL" onChange={e => setToolForm({...toolForm, image: e.target.value})} value={toolForm.image} />
                        
                        <button className="col-span-2 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">Add Tool</button>
                    </form>
                )}

                {/* 3. ISSUE TOOLS */}
                {activeTab === 'issue' && (
                    <form onSubmit={handleIssueTool} className="space-y-4">
                        <div className="p-2 bg-gray-100 text-xs text-gray-600">
                           Manually enter Mechanic ID (Copy from DB/Console).
                        </div>
                        
                        <input className="w-full border p-2 rounded" placeholder="Mechanic User ID" required onChange={e => setIssueForm({...issueForm, mechanic_id: e.target.value})} value={issueForm.mechanic_id} />

                        <select className="w-full border p-2 rounded" required onChange={e => setIssueForm({...issueForm, tool_id: e.target.value})} value={issueForm.tool_id}>
                            <option value="">-- Select Tool --</option>
                            {tools.map(t => (
                                <option key={t._id} value={t._id} disabled={t.available_qty <= 0}>
                                    {t.title} (Available: {t.available_qty})
                                </option>
                            ))}
                        </select>

                        <input className="w-full border p-2 rounded" placeholder="Quantity" type="number" min="1" required onChange={e => setIssueForm({...issueForm, qty_issued: e.target.value})} value={issueForm.qty_issued} />

                        <button className="w-full bg-purple-600 text-white py-2 rounded font-bold hover:bg-purple-700">Issue Tool</button>
                    </form>
                )}

                {/* 4. REPORTS */}
                {activeTab === 'report' && (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="p-2">Name</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Total Issued</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map((row, idx) => (
                                <tr key={idx} className="border-b">
                                    <td className="p-2">{row.name}</td>
                                    <td className="p-2">{row.email}</td>
                                    <td className="p-2 font-bold">{row.totalIssued}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;