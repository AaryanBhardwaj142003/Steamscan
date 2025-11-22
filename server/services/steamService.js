const axios = require('axios');

const STEAM_API_BASE = 'https://store.steampowered.com/api';

// Simple in-memory cache
const cache = {
    games: null,
    lastFetch: 0
};

const CACHE_DURATION = 3600000; // 1 hour

const getGameList = async () => {
    const now = Date.now();
    if (cache.games && (now - cache.lastFetch < CACHE_DURATION)) {
        return cache.games;
    }

    try {
        // ISteamApps/GetAppList/v2/ is deprecated/unreliable. Using IStoreService.
        // Requires API Key.
        const apiKey = process.env.STEAM_API_KEY;
        if (!apiKey || apiKey === 'YOUR_STEAM_API_KEY') {
            console.warn('Warning: STEAM_API_KEY is not set. Game list fetch may fail.');
            // Fallback or return empty if no key, but IStoreService needs it.
            // We could try the old one as a backup, but it seems dead.
        }

        const response = await axios.get(`https://api.steampowered.com/IStoreService/GetAppList/v1/?key=${apiKey}&max_results=50000`);

        // IStoreService structure: { response: { apps: [...] } }
        if (response.data.response && response.data.response.apps) {
            cache.games = response.data.response.apps;
            cache.lastFetch = now;
            return cache.games;
        }
        return [];
    } catch (error) {
        console.error('Error fetching game list:', error.message);
        // Return empty array instead of throwing to prevent crash
        return [];
    }
};

const getGameDetails = async (appId) => {
    try {
        const response = await axios.get(`${STEAM_API_BASE}/appdetails?appids=${appId}`);
        if (response.data[appId].success) {
            return response.data[appId].data;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching details for ${appId}:`, error);
        throw error;
    }
};

const searchGames = async (query) => {
    const games = await getGameList();
    if (!games) return [];

    const lowerQuery = query.toLowerCase();
    return games.filter(game => game.name.toLowerCase().includes(lowerQuery)).slice(0, 20);
};

module.exports = {
    getGameList,
    getGameDetails,
    searchGames
};
