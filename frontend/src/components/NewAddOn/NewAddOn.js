import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import '../styles.css';

const NewAddOn = () => {
    const [productName, setProductName] = useState('');
    const [ingredients, setIngredients] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productName.trim() || !ingredients.trim()) return;
        setLoading(true);
        // Mock submission - in real app, this would call an API
        setTimeout(() => {
            setMessage('Product added successfully!');
            setProductName('');
            setIngredients('');
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content text-center">
                <h1 className="display-4 mb-3 dashboard-header">Add New Product</h1>
                <p className="lead text-secondary mb-5">Contribute to our database by adding new products.</p>

                <div className="glass-card" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Enter product name"
                                className="form-control-glass"
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ingredients (comma-separated)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                placeholder="e.g., sugar, salt, wheat flour, palm oil"
                                className="form-control-glass"
                                required
                            />
                        </Form.Group>
                        <div className="d-grid">
                            <Button
                                className="lookup-button"
                                type="submit"
                                disabled={!productName.trim() || !ingredients.trim() || loading}
                            >
                                {loading ? 'Adding...' : 'Add Product'}
                            </Button>
                        </div>
                    </Form>
                </div>

                {message && (
                    <Alert variant="success" className="mt-4" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        {message}
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default NewAddOn;
