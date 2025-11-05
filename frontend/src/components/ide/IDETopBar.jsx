import React from 'react';
import { FiArrowLeft, FiSun, FiMoon, FiCode, FiSave } from 'react-icons/fi';

const IDETopBar = ({
    onBack,
    projectName,
    isRenaming,
    onRename,
    onCancelRename,
    onNameChange,
    onStartRename,
    onToggleTheme,
    theme
}) => {
    return (
        <div className={`border-b px-4 py-2.5 flex items-center justify-between ${
            theme === 'dark'
                ? 'bg-gray-900/50 border-gray-800 backdrop-blur-sm'
                : 'bg-gray-100 border-gray-300'
        }`}>
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className={`p-2 rounded-md transition-colors ${
                        theme === 'dark'
                            ? 'hover:bg-[#3e3e42] text-[#cccccc]'
                            : 'hover:bg-gray-200 text-gray-700'
                    }`}
                    title="Back to dashboard"
                >
                    <FiArrowLeft size={18} />
                </button>

                <div className={`h-5 w-px ${
                    theme === 'dark' ? 'bg-[#3e3e42]' : 'bg-gray-300'
                }`}></div>

                <div className="flex items-center gap-3">
                    <FiCode 
                        size={16} 
                        className={theme === 'dark' ? 'text-[#858585]' : 'text-gray-600'} 
                    />
                    {isRenaming ? (
                        <div className="flex gap-2">
                            <input
                                autoFocus
                                value={projectName}
                                onChange={onNameChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') onRename();
                                    if (e.key === 'Escape') onCancelRename();
                                }}
                                className={`px-3 py-1 rounded border text-sm focus:outline-none focus:ring-1 ${
                                    theme === 'dark'
                                        ? 'border-[#007acc] bg-[#1e1e1e] text-[#cccccc] focus:ring-[#007acc]'
                                        : 'border-blue-500 bg-white text-gray-900 focus:ring-blue-500'
                                }`}
                            />
                            <button
                                onClick={onRename}
                                className="px-3 py-1 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded text-sm font-medium transition-colors"
                            >
                                <FiSave size={14} />
                            </button>
                        </div>
                    ) : (
                        <h1
                            onClick={onStartRename}
                            className={`text-base font-medium cursor-pointer transition-colors ${
                                theme === 'dark'
                                    ? 'text-[#cccccc] hover:text-white'
                                    : 'text-gray-800 hover:text-gray-900'
                            }`}
                        >
                            {projectName}
                        </h1>
                    )}
                </div>
            </div>

            <button
                onClick={onToggleTheme}
                className="p-2 hover:bg-[#3e3e42] rounded-md transition-colors text-[#cccccc]"
                title="Toggle theme"
            >
                {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>
        </div>
    );
};

export default IDETopBar;
