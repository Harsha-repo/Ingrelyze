export const preprocessProductData = (rawProduct) => {
  if (!rawProduct) return null;

  // Handle array
  const product = Array.isArray(rawProduct) ? rawProduct[0] : rawProduct;

  // Clean product name: remove non-English if needed, but assume it's mostly English
  const productName = product.product_name || 'N/A';

  // Clean brands: split and take first or English
  const brands = product.brands ? product.brands.split(',').map(b => b.trim())[0] || 'N/A' : 'N/A';

  // Clean quantity: keep as is
  const quantity = product.quantity || 'N/A';

  // Clean categories: split by comma or \n, filter English-like (no non-ASCII)
  const categoriesRaw = product.categories || '';
  const categories = categoriesRaw
    .split(/[\n,]/)
    .map(cat => cat.trim())
    .filter(cat => /^[a-zA-Z0-9\s\-:]+$/.test(cat) && cat.length > 0) // Basic English filter
    .join(', ') || 'N/A';

  // Clean ingredients: split by comma, remove language prefixes like 'en:', 'da:', and non-English text
  let ingredientsList = [];
  if (product.ingredients) {
    ingredientsList = product.ingredients
      .split(',')
      .map(ing => {
        let cleaned = ing.trim();
        // Remove language prefixes like 'en:', 'da:'
        cleaned = cleaned.replace(/^[a-z]{2}:/i, '').trim();
        // Filter out non-English (basic: keep if mostly ASCII letters, numbers, common symbols)
        if (/^[a-zA-Z0-9\s()[\]%,\-&]+$/.test(cleaned) && cleaned.length > 1) {
          return cleaned;
        }
        return null;
      })
      .filter(ing => ing !== null && ing.length > 0);
  }

  // Nutrients: keep as is, but title-case keys
  const nutriments = product.nutriments || {};
  const nutrients = {};
  Object.entries(nutriments).forEach(([key, value]) => {
    const displayKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    nutrients[displayKey] = value;
  });

  // Code remains the same
  const code = product.code || 'N/A';

  return {
    code,
    product_name: productName,
    brands,
    quantity,
    categories,
    ingredients: ingredientsList, // Now an array of cleaned strings
    nutrients, // Title-cased keys
  };
};
