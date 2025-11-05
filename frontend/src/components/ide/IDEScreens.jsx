import React from 'react';

const IDELoadingScreen = ({ message = 'Loading project...' }) => {
    return (
        <div className="h-screen flex items-center justify-center bg-[#1e1e1e]">
            <div className="text-center">
                <div className="inline-block">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#3e3e42] border-t-[#007acc] mb-4"></div>
                </div>
                <p className="text-sm text-[#858585]">{message}</p>
            </div>
        </div>
    );
};

/**
 * Error/Not Found screen for IDE
 * 
 * @param {string} message - Error message to display
 * @param {string} buttonText - Action button text
 * @param {Function} onAction - Action button handler
 */
const IDEErrorScreen = ({ 
    message = 'Project not found', 
    buttonText = 'Go to Dashboard',
    onAction 
}) => {
    return (
        <div className="h-screen flex items-center justify-center bg-[#1e1e1e]">
            <div className="text-center bg-[#2d2d30] p-8 rounded-lg border border-[#3e3e42]">
                <p className="text-[#cccccc] mb-6">{message}</p>
                <button
                    onClick={onAction}
                    className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
};

export { IDELoadingScreen, IDEErrorScreen };
