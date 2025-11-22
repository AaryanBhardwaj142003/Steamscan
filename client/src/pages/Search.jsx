import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { searchGames } from '../utils/api';

const Search = () => {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('search');

    useEffect(() => {
        const fetchGames = async () => {
            if (query) {
                setLoading(true);
                try {
                    const res = await searchGames(query);
                    setGames(res.data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setGames([]); // Clear games if no search
            }
        };
        fetchGames();
    }, [query]);

    return (
        <div className="flex flex-col items-center">
            {!query && (
                <div className="text-center mt-20 animate-fade-in">
                    <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                        Check Your Specs
                    </h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                        Search for any Steam game above to see if your PC can run it. 
                        We analyze official system requirements against your hardware.
                    </p>
                </div>
            )}

            {loading && (
                <div className="mt-12 flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-purple-400 font-mono">Scanning Steam Database...</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full">
                {games.map((game) => (
                    <Link 
                        to={`/game/${game.appid}`} 
                        key={game.appid} 
                        className="group relative bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:-translate-y-2"
                    >
                        {/* Image Placeholder or Actual Image if available (Steam API list doesn't give images usually, but we can try to construct one or use a placeholder) */}
                        <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center overflow-hidden relative">
                            <img 
                                src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`} 
                                alt={game.name}
                                onError={(e) => {e.target.onerror = null; e.target.src = 'https://via.placeholder.com/460x215/1f2937/a855f7?text=No+Image'}}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
                        </div>
                        
                        <div className="p-6 relative z-10">
                            <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors truncate">{game.name}</h2>
                            <div className="flex items-center text-sm text-gray-400">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 shadow-[0_0_5px_rgba(34,197,94,0.8)]"></span>
                                Steam App ID: {game.appid}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {query && !loading && games.length === 0 && (
                <div className="mt-20 text-center animate-fade-in">
                    <h2 className="text-3xl font-bold text-white mb-4">No Games Found</h2>
                    <p className="text-gray-400">We couldn't find any games matching "{query}".</p>
                    <p className="text-gray-500 text-sm mt-2">Try searching for a different title.</p>
                </div>
            )}
        </div>
    );
};

export default Search;
