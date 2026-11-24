import { WITHHOLDING_TAX_RATE } from '../config/constants.js';

export interface ITaxCalculation {
  grossAmount: number;
  taxRate: number;
  estimatedTax: number;
  netAmount: number;
}

/**
 * Calculates official Bangladesh withholding tax for prize bond winnings.
 * As per Section 55 of Bangladesh Income Tax Ordinance, 20% tax is deducted at source.
 */
export function calculatePrizeTax(grossAmount: number): ITaxCalculation {
  const gross = Math.max(0, Number(grossAmount) || 0);
  const estimatedTax = Math.round(gross * WITHHOLDING_TAX_RATE);
  const netAmount = gross - estimatedTax;

  return {
    grossAmount: gross,
    taxRate: WITHHOLDING_TAX_RATE,
    estimatedTax,
    netAmount
  };
}
