import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import { Button } from './components/ui/button';

// Import your page components from src/components/pages
import VerifierDashboard from './components/pages/verifierDashboard';
import UserDashboard from './components/pages/userDashboard';
import LoanApplicationForm from './components/pages/LoanApplicationForm';
import AdminDashboard from './components/pages/adminDashboard';
import Login from './components/pages/Login';
import Navbar from './components/pages/navbar';


function App() {
  const token = localStorage.getItem('token');
  return (
    <>
      


      {/* Define Routes */}
      {token && <Navbar/>}
      <Routes>
        <Route path='/login' element = {token? <UserDashboard/> :<Login />}/>
        <Route path="/verifier" element={!token ? <Login/> : <VerifierDashboard />} />
        <Route path="/user" element={!token ? <Login/> : <UserDashboard />} />
        <Route path="/loan-application" element={!token ? <Login/> : <LoanApplicationForm />} />
        <Route path="/admin" element={!token ? <Login/> : <AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
