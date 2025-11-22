import React, { useState, useEffect } from 'react';

const SystemDetector = ({ onSpecsDetected }) => {
    const [specs, setSpecs] = useState(null);
    const [loading, setLoading] = useState(false);

    const detectSpecs = () => {
        setLoading(true);
        // Browser detection estimates
        const browserSpecs = {
            os: navigator.platform,
            cpu: {
                cores: navigator.hardwareConcurrency || 'Unknown',
                brand: 'Unknown (Browser estimate)'
            },
            ram: {
                total: navigator.deviceMemory || 'Unknown', // Only works in Chrome/Edge, returns approx GB
                type: 'Unknown'
            },
            gpu: {
                model: 'Unknown',
                vram: 'Unknown'
            }
        };

        // Try to get GPU info via WebGL
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    browserSpecs.gpu.model = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                }
            }
        } catch (e) {
            console.error("WebGL detection failed", e);
        }

        setTimeout(() => {
            setSpecs(browserSpecs);
            setLoading(false);
            if (onSpecsDetected) onSpecsDetected(browserSpecs);
        }, 1000);
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md text-white">
            <h3 className="text-xl font-bold mb-2">System Detection</h3>
            <p className="text-sm text-gray-400 mb-4">
                We can estimate your system specs using your browser. For precise results, use our local helper tool.
            </p>
            
            {!specs && (
                <button 
                    onClick={detectSpecs} 
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    {loading ? 'Detecting...' : 'Detect via Browser'}
                </button>
            )}

            {specs && (
                <div className="mt-4 space-y-2">
                    <p><strong>OS:</strong> {specs.os}</p>
                    <p><strong>CPU Cores:</strong> {specs.cpu.cores}</p>
                    <p><strong>RAM (Est):</strong> {specs.ram.total} GB</p>
                    <p><strong>GPU:</strong> {specs.gpu.model}</p>
                    <div className="mt-2 text-yellow-400 text-xs">
                        * Browser estimates are not 100% accurate.
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemDetector;
