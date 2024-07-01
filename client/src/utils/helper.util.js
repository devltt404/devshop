export function displayPrice(price) {
  return (price / 100).toFixed(2);
}

export function setValidationErrors({ errors, form }) {
  if (errors) {
    Object.keys(errors).forEach((key) => {
      form.setError(key, { type: "server", message: errors[key] });
    });
  }
}
