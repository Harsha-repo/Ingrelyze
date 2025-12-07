import React from 'react';
import './styles.css';

const NutrientAnalysisDisplay = ({ analysis }) => {
  if (!analysis) return null;

  const output = analysis;
  const { product_name, user_category, reference_rda, product_analysis_per_serving, summary } = output;

  const getRdaColor = (percentage) => {
    if (percentage === null || percentage === undefined) return '#8b949e';
    if (percentage < 5) return '#f85149'; // Red for very low
    if (percentage < 15) return '#d29922'; // Yellow for low
    if (percentage < 30) return '#2da044ff'; // Green for moderate
    if (percentage < 70) return '#1f6feb'; // Blue for good
    return '#8b5cf6'; // Purple for very high
  };

  const getRdaWidth = (percentage) => {
    if (percentage === null || percentage === undefined) return '0%';
    return Math.min(percentage, 100) + '%';
  };

  const calculateRdaPercent = (nutrient, value) => {
    if (!reference_rda || !reference_rda[nutrient] || value === null || value === undefined) return null;
    return (value / reference_rda[nutrient]) * 100;
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
                  {(() => {
                    const calculatedPercent = calculateRdaPercent(nutrient, data.value);
                    const displayPercent = calculatedPercent !== null ? calculatedPercent : data.rda_percent;
                    if (displayPercent === null || displayPercent === undefined) return null;
                    return (
                      <div className="rda-bar-container">
                        <div className="rda-bar">
                          <div
                            className="rda-fill"
                            style={{
                              width: getRdaWidth(displayPercent),
                              backgroundColor: getRdaColor(displayPercent)
                            }}
                          ></div>
                        </div>
                        <span className="rda-percent">{Number(displayPercent).toFixed(1)}% RDA</span>
                      </div>
                    );
                  })()}
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
