import React, { useState } from 'react';
import { Form, Button, InputGroup, Row, Col } from 'react-bootstrap';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import ProductDisplay from './ProductDisplay';

const BarcodeScanner = () => {
  const [barcode, setBarcode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScan = (err, result) => {
    if (result) {
      setBarcode(result.text);
      setScanning(false);
    }
  };

  const startScan = () => {
    setScanning(true);
  };

  const handleInputChange = (e) => {
    setBarcode(e.target.value);
  };

  const handleLookup = async () => {

    if (!barcode) return;
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/database_webhook/barcode-lookup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcode }),
      });
      const data = await response.json();
      setResult(data);
    } 
    catch (error) {
      console.error('Error:', error);
      setResult({ error: 'Failed to lookup barcode' });
    }finally {
      setLoading(false);  
    }
  };



  // Store the barcode in a variable for routing to backend
  // Routed via handleLookup function to Django API

  return (
    <Row className="justify-content-center">
      <Col md={8}>
        <InputGroup className="mb-3">
          <Form.Control
            type="text"
            value={barcode}
            onChange={handleInputChange}
            placeholder="Enter or scan barcode"
          />
          <Button variant="outline-secondary" onClick={startScan}>
            📷
          </Button>
        </InputGroup>
        <Button variant="primary" onClick={handleLookup} disabled={!barcode}>
          Lookup Barcode
          {loading && <span className="spinner-border spinner-border-sm ms-2" role="status" aria-hidden="true"></span>}
        </Button>
        <ProductDisplay result={result} />
        {scanning && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }}>
            <div style={{ position: 'relative' }}>
              <BarcodeScannerComponent
                width={500}
                height={500}
                onUpdate={handleScan}
              />
              <Button variant="danger" onClick={() => setScanning(false)} style={{ position: 'absolute', top: '10px', right: '10px' }}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default BarcodeScanner;
