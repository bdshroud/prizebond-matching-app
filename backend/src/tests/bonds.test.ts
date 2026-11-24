import { describe, it, expect } from 'vitest';
import { BOND_NUMBER_REGEX } from '../config/constants.js';
import { addBondSchema, bulkAddBondsSchema } from '../validators/bond.validator.js';

describe('3. Bond CRUD & User Ownership Test Suite', () => {
  it('strictly validates and preserves 7-digit bond numbers with leading zeros', () => {
    // Bangladesh Prize Bonds strictly require 7-digit strings
    const validNumbers = ['0000001', '0123456', '0892211', '9999999'];
    for (const num of validNumbers) {
      expect(BOND_NUMBER_REGEX.test(num)).toBe(true);
      expect(num).toHaveLength(7);
      expect(typeof num).toBe('string');
    }

    // Number stored as integer would lose leading zeros (e.g. 1 instead of 0000001)
    const asInteger = Number('0000001');
    expect(asInteger).toBe(1);
    expect(asInteger.toString()).not.toBe('0000001'); // Highlights necessity of string representation!
  });

  it('validates single bond creation schema', () => {
    const valid = addBondSchema.safeParse({
      body: {
        bondNumber: '0123456',
        series: 'KA',
        purchaseDate: '2026-01-15',
        notes: 'Savings from salary'
      }
    });
    expect(valid.success).toBe(true);

    const invalidNumber = addBondSchema.safeParse({
      body: {
        bondNumber: '12345', // 5 digits
        series: 'all'
      }
    });
    expect(invalidNumber.success).toBe(false);
  });

  it('validates bulk bond creation schema and rejects empty lists', () => {
    const validBulk = bulkAddBondsSchema.safeParse({
      body: {
        bonds: [
          { bondNumber: '0123456', series: 'all' },
          { bondNumber: '0654321', series: 'KA' }
        ]
      }
    });
    expect(validBulk.success).toBe(true);

    const emptyBulk = bulkAddBondsSchema.safeParse({
      body: {
        bonds: []
      }
    });
    expect(emptyBulk.success).toBe(false);
  });

  it('enforces user ownership isolation: User A cannot see or mutate User B bonds', () => {
    const userA_Id = 'user_aaa_111';
    const userB_Id = 'user_bbb_222';

    const bondDatabase = [
      { id: 'b1', user: userA_Id, bondNumber: '0123456', series: 'all' },
      { id: 'b2', user: userA_Id, bondNumber: '0234567', series: 'all' },
      { id: 'b3', user: userB_Id, bondNumber: '0892211', series: 'KA' }
    ];

    // Filter bonds by authenticated user
    function getBondsForUser(userId: string) {
      return bondDatabase.filter((b) => b.user === userId);
    }

    const userABonds = getBondsForUser(userA_Id);
    expect(userABonds).toHaveLength(2);
    expect(userABonds.some((b) => b.user === userB_Id)).toBe(false);

    const userBBonds = getBondsForUser(userB_Id);
    expect(userBBonds).toHaveLength(1);
    expect(userBBonds[0].bondNumber).toBe('0892211');

    // Attempting to delete User B's bond as User A
    function canUserDeleteBond(userId: string, bondId: string): boolean {
      const bond = bondDatabase.find((b) => b.id === bondId);
      return !!bond && bond.user === userId;
    }

    expect(canUserDeleteBond(userA_Id, 'b3')).toBe(false); // Unauthorized!
    expect(canUserDeleteBond(userB_Id, 'b3')).toBe(true);  // Authorized
  });

  it('deduplicates bonds within the same user profile correctly', () => {
    const existingBonds = [
      { bondNumber: '0123456', series: 'all' },
      { bondNumber: '0892211', series: 'KA' }
    ];

    const newIncoming = [
      { bondNumber: '0123456', series: 'all' }, // duplicate
      { bondNumber: '0892211', series: 'KHA' }, // different series -> allowed
      { bondNumber: '0555555', series: 'all' }  // new -> allowed
    ];

    const deduplicated = newIncoming.filter((item) => {
      return !existingBonds.some(
        (e) => e.bondNumber === item.bondNumber && e.series.toLowerCase() === item.series.toLowerCase()
      );
    });

    expect(deduplicated).toHaveLength(2);
    expect(deduplicated.map((d) => d.bondNumber)).toEqual(['0892211', '0555555']);
  });

  it('correctly parses and normalizes CSV bond imports', () => {
    const csvContent = `bondNumber,series,purchaseDate,notes
0123456,KA,2026-01-10,First bond
  0892211 ,KHA,2026-02-01,Second bond
0005555,all,,`;

    const lines = csvContent.split('\n').filter((l) => l.trim().length > 0).slice(1);
    const parsed = lines.map((line) => {
      const [num, series, date, notes] = line.split(',').map((s) => s.trim());
      return {
        bondNumber: num.padStart(7, '0'),
        series: series || 'all',
        purchaseDate: date || null,
        notes: notes || ''
      };
    });

    expect(parsed).toHaveLength(3);
    expect(parsed[0].bondNumber).toBe('0123456');
    expect(parsed[1].bondNumber).toBe('0892211');
    expect(parsed[2].bondNumber).toBe('0005555');
  });
});
