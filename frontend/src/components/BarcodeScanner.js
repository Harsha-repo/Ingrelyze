import React, { useState } from 'react';
import { Form, Button, InputGroup, Row, Col } from 'react-bootstrap';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import ProductDisplay from './ProductDisplay';
import { lookupBarcode } from './productApi.js';
import './styles.css';



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
      const data = await lookupBarcode(barcode);
      setResult(data);
    } 
    catch (error) {
      console.error('Error:', error);
      setResult({ error: error.detail || 'Failed to lookup barcode' });
    }finally {
      setLoading(false);  
    }
  };

  // Store the barcode in a variable for routing to backend
  // Routed via handleLookup function to Django API

  return (
    <div className="dashboard-container">
      <div className="dashboard-content text-center">
        <h1 className="display-4 mb-3 dashboard-header">Ingrelyze</h1>
        <p className="lead text-secondary mb-5">Analyze food products by scanning their barcode.</p>

        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <InputGroup className="mb-3 shadow-lg" size="lg">
              <Form.Control
                type="text"
                className="form-control-glass" 
                value={barcode}
                onChange={handleInputChange}
                placeholder="Enter or scan barcode"
              />
              <Button variant="outline-secondary" onClick={startScan} className="scan-button border-secondary">
                📷
              </Button>
            </InputGroup>
            <div className="d-grid">
              <Button className="lookup-button" onClick={handleLookup} disabled={!barcode || loading}>
                {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Lookup Barcode'}
              </Button>
            </div>
            <ProductDisplay result={result} />
            {scanning && (
              <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }}>
                <div style={{ position: 'relative', width: '80%', maxWidth: '500px' }}>
                  <BarcodeScannerComponent
                    width="100%"
                    height="100%"
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
      </div>
    </div>
  );
};

export default BarcodeScanner;
