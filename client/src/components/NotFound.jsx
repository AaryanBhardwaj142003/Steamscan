import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in relative">
            <h1 className="text-9xl font-bold text-purple-600/20 select-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                404
            </h1>
            <div className="relative z-10">
                <h2 className="text-4xl font-bold text-white mb-4">Page Not Found</h2>
                <p className="text-gray-400 max-w-md mb-8 mx-auto">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <Link 
                    to="/" 
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-bold transition shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
