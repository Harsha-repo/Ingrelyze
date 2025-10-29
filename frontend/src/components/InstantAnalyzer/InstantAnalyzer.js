import React, { useState, useRef } from 'react';
import { Form, Button, Row, Col, Table } from 'react-bootstrap';
import '../styles.css';

const InstantAnalyzer = () => {
    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [frontAnalysis, setFrontAnalysis] = useState(null);
    const [backAnalysis, setBackAnalysis] = useState(null);
    const [finalAnalysis, setFinalAnalysis] = useState(null);
    const [loadingFront, setLoadingFront] = useState(false);
    const [loadingBack, setLoadingBack] = useState(false);
    const [loadingFinal, setLoadingFinal] = useState(false);
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
        // Check if running on HTTPS or localhost
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
            alert('Camera access requires HTTPS or localhost. Please run the app on localhost or over HTTPS.');
            return;
        }

        // Check if mediaDevices is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Camera not supported on this device or browser.');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });

            // Wait a bit for refs to be ready and check again
            await new Promise(resolve => setTimeout(resolve, 100));

            // Check if video refs are available
            if (type === 'front' && frontVideoRef.current) {
                frontVideoRef.current.srcObject = stream;
                setCapturingFront(true);
            } else if (type === 'back' && backVideoRef.current) {
                backVideoRef.current.srcObject = stream;
                setCapturingBack(true);
            } else {
                alert('Video element not ready. Please try again.');
                stream.getTracks().forEach(track => track.stop());
            }
        } catch (error) {
            console.error('Error accessing camera:', error);
            if (error.name === 'NotAllowedError') {
                alert('Camera access denied. Please allow camera permissions in your browser.');
            } else if (error.name === 'NotFoundError') {
                alert('No camera found on this device.');
            } else if (error.name === 'NotSupportedError') {
                alert('Camera not supported on this browser.');
            } else {
                alert('Camera access denied or not available. Error: ' + error.message);
            }
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

    const handleAnalyzeFront = async () => {
        if (!frontImage) return;
        setLoadingFront(true);
        
        // Clear previous analyses when analyzing a new front image
        setFrontAnalysis(null);
        setBackAnalysis(null);
        setFinalAnalysis(null);
       

        try {
            const formData = new FormData();
            formData.append('file', frontImage);

            const response = await fetch('http://localhost:5678/webhook/instant-analysis', {
                method: 'POST',
                body: formData,
                mode: 'cors',
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (response.ok) {
                const data = await response.json();
                console.log('Parsed data:', data);
                const output = Array.isArray(data) ? data[0].output : data;
                console.log('Extracted output:', output);
                // The data is nested under "output" key, so extract it
                const finalOutput = output.output || output;
                console.log('Final output:', finalOutput);
                setFrontAnalysis(finalOutput);
                console.log('Front analysis state set');
            } else {
                console.error('Front analysis failed:', response.status, response.statusText);
                alert(`Front analysis failed: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error analyzing front image:', error);
            alert(`Error analyzing front image: ${error.message}`);
        } finally {
            setLoadingFront(false);
        }
    };

    const handleAnalyzeBack = async () => {
        if (!backImage || !frontAnalysis) return;
        setLoadingBack(true);

        try {
            const formData = new FormData();
            formData.append('file', backImage);
            // Include product name from front analysis
            if (frontAnalysis.product_name) {
                formData.append('product_name', frontAnalysis.product_name);
            }

            const response = await fetch('http://localhost:5678/webhook/analysis1', {
                method: 'POST',
                body: formData,
                mode: 'cors',
            });

            console.log('Back Response status:', response.status);
            console.log('Back Response headers:', response.headers);

            if (response.ok) {
                const data = await response.json();
                console.log('Back Parsed data:', data);
                const output = Array.isArray(data) ? data[0].output : data;
                console.log('Back Extracted output:', output);
                // The data is nested under "output" key, so extract it
                let finalOutput = output.output || output;
                console.log('Back Final output:', finalOutput);

                // Normalize the keys to match expected structure
                if (finalOutput) {
                    if (finalOutput.Ingredients) {
                        finalOutput.ingredients = finalOutput.Ingredients;
                        delete finalOutput.Ingredients;
                    }
                    if (finalOutput['Nutrition-facts']) {
                        finalOutput.nutrition_facts = finalOutput['Nutrition-facts'];
                        delete finalOutput['Nutrition-facts'];
                    }
                    if (finalOutput.__isEmpty !== undefined) {
                        delete finalOutput.__isEmpty;
                    }
                }

                setBackAnalysis(finalOutput);
                console.log('Back analysis state set');
            } else {
                console.error('Back analysis failed:', response.status, response.statusText);
                alert(`Back analysis failed: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error analyzing back image:', error);
            alert(`Error analyzing back image: ${error.message}`);
        } finally {
            setLoadingBack(false);
        }
    };

    const handleFinalAnalysis = async () => {
        if (!frontAnalysis || !backAnalysis) return;
        setLoadingFinal(true);

        try {
            const formData = new FormData();
            // Include product name from front analysis
            if (frontAnalysis.product_name) {
                formData.append('product_name', frontAnalysis.product_name);
            }

            const response = await fetch('http://localhost:5678/webhook/final-analysis', {
                method: 'POST',
                body: formData,
                mode: 'cors',
            });

            console.log('Final Analysis Response status:', response.status);
            console.log('Final Analysis Response headers:', response.headers);

            if (response.ok) {
                const data = await response.json();
                console.log('Final Analysis Parsed data:', data);
                const output = Array.isArray(data) ? data[0].output : data;
                console.log('Final Analysis Extracted output:', output);
                // The data is nested under "output" key, so extract it
                const finalOutput = output.output || output;
                console.log('Final Analysis Final output:', finalOutput);
                setFinalAnalysis(finalOutput);
                console.log('Final analysis state set');
            } else {
                console.error('Final analysis failed:', response.status, response.statusText);
                alert(`Final analysis failed: ${response.status} ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error in final analysis:', error);
            alert(`Error in final analysis: ${error.message}`);
        } finally {
            setLoadingFinal(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content text-center">
                <h1 className="display-4 mb-3 dashboard-header">Photo Capture Analyzer</h1>
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
                    <Row className="mb-4">
                        <Col md={6}>
                            <Button
                                className="lookup-button"
                                onClick={handleAnalyzeFront}
                                disabled={!frontImage || loadingFront}
                                block
                            >
                                {loadingFront ? 'Getting Front Details...' : 'Front of Pack Details'}
                            </Button>
                        </Col>
                        <Col md={6}>
                            <Button
                                className="lookup-button"
                                onClick={handleAnalyzeBack}
                                disabled={!backImage || loadingBack}
                                block
                            >
                                {loadingBack ? 'Getting Back Details...' : 'Back of Pack Details'}
                            </Button>
                        </Col>
                    </Row>

                </div>

                {/* Front and Back Details Cards Stacked */}
                {frontAnalysis && (
                    <div className="mt-4 glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <div className="card-body">
                            <h3 className="card-title">Front of Pack Details</h3>
                            <div className="product-header mb-4">
                                <h4 className="product-name">{frontAnalysis.product_name || 'N/A'}</h4>
                                <p className="product-brand">by {frontAnalysis.brand || 'N/A'}</p>
                            </div>
                            <h5>Product Description</h5>
                            <p className="mb-3">{frontAnalysis.product_description || 'N/A'}</p>
                            <h5>Quantity</h5>
                            <p className="mb-3">{frontAnalysis.quantity || 'N/A'}</p>
                        </div>
                    </div>
                )}

                {backAnalysis && (
                    <div className="mt-4 glass-card" style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <div className="card-body">
                            <h3 className="card-title">Back of Pack Details</h3>
                            <h5>Product Name</h5>
                            <p className="mb-3">{backAnalysis.product_name || 'N/A'}</p>
                            <h5>Ingredients</h5>
                            <div className="tags-container mb-3">
                                {backAnalysis.ingredients && backAnalysis.ingredients.map((ing, idx) => (
                                    <span key={idx} className="tag ingredient-tag">{ing}</span>
                                ))}
                            </div>
                            <h5>Nutrition Facts</h5>
                            <div className="mb-3">
                                {backAnalysis.nutrition_facts && (
                                    <>
                                        <p><strong>Serving Size:</strong> {backAnalysis.nutrition_facts.serving_size || 'N/A'}</p>
                                        <p><strong>Servings Per Container:</strong> {backAnalysis.nutrition_facts.servings_per_container || 'N/A'}</p>
                                        <p><strong>Calories:</strong> {backAnalysis.nutrition_facts.calories || 'N/A'}</p>
                                        <p><strong>Calories from Fat:</strong> {backAnalysis.nutrition_facts.calories_from_fat || 'N/A'}</p>
                                        <p><strong>Daily Value Basis:</strong> {backAnalysis.nutrition_facts.daily_value_basis || 'N/A'}</p>
                                    </>
                                )}
                            </div>
                            <h6>Nutrients</h6>
                            <div className="table-responsive mb-3">
                                <Table striped bordered hover size="sm" variant="dark">
                                    <thead>
                                        <tr>
                                            <th>Nutrient</th>
                                            <th>Amount</th>
                                            <th>% Daily Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {backAnalysis.nutrition_facts && backAnalysis.nutrition_facts.nutrients && Object.entries(backAnalysis.nutrition_facts.nutrients).map(([key, value]) => {
                                            if (key === 'vitamins_and_minerals') {
                                                return Object.entries(value).map(([vit, percent]) => (
                                                    <tr key={`${key}-${vit}`}>
                                                        <td>{vit.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                                                        <td>N/A</td>
                                                        <td>{percent}</td>
                                                    </tr>
                                                ));
                                            }
                                            return (
                                                <tr key={key}>
                                                    <td>{key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</td>
                                                    <td>{typeof value === 'object' ? (value.amount || 'N/A') : value}</td>
                                                    <td>{typeof value === 'object' ? (value.daily_value_percent || 'N/A') : 'N/A'}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Final Analysis Button - only show when both analyses are complete */}
                {frontAnalysis && backAnalysis && (
                    <div className="mt-4 d-grid" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <Button
                            className="lookup-button"
                            onClick={handleFinalAnalysis}
                            disabled={loadingFinal}
                            size="lg"
                        >
                            {loadingFinal ? 'Analyzing Product...' : 'Analyze Product'}
                        </Button>
                    </div>
                )}

                {/* Final Analysis Report Card */}
                {finalAnalysis && (
                    <div className="mt-4 glass-card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <div className="card-body">
                            <h3 className="card-title">Product Analysis Report</h3>

                            {/* Product Information */}
                            <div className="final-analysis-section">
                                <h5>Product Information</h5>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p><strong>Product Name:</strong> {finalAnalysis.Product_name || 'N/A'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <p><strong>Brand:</strong> {finalAnalysis.Brand || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Summary */}
                            <div className="final-analysis-section">
                                <h5>Summary</h5>
                                <p>{finalAnalysis.Summary || 'N/A'}</p>
                            </div>

                            {/* Highlights */}
                            {finalAnalysis.Highlights && (
                                <div className="final-analysis-section">
                                    <h5>Highlights</h5>
                                    <div className="row">
                                        <div className="col-md-4">
                                            <p><strong>Calories per Serving:</strong> {finalAnalysis.Highlights.Calories_per_serving || 'N/A'}</p>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <h6>Main Concerns</h6>
                                        <div className="tags-container">
                                            {finalAnalysis.Highlights.Main_Concerns && finalAnalysis.Highlights.Main_Concerns.map((concern, idx) => (
                                                <span key={idx} className="tag concern-tag">{concern}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <h6>Positives</h6>
                                        <div className="tags-container">
                                            {finalAnalysis.Highlights.Positives && finalAnalysis.Highlights.Positives.map((positive, idx) => (
                                                <span key={idx} className="tag positive-tag">{positive}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* AI Health Assessment */}
                            {finalAnalysis.AI_Health_Assessment && (
                                <div className="final-analysis-section">
                                    <h5>AI Health Assessment</h5>
                                    <div className="health-rating-display">
                                        <div className="health-rating-value">{finalAnalysis.AI_Health_Assessment.Health_Rating || 'N/A'}/10</div>
                                        <p><strong>Category:</strong> {finalAnalysis.AI_Health_Assessment.Category || 'N/A'}</p>
                                    </div>
                                    <div className="mt-3">
                                        <h6>Recommendation</h6>
                                        <p>{finalAnalysis.AI_Health_Assessment.Recommendation || 'N/A'}</p>
                                    </div>
                                </div>
                            )}
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
