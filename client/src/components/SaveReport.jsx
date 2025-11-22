import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SaveReport = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            localStorage.setItem('steam_check_report_id', id);
            // Redirect to home or show success
            setTimeout(() => {
                navigate('/');
            }, 1500);
        }
    }, [id, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(34,197,94,0.5)]">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">System Report Saved!</h2>
            <p className="text-gray-400">Your hardware specs have been linked.</p>
            <p className="text-sm text-gray-500 mt-4">Redirecting you to home...</p>
        </div>
    );
};

export default SaveReport;
