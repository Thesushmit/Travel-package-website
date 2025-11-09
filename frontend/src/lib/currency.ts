/**
 * Currency formatting utility
 * Formats amounts with proper currency symbols
 */

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  }
  return `${currency} ${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
};

export const formatCurrencyWithDecimals = (amount: number, currency: string = 'INR'): string => {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  }
  return `${currency} ${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
};

