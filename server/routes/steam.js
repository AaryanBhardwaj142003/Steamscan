const express = require('express');
const router = express.Router();
const steamService = require('../services/steamService');

router.get('/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ error: 'Query parameter required' });

        const games = await steamService.searchGames(query);
        res.json(games);
    } catch (error) {
        res.status(500).json({ error: 'Failed to search games' });
    }
});

router.get('/game/:id', async (req, res) => {
    try {
        const game = await steamService.getGameDetails(req.params.id);
        if (!game) return res.status(404).json({ error: 'Game not found' });
        res.json(game);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch game details' });
    }
});

module.exports = router;
