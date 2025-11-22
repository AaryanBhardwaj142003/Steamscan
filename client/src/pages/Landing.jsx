import React from 'react';
import { Link } from 'react-router-dom';

const popularGames = [
    1245620, // Elden Ring
    1091500, // Cyberpunk 2077
    1086940, // Baldur's Gate 3
    1716740, // Starfield
    990080,  // Hogwarts Legacy
    271590,  // GTA V
    1174180, // RDR2
    1172470, // Apex Legends
    570,     // Dota 2
    730,     // CS2
];

const Landing = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] relative overflow-hidden">
            {/* Hero Section */}
            <div className="text-center z-10 px-4 animate-fade-in-up">
                <h1 className="text-7xl md:text-9xl font-black mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.6)] tracking-tighter select-none">
                    LEVEL UP
                </h1>
                <p className="text-2xl md:text-3xl text-gray-300 max-w-3xl mx-auto font-light mb-12 leading-relaxed">
                    Don't guess. <span className="text-white font-bold">Know.</span> Check if your PC can handle the latest titles instantly.
                </p>
                
                <Link 
                    to="/search" 
                    className="inline-block px-12 py-5 bg-white text-black font-black text-xl rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.5)] transition-all duration-300 uppercase tracking-widest"
                >
                    Start Checking
                </Link>
            </div>

            {/* Marquee Section */}
            <div className="absolute bottom-0 left-0 w-full py-12 bg-gradient-to-t from-black via-black/80 to-transparent z-0">
                <div className="flex overflow-hidden relative w-full">
                    <div className="flex animate-marquee whitespace-nowrap">
                        {/* Duplicate list for seamless loop */}
                        {[...popularGames, ...popularGames].map((id, index) => (
                            <div key={index} className="mx-4 w-64 h-36 rounded-xl overflow-hidden shadow-2xl border border-white/10 transform hover:scale-110 transition-transform duration-300">
                                <img 
                                    src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${id}/header.jpg`} 
                                    alt="Game Cover" 
                                    className="w-full h-full object-cover opacity-80 hover:opacity-100"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
