import './App.css';
import { Route, Routes } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import AdminDashboard from './components/Admin/AdminDashboard';
import UserDashboard from './components/User/UserDashboard';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ToggleButton from './components/ToggleButton';
import { useSelector } from 'react-redux';

function App() {
  const mode = useSelector(state => state.theme.mode)
  return (
    <div className={mode === 'light' ? 'bg-white text-black h-screen' : 'bg-black text-white h-screen'}>
      <ToastContainer />
      <ToggleButton />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Login />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/user/dashboard' element={<UserDashboard />} />
      </Routes>
    </div>
  );
}

export default App;