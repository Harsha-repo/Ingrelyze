import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/styles.css';
import BarcodeScanner from './components/BarcodeScanner';
import { BrowserRouter , Route, Routes } from 'react-router-dom';
import Login from './components/Authentications/Login';
import Register from './components/Authentications/Register';

function App() {
  return (

    <div className="App container mt-5">

      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Login />} />
          <Route path='/Register' element={<Register />} />
          <Route path="/Dashboard-Ingrelyze" element={ <BarcodeScanner />} />
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
