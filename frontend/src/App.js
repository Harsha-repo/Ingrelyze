import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Authentications/Login';
import Register from './components/Authentications/Register';
import BarcodeScanner from './components/BarcodeScanner';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/Dashboard-Ingrelyze"
            element={
              <ProtectedRoute>
                <BarcodeScanner />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;