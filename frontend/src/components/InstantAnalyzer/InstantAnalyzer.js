import React, { useState, useRef } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import '../styles.css';

const InstantAnalyzer = () => {
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [capturingFront, setCapturingFront] = useState(false);
    const [capturingBack, setCapturingBack] = useState(false);
    const frontVideoRef = useRef(null);
    const backVideoRef = useRef(null);
    const frontCanvasRef = useRef(null);
    const backCanvasRef = useRef(null);

    const handleImageChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'front') setFrontImage(file);
            else setBackImage(file);
        }
    };

    const startCamera = async (type) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (type === 'front') {
                frontVideoRef.current.srcObject = stream;
                setCapturingFront(true);
            } else {
                backVideoRef.current.srcObject = stream;
                setCapturingBack(true);
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Camera access denied or not available');
        }
    };

    const captureImage = (type) => {
        const video = type === 'front' ? frontVideoRef.current : backVideoRef.current;
        const canvas = type === 'front' ? frontCanvasRef.current : backCanvasRef.current;

        if (video && canvas) {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                const file = new File([blob], `${type}_pack.jpg`, { type: 'image/jpeg' });
                if (type === 'front') {
                    setFrontImage(file);
                    setCapturingFront(false);
                } else {
                    setBackImage(file);
                    setCapturingBack(false);
                }
                // Stop camera stream
                const stream = video.srcObject;
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
            }, 'image/jpeg');
        }
    };

    const closeCamera = (type) => {
        if (type === 'front') {
            setCapturingFront(false);
        } else {
            setCapturingBack(false);
        }
        const video = type === 'front' ? frontVideoRef.current : backVideoRef.current;
        if (video && video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const handleAnalyze = async () => {
        if (!frontImage || !backImage) return;
        setLoading(true);
        // Mock analysis - in real app, this would process images via OCR/API
        setTimeout(() => {
            setAnalysis({
                product_name: 'Mock Product Name',
                brand: 'Mock Brand',
                ingredients: ['sugar', 'salt', 'wheat flour', 'palm oil'],
                nutrients: { energy: '400kcal', fat: '10g', carbs: '60g', protein: '5g' },
                benefits: ['High in vitamins', 'Good source of fiber'],
                risks: ['May contain allergens', 'High sodium content'],
                health_rating: 'Moderate - 6/10'
            });
            setLoading(false);
        }, 3000);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content text-center">
                <h1 className="display-4 mb-3 dashboard-header">Instant Analyzer</h1>
                <p className="lead text-secondary mb-5">Upload front and back pack images for instant analysis.</p>

                <div className="glass-card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                    <Row className="mb-4">
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Front of Pack Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, 'front')}
                                    className="form-control-glass"
                                />
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => startCamera('front')}
                                    className="mt-2"
                                >
                                    📷 Take Photo
                                </Button>
                                <small className="text-secondary d-block mt-1">Upload image or take photo to extract product name and brand</small>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Back of Pack Image</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleImageChange(e, 'back')}
                                    className="form-control-glass"
                                />
                                <Button
                                    variant="outline-secondary"
                                    size="sm"
                                    onClick={() => startCamera('back')}
                                    className="mt-2"
                                >
                                    📷 Take Photo
                                </Button>
                                <small className="text-secondary d-block mt-1">Upload image or take photo to extract ingredients and nutrition facts</small>
                            </Form.Group>
                        </Col>
                    </Row>
                    <div className="d-grid">
                        <Button
                            className="lookup-button"
                            onClick={handleAnalyze}
                            disabled={!frontImage || !backImage || loading}
                        >
                            {loading ? 'Analyzing...' : 'Analyze Product'}
                        </Button>
                    </div>
                </div>

                {analysis && (
                    <div className="mt-4 glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="card-body">
                            <h3 className="card-title">Analysis Report</h3>
                            <div className="product-header mb-4">
                                <h4 className="product-name">{analysis.product_name}</h4>
                                <p className="product-brand">by {analysis.brand}</p>
                            </div>
                            <h5>Ingredients</h5>
                            <div className="tags-container mb-3">
                                {analysis.ingredients.map((ing, idx) => (
                                    <span key={idx} className="tag ingredient-tag">{ing}</span>
                                ))}
                            </div>
                            <h5>Nutritional Information</h5>
                            <div className="nutrients-grid mb-3">
                                {Object.entries(analysis.nutrients).map(([key, value]) => (
                                    <div key={key} className="nutrient-item">
                                        <span className="nutrient-label">{key.replace(/_/g, ' ')}</span>
                                        <span className="nutrient-value">{value}</span>
                                    </div>
                                ))}
                            </div>
                            <h5>Benefits</h5>
                            <ul className="text-start mb-3">
                                {analysis.benefits.map((benefit, idx) => (
                                    <li key={idx}>{benefit}</li>
                                ))}
                            </ul>
                            <h5>Risks</h5>
                            <ul className="text-start mb-3">
                                {analysis.risks.map((risk, idx) => (
                                    <li key={risk}>{risk}</li>
                                ))}
                            </ul>
                            <h5>Health Rating</h5>
                            <p className="health-rating">{analysis.health_rating}</p>
                        </div>
                    </div>
                )}

                {/* Camera Modal for Front Image */}
                {capturingFront && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }}>
                        <div style={{ position: 'relative', width: '90%', maxWidth: '500px' }}>
                            <video
                                ref={frontVideoRef}
                                autoPlay
                                playsInline
                                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                            />
                            <canvas ref={frontCanvasRef} style={{ display: 'none' }} />
                            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
                                <Button variant="success" onClick={() => captureImage('front')}>
                                    📸 Capture
                                </Button>
                                <Button variant="danger" onClick={() => closeCamera('front')}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Camera Modal for Back Image */}
                {capturingBack && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1050 }}>
                        <div style={{ position: 'relative', width: '90%', maxWidth: '500px' }}>
                            <video
                                ref={backVideoRef}
                                autoPlay
                                playsInline
                                style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                            />
                            <canvas ref={backCanvasRef} style={{ display: 'none' }} />
                            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px' }}>
                                <Button variant="success" onClick={() => captureImage('back')}>
                                    📸 Capture
                                </Button>
                                <Button variant="danger" onClick={() => closeCamera('back')}>
                                    Close
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstantAnalyzer;
