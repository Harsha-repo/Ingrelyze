import React, { useState } from 'react';
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
  const [currentPage, setCurrentPage] = useState('/dashboard');

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout onPageChange={handlePageChange}>
                <Ingrelyze />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/ingrelyze"
          element={
            <ProtectedRoute>
              <DashboardLayout onPageChange={handlePageChange}>
                <BarcodeScanner />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/instant-analyzer"
          element={
            <ProtectedRoute>
              <DashboardLayout onPageChange={handlePageChange}>
                <InstantAnalyzer />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-addon"
          element={
            <ProtectedRoute>
              <DashboardLayout onPageChange={handlePageChange}>
                <NewAddOn />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatbot"
          element={
            <ProtectedRoute>
              <DashboardLayout onPageChange={handlePageChange}>
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