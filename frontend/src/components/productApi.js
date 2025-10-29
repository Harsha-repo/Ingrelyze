const API_BASE_URL = 'http://192.168.1.6:8000/database_webhook';

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: 'Network response was not ok' }));
    throw errorData;
  }
  return response.json();
};

export const analyzeIngredientsByBarcode = async (barcode) => {
  const userType = localStorage.getItem('userType') || '';
  const response = await fetch(`${API_BASE_URL}/analysis-lookup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ barcode, user_type: userType }),
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

export const analyzeNutrientsByBarcode = async (barcode) => {
  const userType = localStorage.getItem('userType') || '';
  const response = await fetch(`${API_BASE_URL}/nutrient-analysis-lookup/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ barcode, user_type: userType }),
  });
  return handleResponse(response);
};

export const addNewProduct = async (productData) => {
  const response = await fetch('http://localhost:5678/webhook/manual-insertion', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
};
