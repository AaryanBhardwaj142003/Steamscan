import React from 'react';

const CompatibilityResult = ({ result }) => {
    if (!result) return null;

    const { suitable, reason, details } = result;

    let colorClass = 'bg-gray-700';
    let textClass = 'text-white';
    let statusText = 'Unknown';

    if (suitable === 'suitable') {
        colorClass = 'bg-green-600';
        statusText = 'Suitable';
    } else if (suitable === 'borderline') {
        colorClass = 'bg-yellow-600';
        statusText = 'Borderline';
    } else if (suitable === 'not suitable') {
        colorClass = 'bg-red-600';
        statusText = 'Not Suitable';
    }

    return (
        <div className={`p-6 rounded-2xl shadow-xl ${colorClass} ${textClass} mt-6 animate-fade-in-up border border-white/10`}>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-3xl font-bold tracking-tight">{statusText}</h2>
                <div className="text-4xl opacity-50">
                    {suitable === 'suitable' ? '✓' : suitable === 'not suitable' ? '✗' : '?'}
                </div>
            </div>
            
            <div className="space-y-2 mb-6">
                {reason && reason.length > 0 ? (
                    <ul className="space-y-1">
                        {reason.map((r, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full flex-shrink-0"></span>
                                <span>{r}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="font-medium opacity-90">Your system meets the minimum requirements!</p>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'CPU', data: details.cpu },
                    { label: 'RAM', data: details.ram },
                    { label: 'GPU', data: details.gpu },
                    { label: 'Storage', data: details.storage }
                ].map((item) => (
                    <div key={item.label} className={`p-4 rounded-xl backdrop-blur-sm border border-white/10 ${
                        item.data.status === 'fail' ? 'bg-red-900/50' : 
                        item.data.status === 'pass' ? 'bg-green-900/50' : 'bg-black/20'
                    }`}>
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold text-lg">{item.label}</span>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase ${
                                item.data.status === 'fail' ? 'bg-red-500 text-white' : 
                                item.data.status === 'pass' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
                            }`}>
                                {item.data.status}
                            </span>
                        </div>
                        <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="opacity-60">You:</span>
                                <span className="font-mono truncate max-w-[120px]" title={item.data.user}>{item.data.user}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="opacity-60">Need:</span>
                                <span className="font-mono truncate max-w-[120px]" title={item.data.required}>{item.data.required}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {result.estimatedSettings && (
                <div className="mt-6 p-4 bg-purple-900/30 border border-purple-500/30 rounded-xl text-center">
                    <h3 className="text-purple-300 font-bold mb-1 uppercase text-sm tracking-wider">Estimated Performance</h3>
                    <p className="text-2xl font-bold text-white">{result.estimatedSettings}</p>
                </div>
            )}
        </div>
    );
};

export default CompatibilityResult;
