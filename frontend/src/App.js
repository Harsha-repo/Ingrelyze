import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/styles.css';
import BarcodeScanner from './components/BarcodeScanner';

function App() {
  return (
    <div className="App container mt-5">
      <h1 className="text-center mb-4">Product Barcode Scanner</h1>
      <BarcodeScanner />
    </div>
  );
}

export default App;
