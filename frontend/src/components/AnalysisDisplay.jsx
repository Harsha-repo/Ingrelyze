import React from 'react';
import './styles.css';

const AnalysisDisplay = ({ analysis }) => {
  if (!analysis) return null;

  const { code, product_name, Ingredients, Analysis, Health_rating } = analysis;

  return (
    <div className="product-display mt-3">
      <div className="mt-4 glass-card">
        <div className="card-body">
          <h3 className="card-title">Analysis Report</h3>

          <p><strong>Product:</strong> {product_name} ({code})</p>

          {Ingredients && (
            <>
              <h5 className="section-title">Ingredients</h5>
              <div className="analysis-items-container">
                {Object.entries(Ingredients).map(([ingredient, description], idx) => (
                  <div key={idx} className="glass-card analysis-item-card">
                    <div className="card-body">
                      <strong>{ingredient}:</strong> {description}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {Analysis && (
            <>
              <h5 className="section-title">Benefits</h5>
              <div className="analysis-items-container benefits-list">
                {Analysis.benefits && Analysis.benefits.map((benefit, idx) => (
                  <div key={idx} className="glass-card analysis-item-card">
                    <div className="card-body">
                      {benefit}
                    </div>
                  </div>
                ))}
              </div>

              <h5 className="section-title">Risks</h5>
              <div className="analysis-items-container risks-list">
                {Analysis.risks && Analysis.risks.map((risk, idx) => (
                  <div key={idx} className="glass-card analysis-item-card">
                    <div className="card-body">
                      {risk}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {Health_rating && (
            <>
              <h5 className="section-title">Health Rating</h5>
              <p className="health-rating">{Health_rating}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
