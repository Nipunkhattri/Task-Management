import './App.css';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import UserDashboard from './components/User/UserDashboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Login />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/user/dashboard' element={<UserDashboard />} />
      </Routes>
    </>
  );
}

export default App;