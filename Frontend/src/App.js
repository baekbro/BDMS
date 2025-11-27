import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Main from './Pages/main'; 
import Login from './Pages/login';
import Signup from './Pages/signup';

function App() {
  return (
    <div className="App">
      <Routes>
      
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
      </Routes>
    </div>
  );
}

export default App;