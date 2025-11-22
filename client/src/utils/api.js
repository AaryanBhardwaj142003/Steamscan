import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export const searchGames = (query) => api.get(`/steam/search?q=${query}`);
export const getGameDetails = (id) => api.get(`/steam/game/${id}`);
export const checkCompatibility = (gameId, specs) => api.post(`/specs/check/${gameId}`, { specs });
export const submitSystemReport = (specs) => api.post('/specs', specs);

export default api;
