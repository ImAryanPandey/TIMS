import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login.jsx';
import AdminDashboard from './Pages/AdminDashboard.jsx';
import MechanicDashboard from './Pages/MechanicDashboard.jsx'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default Route: Login */}
        <Route path="/" element={<Login />} />
        
        {/* Protected Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/mechanic" element={<MechanicDashboard />} />
        
        {/* Catch all: Redirect to Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;