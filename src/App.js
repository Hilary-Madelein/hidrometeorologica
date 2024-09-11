import React from 'react';
import './App.css';
import Principal from './fragments/Principal';
import { Navigate, Route, Routes } from 'react-router-dom';
import './css/Global.css';
import Graficas from './fragments/Graficas';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/principal/monitorizacion' element={<Principal />} />
        <Route path='/grafica' element={<Graficas/>} />
        <Route path='*' element={<Navigate to='/principal/monitorizacion' />} />
      </Routes>
    </div>
  );
}

export default App;
