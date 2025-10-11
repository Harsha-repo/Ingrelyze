import React, { useState, useEffect } from 'react';
import { Card, Table, Alert, Row, Col, Button } from 'react-bootstrap';
import { preprocessProductData } from '../utils/preprocessData';
import AnalysisDisplay from './AnalysisDisplay';
import './styles.css';


const ProductDisplay = ({ result }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAnalysisResult(null);
  }, [result]);

  if (!result) return null;

  if (result.error) {
    return <Alert variant="danger">{result.error}</Alert>;
  }

  const processedData = preprocessProductData(result);

  if (!processedData) return null;

  const { code, product_name, brands, quantity, categories, ingredients, nutrients } = processedData;

  const handleAnalyzeIngredients = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/database_webhook/analysis-lookup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcode: code }),
      });
      const data = await response.json();
      setAnalysisResult(data);
    } catch (error) {
      console.error('Error analyzing ingredients:', error);
      setAnalysisResult({ error: 'Failed to analyze ingredients' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="product-display mt-3">
        <h3 className="text-center mb-4">Product Information</h3>
        <Card className="mb-4 product-info-card">
          <Card.Body>
            <Card.Title>Product Details</Card.Title>
            <Row>
              <Col md={3}>
                <strong>Code:</strong> {code}
              </Col>
              <Col md={3}>
                <strong>Product Name:</strong> {product_name}
              </Col>
              <Col md={3}>
                <strong>Brand:</strong> {brands}
              </Col>
              <Col md={3}>
                <strong>Quantity:</strong> {quantity}
              </Col>
            </Row>
            {categories !== 'N/A' && (
              <Row className="mt-2">
                <Col md={12}>
                  <strong>Categories:</strong> {categories}
                </Col>
              </Row>
            )}
          </Card.Body>
        </Card>

        <Row>
          {ingredients.length > 0 && (
            <Col md={6}>
              <Card className="mb-4 ingredient-nutrient-card">
                <Card.Body>
                  <Card.Title>Ingredients</Card.Title>
                  <Table striped bordered hover className="ingredient-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th >Ingredient</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ingredients.map((ingredient, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{ingredient}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          )}

          {Object.keys(nutrients).length > 0 && (
            <Col md={6} >
              <Card className="mb-4  ingredient-nutrient-card">
                <Card.Body>
                  <Card.Title>Nutritional Information (per serving)</Card.Title>
                  <Table striped bordered hover className="ingredient-table">
                    <thead>
                      <tr>
                        <th>Nutrient</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(nutrients).map(([key, value]) => (
                        <tr key={key}>
                          <td>{key}</td>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>

        {/* Display any other fields not covered - but since processed, likely none */}
        {Object.keys(processedData).filter(key => !['code', 'product_name', 'brands', 'quantity', 'categories', 'ingredients', 'nutrients', 'error'].includes(key)).length > 0 && (
          <Card>
            <Card.Body>
              <Card.Title>Additional Information</Card.Title>
              <pre>{JSON.stringify(
                Object.fromEntries(
                  Object.entries(processedData).filter(([key]) => !['code', 'product_name', 'brands', 'quantity', 'categories', 'ingredients', 'nutrients', 'error'].includes(key))
                ),
                null, 2
              )}</pre>
            </Card.Body>
          </Card>
        )}

        {/* Analyze Ingredients Button */}
        <div className="text-center mt-4">
          <Button className="analyze-button btn" onClick={handleAnalyzeIngredients} disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze Ingredients'}
          </Button>
        </div>

        {/* Display Analysis Result */}
        {analysisResult && <AnalysisDisplay analysis={analysisResult} />}
      </div>
    </>
  );
};

export default ProductDisplay;
