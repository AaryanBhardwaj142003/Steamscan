import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getGameDetails, checkCompatibility } from '../utils/api';
import SystemDetector from '../components/SystemDetector';
import CompatibilityResult from '../components/CompatibilityResult';

const GameDetails = () => {
    const { id } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState(null);
    const [userSpecs, setUserSpecs] = useState(null);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const res = await getGameDetails(id);
                setGame(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [id]);

    const handleCheck = async (specs) => {
        setUserSpecs(specs);
        try {
            const res = await checkCompatibility(id, specs);
            setResult(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-[60vh]">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
    
    if (!game) return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
            <h2 className="text-4xl font-bold text-white mb-4">Game Not Found</h2>
            <p className="text-gray-400 max-w-md mb-8">
                We couldn't find details for this game. It might not be available in our database or the ID is incorrect.
            </p>
            <a href="/" className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                Return Home
            </a>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Game Info Column */}
            <div className="lg:col-span-2 space-y-8">
                <div className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-gray-800 group">
                    <img src={game.header_image} alt={game.name} className="w-full object-cover transform group-hover:scale-105 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8">
                        <h1 className="text-5xl font-bold mb-2 text-white drop-shadow-lg">{game.name}</h1>
                        <div className="flex gap-2">
                            {game.genres?.map(g => (
                                <span key={g.id} className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-sm text-purple-300 backdrop-blur-sm">
                                    {g.description}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-xl">
                    <h3 className="text-2xl font-bold mb-6 text-purple-400">About the Game</h3>
                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: game.short_description }} />
                </div>
                
                <div className="bg-gray-900/50 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-xl">
                    <h3 className="text-2xl font-bold mb-6 text-blue-400">System Requirements</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg text-gray-200 border-b border-gray-700 pb-2">Minimum</h4>
                            <div className="text-sm text-gray-400 space-y-2" dangerouslySetInnerHTML={{ __html: game.pc_requirements?.minimum || 'Not specified' }} />
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-bold text-lg text-gray-200 border-b border-gray-700 pb-2">Recommended</h4>
                            <div className="text-sm text-gray-400 space-y-2" dangerouslySetInnerHTML={{ __html: game.pc_requirements?.recommended || 'Not specified' }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar / Checker */}
            <div className="space-y-6">
                <div className="bg-gray-900/80 backdrop-blur-xl p-6 rounded-2xl border border-gray-700 shadow-[0_0_30px_rgba(168,85,247,0.15)] sticky top-24">
                    <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                        Can You Run It?
                    </h2>
                    
                    <SystemDetector onSpecsDetected={handleCheck} />
                    
                    <div className="mt-8 pt-8 border-t border-gray-700">
                        <h3 className="font-bold mb-3 text-white">Precise Analysis</h3>
                        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                            For the most accurate results, use our local hardware scanner.
                        </p>
                        
                        <a 
                            href="/scanner.exe" 
                            download="scanner.exe" 
                            className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-center font-bold py-3 px-4 rounded-xl transition shadow-lg mb-4"
                        >
                            Download Scanner (EXE)
                        </a>
                        
                        <div className="relative group">
                            <input 
                                type="text" 
                                placeholder="Enter Report ID" 
                                className="w-full p-3 pr-20 rounded-xl bg-black/40 border border-gray-600 text-white text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                                id="reportIdInput"
                                defaultValue={localStorage.getItem('steam_check_report_id') || ''}
                            />
                            <button 
                                onClick={async () => {
                                    const reportId = document.getElementById('reportIdInput').value;
                                    if (!reportId) return;
                                    try {
                                        const res = await checkCompatibility(id, { reportId }); 
                                        setResult(res.data);
                                    } catch (e) {
                                        console.error(e);
                                        alert('Failed to load report or check compatibility');
                                    }
                                }}
                                className="absolute right-1 top-1 bottom-1 bg-gray-700 hover:bg-green-600 text-white font-bold px-4 rounded-lg text-xs transition-colors"
                            >
                                Load
                            </button>
                        </div>
                    </div>

                    {result && (
                        <div className="mt-8 animate-fade-in-up">
                            <CompatibilityResult result={result} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GameDetails;
