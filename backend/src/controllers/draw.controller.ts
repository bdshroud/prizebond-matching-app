import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { drawService } from '../services/draw.service.js';
import { matchingService } from '../services/matching.service.js';

export const drawController = {
  getDraws: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isAdmin = req.user?.role === 'admin';
      const result = await drawService.getDraws(req.query as any, isAdmin);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  getDrawById: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isAdmin = req.user?.role === 'admin';
      const id = String(req.params.id);
      const result = await drawService.getDrawById(id, isAdmin);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  createDraw: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const draw = await drawService.createDraw(req.body);
      res.status(201).json({
        success: true,
        message: 'Draw created successfully',
        data: draw
      });
    } catch (err) {
      next(err);
    }
  },

  updateDraw: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const draw = await drawService.updateDraw(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Draw updated successfully',
        data: draw
      });
    } catch (err) {
      next(err);
    }
  },

  deleteDraw: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const result = await drawService.deleteDraw(id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  addWinningNumbers: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const result = await drawService.addWinningNumbers(id, req.body.winningNumbers);
      res.status(201).json({
        success: true,
        message: `Added ${result.addedCount} winning numbers`,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  importWinningNumbersCSV: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      let csvContent = '';
      if (req.file) {
        csvContent = req.file.buffer.toString('utf-8');
      } else if (req.body.csvText) {
        csvContent = req.body.csvText;
      } else {
        res.status(400).json({ success: false, message: 'Please provide CSV file or csvText' });
        return;
      }

      const result = await drawService.importWinningNumbersCSV(id, csvContent);
      res.status(201).json({
        success: true,
        message: `Imported ${result.addedCount} winning numbers`,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  publishDraw: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const result = await drawService.publishAndVerifyDraw(id);
      res.status(200).json({
        success: true,
        message: `Draw published & verified. Matching engine executed (${result.matchingResult.matchedCount} wins detected).`,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  triggerMatchManually: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const result = await matchingService.runMatchingForDraw(id);
      res.status(200).json({
        success: true,
        message: `Matching job completed: ${result.matchedCount} winning bonds identified`,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
};
