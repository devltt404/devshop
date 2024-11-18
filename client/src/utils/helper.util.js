/**
 * Convert the price from cents to dollars
 * @param {number} price - Price in cents
 * @returns {string} - Price in dollars with 2 decimal places
 */
export function displayPrice(price) {
  return (price / 100).toFixed(2);
}

/**
 * Set the validation errors received from the server on the form
 * @param {Object} param0
 * @param {Object} param0.errors - Validation errors object where keys are field names and values are error messages
 * @param {Object} param0.form - react-hook-form form object
 */
export function setValidationErrors({ errors, form }) {
  if (errors) {
    Object.keys(errors).forEach((key) => {
      form.setError(key, { type: "server", message: errors[key] });
    });
  }
}

export function prescaleImg(originalUrl, width = 300, height = 300) {
  return originalUrl.replace(
    "pisces.bbystatic.com",
    `pisces.bbystatic.com/prescaled/${width}/${height}`,
  );
}
