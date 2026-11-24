import { z } from 'zod';
import { BOND_NUMBER_REGEX } from '../config/constants.js';

export const addBondSchema = z.object({
  body: z.object({
    bondNumber: z
      .string()
      .trim()
      .regex(BOND_NUMBER_REGEX, 'Bangladesh Prize Bond number must be exactly 7 numeric digits (e.g. 0562947)'),
    series: z.string().trim().max(10, 'Series cannot exceed 10 characters').default(''),
    purchaseDate: z
      .string()
      .nullable()
      .optional()
      .refine((val) => !val || !isNaN(Date.parse(val)), 'Invalid purchase date format'),
    notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional().default('')
  })
});

export const bulkAddBondsSchema = z.object({
  body: z.object({
    bonds: z
      .array(
        z.object({
          bondNumber: z
            .string()
            .trim()
            .regex(BOND_NUMBER_REGEX, 'Each bond number must be exactly 7 digits'),
          series: z.string().trim().max(10).optional().default(''),
          purchaseDate: z.string().nullable().optional(),
          notes: z.string().max(500).optional().default('')
        })
      )
      .min(1, 'At least one bond must be provided')
      .max(5000, 'Cannot add more than 5,000 bonds in a single bulk request')
  })
});

export const updateBondSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Bond ID is required')
  }),
  body: z.object({
    bondNumber: z.string().trim().regex(BOND_NUMBER_REGEX).optional(),
    series: z.string().trim().max(10).optional(),
    purchaseDate: z.string().nullable().optional(),
    notes: z.string().max(500).optional(),
    isEnabled: z.boolean().optional()
  })
});

export const getBondsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().trim().optional(),
    series: z.string().trim().optional(),
    isEnabled: z.coerce.boolean().optional(),
    sortBy: z.enum(['createdAt', 'bondNumber', 'purchaseDate', 'series']).default('createdAt'),
    order: z.enum(['asc', 'desc']).default('desc')
  })
});
