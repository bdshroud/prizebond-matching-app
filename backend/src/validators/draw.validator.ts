import { z } from 'zod';
import { BOND_NUMBER_REGEX } from '../config/constants.js';

export const createDrawSchema = z.object({
  body: z.object({
    drawNumber: z.string().trim().min(1, 'Draw number is required'),
    drawDate: z.string().refine((val) => !isNaN(Date.parse(val)), 'Invalid draw date format'),
    publicationDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), 'Invalid publication date format'),
    officialSource: z.string().trim().optional(),
    description: z.string().trim().optional(),
    seriesType: z.string().trim().default('all')
  })
});

export const updateDrawSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Draw ID is required')
  }),
  body: z.object({
    drawNumber: z.string().trim().min(1).optional(),
    drawDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), 'Invalid draw date format'),
    publicationDate: z.string().optional().refine((val) => !val || !isNaN(Date.parse(val)), 'Invalid publication date format'),
    officialSource: z.string().trim().optional(),
    description: z.string().trim().optional(),
    seriesType: z.string().trim().optional(),
    isVerified: z.boolean().optional(),
    isPublished: z.boolean().optional()
  })
});

export const addWinningNumbersSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Draw ID is required')
  }),
  body: z.object({
    winningNumbers: z
      .array(
        z.object({
          bondNumber: z.string().trim().regex(BOND_NUMBER_REGEX, 'Winning bond number must be 7 digits'),
          prizeCategory: z.enum(['first', 'second', 'third', 'fourth', 'fifth']),
          applicableSeries: z.string().trim().default('all'),
          prizeAmount: z.number().positive().optional()
        })
      )
      .min(1, 'At least one winning number is required')
  })
});

export const getDrawsQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    search: z.string().trim().optional(),
    year: z.coerce.number().int().optional(),
    isPublished: z.coerce.boolean().optional()
  })
});
