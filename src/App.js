import React from 'react';
import './App.css';
import Principal from './fragments/Principal';
import { Navigate, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/principal/monitorizacion' element={<Principal />} />
        <Route path='*' element={<Navigate to='/principal/monitorizacion' />} />
      </Routes>
    </div>
  );
}

export default App;
