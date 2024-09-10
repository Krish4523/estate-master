export function formatCurrency(value, locale = "en-IN", currency = "INR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0, // Change this if you want fractional values
  }).format(value);
}
