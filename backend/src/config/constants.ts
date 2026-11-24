/**
 * Official Bangladesh 100 Taka Prize Bond Constants & Rules
 * Regulated by Bangladesh Bank & Internal Resources Division (Ministry of Finance)
 */

export const PRIZE_STRUCTURE = {
  first: {
    category: 'first',
    titleBn: '১ম পুরস্কার',
    titleEn: '1st Prize',
    amount: 600000,
    countPerSeries: 1
  },
  second: {
    category: 'second',
    titleBn: '২য় পুরস্কার',
    titleEn: '2nd Prize',
    amount: 325000,
    countPerSeries: 1
  },
  third: {
    category: 'third',
    titleBn: '৩য় পুরস্কার',
    titleEn: '3rd Prize',
    amount: 100000,
    countPerSeries: 2
  },
  fourth: {
    category: 'fourth',
    titleBn: '৪র্থ পুরস্কার',
    titleEn: '4th Prize',
    amount: 50000,
    countPerSeries: 2
  },
  fifth: {
    category: 'fifth',
    titleBn: '৫ম পুরস্কার',
    titleEn: '5th Prize',
    amount: 10000,
    countPerSeries: 40
  }
} as const;

export type PrizeCategory = keyof typeof PRIZE_STRUCTURE;

// Official Bangladesh Tax Rule: 20% Source Withholding Tax on Prize Money
export const WITHHOLDING_TAX_RATE = 0.20;

// Official Purchase Eligibility: Bond must be purchased at least 60 days before the draw
export const MIN_PURCHASE_DAYS_BEFORE_DRAW = 60;

// Official Claim Validity Period: 2 years (730 days) from official draw date
export const CLAIM_VALIDITY_DAYS = 730;

// Bond Number Specifications
export const BOND_NUMBER_LENGTH = 7;
export const BOND_NUMBER_REGEX = /^[0-9]{7}$/;

// Roles
export const ROLES = {
  USER: 'user',
  ADMIN: 'admin'
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

// Notification Types
export const NOTIFICATION_TYPES = {
  WINNER: 'winner',
  NEW_DRAW: 'new_draw',
  SYSTEM: 'system',
  REMINDER: 'reminder'
} as const;

export type NotificationType = (typeof NOTIFICATION_TYPES)[keyof typeof NOTIFICATION_TYPES];
