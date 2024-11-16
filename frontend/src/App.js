import logo from './logo.svg';
import './App.css';
import ContactManagement from './components/ContactManagement';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ContactManagement />} />
      </Routes>
    </>
  );
}

export default App;