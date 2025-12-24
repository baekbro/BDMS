// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Kiosk from './pages/Kiosk';
import Login from './pages/Login'; // [추가]
import Admin from './pages/Admin';
import MemberList from './pages/MemberList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/kiosk" element={<Kiosk />} />
        
        {/* /admin 접속 시 로그인 화면으로 */}
        <Route path="/admin" element={<Login />} />
        
        {/* 로그인 성공 후 가는 곳 */}
        <Route path="/admin/dashboard" element={<Admin />} />

        <Route path="/members" element={<MemberList />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;