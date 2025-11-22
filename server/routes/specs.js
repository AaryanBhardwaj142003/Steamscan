const express = require('express');
const router = express.Router();
const SystemReport = require('../models/SystemReport');
const comparisonService = require('../services/comparisonService');
const steamService = require('../services/steamService');

// Store system specs (from local helper)
router.post('/', async (req, res) => {
    try {
        const report = new SystemReport(req.body);
        await report.save();
        res.json({ success: true, id: report._id });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save report' });
    }
});

// Check compatibility
router.post('/check/:gameId', async (req, res) => {
    try {
        const { gameId } = req.params;
        let userSpecs = req.body.specs;

        // Extract reportId. It might be at root or inside specs object depending on client call
        let reportId = req.body.reportId;
        if (!reportId && userSpecs && userSpecs.reportId) {
            reportId = userSpecs.reportId;
        }

        if (reportId) {
            const report = await SystemReport.findById(reportId);
            if (!report) return res.status(404).json({ error: 'Report not found' });
            userSpecs = report.toObject();
        }

        if (!userSpecs) return res.status(400).json({ error: 'No specs provided' });

        const gameDetails = await steamService.getGameDetails(gameId);
        if (!gameDetails) return res.status(404).json({ error: 'Game not found' });

        const result = comparisonService.compareSpecs(userSpecs, gameDetails.pc_requirements);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to check compatibility' });
    }
});

// Delete system report
router.delete('/:id', async (req, res) => {
    try {
        await SystemReport.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete report' });
    }
});

module.exports = router;
