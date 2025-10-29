import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { addNewProduct } from '../productApi';
import '../styles.css';

// for webhoook of this feature check out productapi.js abs
// webhook is : 'http://localhost:5678/webhook-test/manual-insertion'


const NewAddOn = () => {
    const [formData, setFormData] = useState({
        code: '',
        product_name: '',
        brands: '',
        quantity: '',
        ingredients: '',
        nutriments: {},
        categories: '',
        date_and_time: null
    });
    const [nutrimentFields, setNutrimentFields] = useState([{ key: '', value: '' }]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addNutrimentField = () => {
        setNutrimentFields(prev => [...prev, { key: '', value: '' }]);
    };

    const updateNutrimentField = (index, field, value) => {
        setNutrimentFields(prev => prev.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        ));
    };

    const removeNutrimentField = (index) => {
        setNutrimentFields(prev => prev.filter((_, i) => i !== index));
    };

    const buildNutrimentsObject = () => {
        const nutriments = {};
        nutrimentFields.forEach(field => {
            if (field.key.trim() && field.value.trim()) {
                nutriments[field.key.trim()] = field.value.trim();
            }
        });
        return nutriments;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Basic validation
        if (!formData.code || !formData.product_name) {
            setMessage('Code and Product Name are required!');
            return;
        }
        setLoading(true);
        try {
            // Build nutriments object from fields and convert to JSON string for submission
            const nutrimentsObject = buildNutrimentsObject();
            const submitData = {
                ...formData,
                nutriments: JSON.stringify(nutrimentsObject)
            };
            await addNewProduct(submitData);
            setMessage('Product added successfully!');
            setFormData({
                code: '',
                product_name: '',
                brands: '',
                quantity: '',
                ingredients: '',
                nutriments: {},
                categories: '',
                date_and_time: null
            });
            setNutrimentFields([{ key: '', value: '' }]);
        } catch (error) {
            console.error('Error adding product:', error);
            setMessage('Failed to add product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <div className="dashboard-content text-center">
                <h1 className="display-4 mb-3 dashboard-header">Add New Product</h1>
                <p className="lead text-secondary mb-5">Contribute to our database by adding new products.</p>

                <div className="glass-card" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Code (Barcode)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        placeholder="Enter barcode"
                                        className="form-control-glass"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="product_name"
                                        value={formData.product_name}
                                        onChange={handleInputChange}
                                        placeholder="Enter product name"
                                        className="form-control-glass"
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Brands</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="brands"
                                        value={formData.brands}
                                        onChange={handleInputChange}
                                        placeholder="Enter brands"
                                        className="form-control-glass"
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Quantity</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 73g"
                                        className="form-control-glass"
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Ingredients</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="ingredients"
                                value={formData.ingredients}
                                onChange={handleInputChange}
                                placeholder="Enter ingredients"
                                className="form-control-glass"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Categories</Form.Label>
                            <Form.Control
                                type="text"
                                name="categories"
                                value={formData.categories}
                                onChange={handleInputChange}
                                placeholder="Enter categories"
                                className="form-control-glass"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nutriments (Key-Value Pairs)</Form.Label>
                            {nutrimentFields.map((field, index) => (
                                <Row key={index} className="mb-2">
                                    <Col md={4}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Nutrient name"
                                            value={field.key}
                                            onChange={(e) => updateNutrimentField(index, 'key', e.target.value)}
                                            className="form-control-glass"
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <Form.Control
                                            type="text"
                                            placeholder="Value"
                                            value={field.value}
                                            onChange={(e) => updateNutrimentField(index, 'value', e.target.value)}
                                            className="form-control-glass"
                                        />
                                    </Col>
                                    <Col md={4}>
                                        {index === nutrimentFields.length - 1 ? (
                                            <Button variant="outline-primary" onClick={addNutrimentField}>
                                                Add Another Nutriment
                                            </Button>
                                        ) : (
                                            <Button variant="outline-danger" onClick={() => removeNutrimentField(index)}>
                                                Remove
                                            </Button>
                                        )}
                                    </Col>
                                </Row>
                            ))}
                        </Form.Group>

                        <div className="d-grid">
                            <Button
                                className="lookup-button"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Adding...' : 'Add Product'}
                            </Button>
                        </div>
                    </Form>
                </div>

                {message && (
                    <Alert variant={message.includes('successfully.. ') ? 'success' : 'danger'} className="mt-4" style={{color :'green',maxWidth: '500px', margin: '0 auto', fontSize: '2.2rem', padding: '0.5rem' }}>
                        {message}
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default NewAddOn;
