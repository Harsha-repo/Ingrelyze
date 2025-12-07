import React, { useState, useEffect } from 'react';
import { Alert, Button, Row, Col } from 'react-bootstrap';
import { preprocessProductData } from '../utils/preprocessData';
import AnalysisDisplay from './AnalysisDisplay';
import NutrientAnalysisDisplay from './NutrientAnalysisDisplay';
import { analyzeIngredientsByBarcode, analyzeNutrientsByBarcode } from './productApi.js';
import './styles.css';


const ProductDisplay = ({ result }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [nutrientAnalysisResult, setNutrientAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [nutrientLoading, setNutrientLoading] = useState(false);

  useEffect(() => {
    const savedAnalysisResult = localStorage.getItem('analysisResult');
    const savedNutrientAnalysisResult = localStorage.getItem('nutrientAnalysisResult');

    if (savedAnalysisResult) setAnalysisResult(JSON.parse(savedAnalysisResult));
    if (savedNutrientAnalysisResult) setNutrientAnalysisResult(JSON.parse(savedNutrientAnalysisResult));
  }, []);

  useEffect(() => {
    localStorage.setItem('analysisResult', JSON.stringify(analysisResult));
  }, [analysisResult]);

  useEffect(() => {
    localStorage.setItem('nutrientAnalysisResult', JSON.stringify(nutrientAnalysisResult));
  }, [nutrientAnalysisResult]);

  useEffect(() => {
    setAnalysisResult(null);
    setNutrientAnalysisResult(null);
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
    setAnalysisResult(null); // Clear previous results
    try {
      const result = await analyzeIngredientsByBarcode(code);
      setAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing ingredients:', error);
      setAnalysisResult({ error: 'Failed to analyze ingredients' });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeNutrients = async () => {
    setNutrientLoading(true);
    setNutrientAnalysisResult(null); // Clear previous results
    try {
      const result = await analyzeNutrientsByBarcode(code);
      setNutrientAnalysisResult(result);
    } catch (error) {
      console.error('Error analyzing nutrients:', error);
      setNutrientAnalysisResult({ error: 'Failed to analyze nutrients' });
    } finally {
      setNutrientLoading(false);
    }
  };

  return (
    <>
      <div className="product-display mt-4">
        <div className="mb-6 glass-card product-card">
          <div className="card-body">
            {/* Product Header */}
            <div className="product-header">
              <h2 className="product-name">{product_name}</h2>
              <p className="product-brand">by {brands}</p>
              <p className="product-quantity">{quantity}</p>
            </div>

            {/* Categories */}
            {categories && categories !== 'N/A' && (
              <div className="product-section">
                <h4 className="section-title">Categories</h4>
                <div className="tags-container">
                  {categories.split(',').map((cat, index) => (
                    <span key={index} className="tag category-tag">{cat.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {ingredients.length > 0 && (
              <div className="product-section">
                <h4 className="section-title">Ingredients</h4>
                <div className="tags-container">
                  {ingredients.map((ingredient, index) => (
                    <span key={index} className="tag ingredient-tag">{ingredient}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Nutritional Information */}
            {Object.keys(nutrients).length > 0 && (
              <div className="product-section">
                <h4 className="section-title">Nutritional Information (per serving)</h4>
                <div className="nutrients-grid">
                  {Object.entries(nutrients).map(([key, value]) => (
                    <div key={key} className="nutrient-item">
                      <span className="nutrient-label">{key.replace(/_/g, ' ')}</span>
                      <span className="nutrient-value">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Analyze Buttons */}
        <div className="text-center mt-6">
          <Row className="justify-content-center">
            <Col xs={12} sm={6} className="mb-2 mb-sm-0">
              <Button className="lookup-button analyze-button" onClick={handleAnalyzeIngredients} disabled={loading}>
                {loading ? 'Analyzing...' : 'Analyze Ingredients'}
              </Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button className="lookup-button analyze-button" onClick={handleAnalyzeNutrients} disabled={nutrientLoading}>
                {nutrientLoading ? 'Analyzing...' : 'Analyze Nutrients'}
              </Button>
            </Col>
          </Row>
        </div>

        {/* Display Analysis Results */}
        <Row className="mt-4">
          <Col md={6} className="analysis-display-container" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
            {analysisResult && <AnalysisDisplay analysis={analysisResult} />}
          </Col>

          <Col md={6} className="analysis-display-container" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
            {nutrientAnalysisResult && <NutrientAnalysisDisplay analysis={nutrientAnalysisResult} />}
          </Col>
        </Row>
      </div>
    </>
  );
};

export default ProductDisplay;
