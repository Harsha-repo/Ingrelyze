import React, { useState } from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';

const Analysis_ingredients = ({ barcode }) => {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyzeIngredients = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/database_webhook/analysis-lookup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ barcode }),
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
    <div className="text-center mt-4">
      <Button variant="primary" onClick={handleAnalyzeIngredients} disabled={loading}>
        {loading ? (
          <>
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            {' Analyzing...'}
          </>
        ) : (
          'Analyze Ingredients'
        )}
      </Button>

      {/* Display Analysis Result */}
      {analysisResult && (
        <div className="mt-4">
          <h4>Analysis Result</h4>
          {analysisResult.error ? (
            <Alert variant="danger">{analysisResult.error}</Alert>
          ) : (
            <pre>{JSON.stringify(analysisResult, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
};

export default Analysis_ingredients;
