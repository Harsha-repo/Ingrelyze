import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import './styles.css';

const AnalysisDisplay = ({ analysis }) => {
  if (!analysis) return null;

  const { code, product_name, Ingredients, Analysis, Health_rating } = analysis;

  return (
    <div className="analysis-display">
      <Card className="mt-4 analysis-card">
        <Card.Body>
          <Card.Title className="analysis-title">Analysis Report</Card.Title>

          <h5 className="section-title">Product Code : {code}</h5>

          <h5 className="section-title">Product Name : {product_name}</h5>
          <p></p>

          {Ingredients && (
            <>
              <h5 className="section-title">Ingredients</h5>
              <ListGroup className="mb-3 ingredient-list">
                {Object.entries(Ingredients).map(([ingredient, description], idx) => (
                  <ListGroup.Item key={idx}>
                    <strong>{ingredient}:</strong> {description}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}

          {Analysis && (
            <>
              <h5 className="section-title">Benefits</h5>
              <ListGroup className="mb-3 benefits-list">
                {Analysis.benefits && Analysis.benefits.map((benefit, idx) => (
                  <ListGroup.Item key={idx}>
                    {benefit}
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <h5 className="section-title">Risks</h5>
              <ListGroup className="mb-3 risks-list">
                {Analysis.risks && Analysis.risks.map((risk, idx) => (
                  <ListGroup.Item key={idx}>
                    {risk}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}

          {Health_rating && (
            <>
              <h5 className="section-title">Health Rating</h5>
              <p className="health-rating">{Health_rating}</p>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AnalysisDisplay;
