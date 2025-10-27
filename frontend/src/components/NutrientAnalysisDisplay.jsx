import React from 'react';
import './styles.css';

const NutrientAnalysisDisplay = ({ analysis }) => {
  if (!analysis || !analysis.output) return null;

  const { output } = analysis;
  const { product_name, user_category, reference_rda, product_analysis_per_serving, summary } = output;

  const getRdaColor = (percentage) => {
    if (percentage === null) return '#8b949e';
    if (percentage < 10) return '#f85149';
    if (percentage < 25) return '#d29922';
    if (percentage < 50) return '#238636';
    return '#1f6feb';
  };

  const getRdaWidth = (percentage) => {
    if (percentage === null) return '0%';
    return Math.min(percentage * 2, 100) + '%'; // Scale for better visualization
  };

  return (
    <div className="product-display mt-3">
      <div className="mt-4 glass-card nutrient-analysis-card">
        <div className="card-body">
          <h3 className="card-title">Nutrient Analysis Report</h3>

          <div className="product-info-section">
            <h4 className="product-name-display">{product_name}</h4>
            <p className="user-category">Target Category: {user_category}</p>
          </div>

          <div className="nutrients-breakdown">
            <h5 className="section-title">Nutritional Breakdown (per serving)</h5>
            <div className="nutrients-grid">
              {Object.entries(product_analysis_per_serving).map(([nutrient, data], idx) => (
                <div key={idx} className="nutrient-card glass-card">
                  <div className="nutrient-header">
                    <span className="nutrient-name">{nutrient.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                    <span className="nutrient-value">{data.value} {nutrient.includes('kcal') ? 'kcal' : nutrient.includes('g') ? 'g' : ''}</span>
                  </div>
                  {data.rda_percent !== null && (
                    <div className="rda-bar-container">
                      <div className="rda-bar">
                        <div
                          className="rda-fill"
                          style={{
                            width: getRdaWidth(data.rda_percent),
                            backgroundColor: getRdaColor(data.rda_percent)
                          }}
                        ></div>
                      </div>
                      <span className="rda-percent">{data.rda_percent}% RDA</span>
                    </div>
                  )}
                  <p className="nutrient-comment">{data.comment}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="summary-section">
            <h5 className="section-title">Summary</h5>

            <div className="summary-item strengths">
              <h6 className="summary-subtitle">✓ Strengths</h6>
              <ul className="summary-list">
                {summary.strengths.map((strength, idx) => (
                  <li key={idx} className="summary-point">{strength}</li>
                ))}
              </ul>
            </div>

            {summary.cautions && summary.cautions.length > 0 && (
              <div className="summary-item cautions">
                <h6 className="summary-subtitle">⚠ Cautions</h6>
                <ul className="summary-list">
                  {summary.cautions.map((caution, idx) => (
                    <li key={idx} className="summary-point">{caution}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="summary-item suitability">
              <h6 className="summary-subtitle">👥 Suitability</h6>
              <p className="suitability-text">{summary.suitability}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutrientAnalysisDisplay;
