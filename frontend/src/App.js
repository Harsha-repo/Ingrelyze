import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Authentications/Login';
import Register from './components/Authentications/Register';
import BarcodeScanner from './components/BarcodeScanner';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import Ingrelyze from './components/Ingrelyze/Ingrelyze';
import InstantAnalyzer from './components/InstantAnalyzer/InstantAnalyzer';
import NewAddOn from './components/NewAddOn/NewAddOn';
import ChatBot from './components/ChatBot/ChatBot';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <Ingrelyze />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ingrelyze"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <BarcodeScanner />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/instant-analyzer"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <InstantAnalyzer />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-addon"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <NewAddOn />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <ChatBot />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;