import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.js';
import { bondService } from '../services/bond.service.js';

export const bondController = {
  getBonds: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await bondService.getBonds(req.user!._id, req.query as any);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  getBondById: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const bond = await bondService.getBondById(req.user!._id, id);
      res.status(200).json({
        success: true,
        data: bond
      });
    } catch (err) {
      next(err);
    }
  },

  addBond: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const bond = await bondService.addBond(req.user!._id, req.body);
      res.status(201).json({
        success: true,
        message: 'Prize bond added successfully',
        data: bond
      });
    } catch (err) {
      next(err);
    }
  },

  bulkAddBonds: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await bondService.bulkAddBonds(req.user!._id, req.body.bonds);
      res.status(201).json({
        success: true,
        message: `Successfully added ${result.addedCount} bonds (${result.duplicateCount} duplicates skipped)`,
        data: result
      });
    } catch (err) {
      next(err);
    }
  },

  updateBond: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const bond = await bondService.updateBond(req.user!._id, id, req.body);
      res.status(200).json({
        success: true,
        message: 'Prize bond updated successfully',
        data: bond
      });
    } catch (err) {
      next(err);
    }
  },

  deleteBond: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = String(req.params.id);
      const result = await bondService.deleteBond(req.user!._id, id);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  deleteBonds: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { ids } = req.body;
      const result = await bondService.deleteBonds(req.user!._id, ids || []);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  exportCSV: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const csv = await bondService.exportBondsCSV(req.user!._id);
      const filename = `prizebonds_export_${new Date().toISOString().split('T')[0]}.csv`;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.status(200).send(csv);
    } catch (err) {
      next(err);
    }
  },

  importCSV: async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      let csvContent = '';
      if (req.file) {
        csvContent = req.file.buffer.toString('utf-8');
      } else if (req.body.csvText) {
        csvContent = req.body.csvText;
      } else {
        res.status(400).json({ success: false, message: 'Please provide CSV file or csvText' });
        return;
      }

      const result = await bondService.importBondsCSV(req.user!._id, csvContent);
      res.status(201).json({
        success: true,
        message: `Imported ${result.addedCount} bonds (${result.duplicateCount} duplicates skipped)`,
        data: result
      });
    } catch (err) {
      next(err);
    }
  }
};
