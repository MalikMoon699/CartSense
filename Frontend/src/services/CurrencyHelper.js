export const Currencies = [
  { name: "Pakistani Rupee", Symbol: "Rs", ISOCode: "PKR" },
  { name: "Indian Rupee", Symbol: "₹", ISOCode: "INR" },
  { name: "Riyal", Symbol: "﷼", ISOCode: "SAR" },
  { name: "Lira", Symbol: "₺", ISOCode: "TRY" },
  { name: "Dollar", Symbol: "$", ISOCode: "USD" },
  { name: "Euro", Symbol: "€", ISOCode: "EUR" },
  { name: "Pound", Symbol: "£", ISOCode: "GBP" },
];

const conversionRates = {
  PKR: 1,
  USD: 280.7,
  EUR: 305,
  GBP: 368,
  INR: 3.55,
  SAR: 74.9,
  TRY: 15.5,
};

export const getPriceByCurrency = (fromISOCode, toISOCode, amount) => {
  if (!fromISOCode || !toISOCode || !amount) return amount || 0;
  const fromRate = conversionRates[fromISOCode.toUpperCase()];
  const toRate = conversionRates[toISOCode.toUpperCase()];
  if (!fromRate || !toRate) return 0;
  const amountInPKR = amount * fromRate;
  const convertedAmount = amountInPKR / toRate;
  return convertedAmount.toFixed(2);
};

export const getCurrencySymbol = (ISOCode) => {
  if (!ISOCode) return "Rs";
  const currency = Currencies.find(
    (c) => c.ISOCode.toUpperCase() === ISOCode.toUpperCase()
  );
  return currency ? currency.Symbol : "Rs";
};