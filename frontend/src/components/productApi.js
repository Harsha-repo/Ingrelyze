const API_BASE_URL = 'http://localhost:8000/database_webhook';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network response was not ok' }));
    throw errorData;
  }
  return response.json();
};

export const analyzeIngredientsByBarcode = async (barcode) => {
  const response = await fetch(`${API_BASE_URL}/analysis-lookup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ barcode }),
  });
  return handleResponse(response);
};

export const lookupBarcode = async (barcode) => {
  const response = await fetch(`${API_BASE_URL}/barcode-lookup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ barcode }),
  });
  return handleResponse(response);
};