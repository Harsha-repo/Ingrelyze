import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import { preprocessProductData } from '../utils/preprocessData';
import AnalysisDisplay from './AnalysisDisplay';
import { analyzeIngredientsByBarcode } from './productApi.js';
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

  return (
    <>
      <div className="product-display mt-3">
        <div className="mb-4 glass-card product-card">
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

        {/* Analyze Ingredients Button */}
        <div className="text-center mt-4">
          <Button className="lookup-button analyze-button" onClick={handleAnalyzeIngredients} disabled={loading}>
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
