import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StarBackground from './StarBackground';

const Layout = ({ children }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
        if (searchTerm.trim()) {
            navigate(`/search?search=${encodeURIComponent(searchTerm)}`);
        }
        }
    };

    return (
        <div className="min-h-screen text-white font-sans relative overflow-hidden">
            <StarBackground />
            
            {/* Navbar */}
            <nav className="bg-black/50 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent hover:opacity-80 transition">
                        SteamCheck
                    </Link>

                    <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4 relative group">
                        <input
                            type="text"
                            placeholder="Search games..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900/80 border border-gray-700 rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </form>

                    <div className="hidden md:flex gap-4">
                        <a href="https://store.steampowered.com" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition">Steam Store</a>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 relative z-10">
                {children}
            </main>
        </div>
    );
};

export default Layout;
