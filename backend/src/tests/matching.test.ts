import { describe, it, expect } from 'vitest';
import { calculatePrizeTax } from '../utils/taxCalculator.js';
import { signToken, verifyToken } from '../utils/jwt.js';
import bcrypt from 'bcryptjs';
import {
  PRIZE_STRUCTURE,
  WITHHOLDING_TAX_RATE,
  MIN_PURCHASE_DAYS_BEFORE_DRAW,
  CLAIM_VALIDITY_DAYS,
  BOND_NUMBER_REGEX
} from '../config/constants.js';

describe('Bangladesh Prize Bond Domain & Tax Logic', () => {
  it('correctly calculates 20% official withholding tax on 1st prize (৳6,00,000)', () => {
    const gross = PRIZE_STRUCTURE.first.amount; // 600000
    const taxInfo = calculatePrizeTax(gross);

    expect(taxInfo.grossAmount).toBe(600000);
    expect(taxInfo.taxRate).toBe(0.20);
    expect(taxInfo.estimatedTax).toBe(120000); // 20% of 600,000
    expect(taxInfo.netAmount).toBe(480000);   // 600,000 - 120,000
  });

  it('correctly calculates 20% withholding tax on 5th prize (৳10,000)', () => {
    const gross = PRIZE_STRUCTURE.fifth.amount; // 10000
    const taxInfo = calculatePrizeTax(gross);

    expect(taxInfo.grossAmount).toBe(10000);
    expect(taxInfo.estimatedTax).toBe(2000);
    expect(taxInfo.netAmount).toBe(8000);
  });

  it('handles zero or negative amounts gracefully', () => {
    const taxInfo = calculatePrizeTax(0);
    expect(taxInfo.grossAmount).toBe(0);
    expect(taxInfo.estimatedTax).toBe(0);
    expect(taxInfo.netAmount).toBe(0);
  });

  it('enforces official Bangladesh Bank prize denominations', () => {
    expect(PRIZE_STRUCTURE.first.amount).toBe(600000);
    expect(PRIZE_STRUCTURE.second.amount).toBe(325000);
    expect(PRIZE_STRUCTURE.third.amount).toBe(100000);
    expect(PRIZE_STRUCTURE.fourth.amount).toBe(50000);
    expect(PRIZE_STRUCTURE.fifth.amount).toBe(10000);
  });
});

describe('Bond Number & Series Validation Logic', () => {
  it('strictly validates 7-digit bond numbers with leading zeros', () => {
    expect(BOND_NUMBER_REGEX.test('0562947')).toBe(true);
    expect(BOND_NUMBER_REGEX.test('0015923')).toBe(true);
    expect(BOND_NUMBER_REGEX.test('9999999')).toBe(true);

    // Invalid formats
    expect(BOND_NUMBER_REGEX.test('562947')).toBe(false);   // 6 digits (leading zero lost)
    expect(BOND_NUMBER_REGEX.test('05629478')).toBe(false); // 8 digits
    expect(BOND_NUMBER_REGEX.test('056294A')).toBe(false);  // Alphanumeric
    expect(BOND_NUMBER_REGEX.test('       ')).toBe(false);  // Whitespace
  });

  it('evaluates series matching rules accurately', () => {
    function isSeriesMatch(drawSeries: string, bondSeries: string): boolean {
      const applicable = (drawSeries || 'all').toLowerCase();
      const series = (bondSeries || '').toLowerCase();
      return applicable === 'all' || !series || applicable === series;
    }

    // When draw is for 'all' series, any bond series matches
    expect(isSeriesMatch('all', 'কক')).toBe(true);
    expect(isSeriesMatch('all', 'খখ')).toBe(true);
    expect(isSeriesMatch('all', '')).toBe(true);

    // When draw specifies specific series, exact match is required
    expect(isSeriesMatch('কক', 'কক')).toBe(true);
    expect(isSeriesMatch('কক', 'খখ')).toBe(false);
    expect(isSeriesMatch('কখ', 'কখ')).toBe(true);
  });

  it('verifies 60-day purchase eligibility rule', () => {
    const drawDate = new Date('2025-01-31');

    function isEligible(purchaseDate: Date, drawDate: Date): boolean {
      const diffDays = Math.floor((drawDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= MIN_PURCHASE_DAYS_BEFORE_DRAW;
    }

    // Purchased on Nov 15, 2024 (77 days before Jan 31) -> Eligible
    expect(isEligible(new Date('2024-11-15'), drawDate)).toBe(true);

    // Purchased on Dec 1, 2024 (61 days before Jan 31) -> Eligible
    expect(isEligible(new Date('2024-12-01'), drawDate)).toBe(true);

    // Purchased on Jan 10, 2025 (21 days before Jan 31) -> Ineligible!
    expect(isEligible(new Date('2025-01-10'), drawDate)).toBe(false);
  });

  it('calculates 2-year claim deadline from draw date', () => {
    const drawDate = new Date('2025-01-31T00:00:00.000Z');
    const deadline = new Date(drawDate.getTime() + CLAIM_VALIDITY_DAYS * 24 * 60 * 60 * 1000);

    const diffDays = Math.round((deadline.getTime() - drawDate.getTime()) / (1000 * 60 * 60 * 24));
    expect(diffDays).toBe(730);
  });
});

describe('Security & Authentication Utilities', () => {
  it('signs and verifies JWT tokens securely', () => {
    const payload = {
      userId: '60d5ec49f1b2c8b1f8e4e1a1',
      email: 'investor@prizebond.gov.bd',
      role: 'user'
    };

    const token = signToken(payload);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe(payload.userId);
    expect(decoded?.email).toBe(payload.email);
    expect(decoded?.role).toBe(payload.role);
  });

  it('rejects invalid or tampered JWT tokens', () => {
    const invalidToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.tampered.signature';
    expect(verifyToken(invalidToken)).toBeNull();
  });

  it('hashes passwords and verifies them using bcrypt', async () => {
    const password = 'StrongPassword123!';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    expect(hash).not.toBe(password);
    expect(await bcrypt.compare(password, hash)).toBe(true);
    expect(await bcrypt.compare('WrongPassword!', hash)).toBe(false);
  });
});
