import React, { useContext, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { IDEContext } from '../../context/ideContext';
import { toast } from 'react-toastify';
import {
    FiCode,
    FiFileText,
    FiArrowRight,
    FiSave,
    FiCircle,
    FiX,
    FiMaximize2,
    FiCopy,
    FiCheck,
    FiToggleLeft,
    FiToggleRight
} from 'react-icons/fi';

const CodeEditor = ({ onCodeChange }) => {
    const { currentFile, updateFileContent, theme, setCurrentFile } = useContext(IDEContext);
    const [openTabs, setOpenTabs] = useState([]);
    const [activeTabId, setActiveTabId] = useState(null);
    const [tabContents, setTabContents] = useState({});
    const [hasChanges, setHasChanges] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [lineCount, setLineCount] = useState(0);
    const [copied, setCopied] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [autoSave, setAutoSave] = useState(true);
    const [dragOver, setDragOver] = useState(false);
    const autoSaveTimerRef = React.useRef({});

    // Add file to tabs when clicked
    useEffect(() => {
        if (currentFile && currentFile.type === 'file') {
            const existingTab = openTabs.find(tab => tab.fileId === currentFile.fileId);

            if (!existingTab) {
                // Add new tab
                setOpenTabs(prev => [...prev, currentFile]);
                setTabContents(prev => ({
                    ...prev,
                    [currentFile.fileId]: currentFile.content || ''
                }));
            }

            setActiveTabId(currentFile.fileId);
            setLineCount(currentFile.content ? currentFile.content.split('\n').length : 0);
        }
    }, [currentFile]);

    // Keyboard shortcut for save (Cmd+S / Ctrl+S)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                if (activeTabId) {
                    handleSave(activeTabId);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeTabId, hasChanges, tabContents]);

    // Auto-save functionality
    useEffect(() => {
        if (autoSave && activeTabId && hasChanges[activeTabId]) {
            // Clear existing timer for this tab
            if (autoSaveTimerRef.current[activeTabId]) {
                clearTimeout(autoSaveTimerRef.current[activeTabId]);
            }

            // Set new timer for 2 seconds after last change
            autoSaveTimerRef.current[activeTabId] = setTimeout(() => {
                handleSave(activeTabId);
            }, 2000);
        }

        return () => {
            Object.values(autoSaveTimerRef.current).forEach(timer => {
                if (timer) clearTimeout(timer);
            });
        };
    }, [tabContents, hasChanges, autoSave, activeTabId]);

    const handleEditorChange = (value) => {
        if (activeTabId) {
            setTabContents(prev => ({
                ...prev,
                [activeTabId]: value
            }));
            setHasChanges(prev => ({
                ...prev,
                [activeTabId]: true
            }));
            setLineCount(value ? value.split('\n').length : 0);

            // Send live code to preview in real-time
            if (onCodeChange) {
                onCodeChange(value);
            }
        }
    };

    const handleSave = async (fileId) => {
        const tab = openTabs.find(t => t.fileId === fileId);
        if (!tab || !hasChanges[fileId]) {
            return;
        }

        try {
            setIsSaving(true);
            await updateFileContent(fileId, tabContents[fileId]);
            setHasChanges(prev => ({
                ...prev,
                [fileId]: false
            }));
            setLastSaved(new Date());
            // toast.success('File saved successfully');
        } catch (err) {
            toast.error('Failed to save file');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCloseTab = (fileId, e) => {
        e.stopPropagation();

        if (hasChanges[fileId]) {
            if (!window.confirm('You have unsaved changes. Close anyway?')) {
                return;
            }
        }

        setOpenTabs(prev => prev.filter(tab => tab.fileId !== fileId));
        setTabContents(prev => {
            const newContents = { ...prev };
            delete newContents[fileId];
            return newContents;
        });
        setHasChanges(prev => {
            const newChanges = { ...prev };
            delete newChanges[fileId];
            return newChanges;
        });

        // Switch to another tab if closing active tab
        if (activeTabId === fileId) {
            const remainingTabs = openTabs.filter(tab => tab.fileId !== fileId);
            if (remainingTabs.length > 0) {
                const newActiveTab = remainingTabs[remainingTabs.length - 1];
                setActiveTabId(newActiveTab.fileId);
                setCurrentFile(newActiveTab);
            } else {
                setActiveTabId(null);
            }
        }
    };

    const handleTabClick = (tab) => {
        setActiveTabId(tab.fileId);
        setCurrentFile(tab);
    };

    const handleCopyCode = () => {
        if (activeTabId && tabContents[activeTabId]) {
            navigator.clipboard.writeText(tabContents[activeTabId]);
            setCopied(true);
            toast.success('Code copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Drag and drop handlers
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragOver(false);

        try {
            const fileData = e.dataTransfer.getData('application/json');
            if (fileData) {
                const file = JSON.parse(fileData);
                if (file.type === 'file') {
                    setCurrentFile(file);
                }
            }
        } catch (err) {
            console.error('Drop error:', err);
        }
    };

    const getFileIcon = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        const iconMap = {
            js: '📄',
            jsx: '⚛️',
            ts: '📘',
            tsx: '⚛️',
            json: '📋',
            html: '🌐',
            css: '🎨',
            scss: '🎨',
            py: '🐍',
            md: '📝',
        };
        return iconMap[ext] || '📄';
    };

    const getLanguageFromExtension = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        const languageMap = {
            js: 'javascript',
            jsx: 'javascript',
            ts: 'typescript',
            tsx: 'typescript',
            json: 'json',
            html: 'html',
            css: 'css',
            scss: 'scss',
            py: 'python',
            md: 'markdown',
        };
        return languageMap[ext] || 'javascript';
    };

    // Empty state with drag and drop
    if (openTabs.length === 0) {
        return (
            <div
                className={`h-full flex flex-col items-center justify-center transition-all ${theme === 'dark'
                        ? dragOver ? 'bg-gray-800/60 border-2 border-dashed border-gray-500' : 'bg-gradient-to-br from-gray-900 via-gray-900 to-black'
                        : dragOver ? 'bg-blue-50 border-2 border-dashed border-blue-500' : 'bg-white'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div className="text-center max-w-lg">
                    <div className="mb-8 flex justify-center">
                        <div className="relative">
                            <FiCode size={80} className={theme === 'dark' ? 'text-gray-700' : 'text-gray-300'} strokeWidth={1} />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 bg-gray-500/10 rounded-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                    <h2 className={`text-2xl font-semibold mb-3 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                        {dragOver ? 'Drop file here' : 'Ready to Code'}
                    </h2>
                    <p className={`text-sm mb-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        {dragOver ? 'Release to open file' : 'Click or drag files from the explorer to start editing'}
                    </p>
                    {!dragOver && (
                        <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
                            <div className={`flex items-start gap-3 text-left p-4 rounded-lg border ${theme === 'dark'
                                    ? 'bg-gray-800/50 border-gray-700'
                                    : 'bg-gray-50 border-gray-200'
                                }`}>
                                <div className="mt-0.5">
                                    <FiFileText size={16} className="text-blue-400" />
                                </div>
                                <div>
                                    <div className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                        }`}>
                                        Click or Drag Files
                                    </div>
                                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        Click files to open or drag them here
                                    </div>
                                </div>
                            </div>
                            <div className={`flex items-start gap-3 text-left p-4 rounded-lg border ${theme === 'dark'
                                ? 'bg-gray-800/50 border-gray-700'
                                : 'bg-gray-50 border-gray-200'
                                }`}>
                                <div className="mt-0.5">
                                    <FiSave size={16} className="text-green-400" />
                                </div>
                                <div>
                                    <div className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                        }`}>
                                        Quick Save
                                    </div>
                                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        Press <kbd className={`px-1.5 py-0.5 border rounded text-xs font-mono ${theme === 'dark'
                                            ? 'bg-gray-900 border-gray-700'
                                            : 'bg-white border-gray-300'
                                            }`}>⌘S</kbd> to save changes
                                    </div>
                                </div>
                            </div>
                            <div className={`flex items-start gap-3 text-left p-4 rounded-lg border ${theme === 'dark'
                                ? 'bg-gray-800/50 border-gray-700'
                                : 'bg-gray-50 border-gray-200'
                                }`}>
                                <div className="mt-0.5">
                                    <FiArrowRight size={16} className="text-purple-400" />
                                </div>
                                <div>
                                    <div className={`text-sm font-medium mb-1 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                        }`}>
                                        Multiple Tabs
                                    </div>
                                    <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        Open multiple files in tabs
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const activeTab = openTabs.find(tab => tab.fileId === activeTabId);

    if (!activeTab) {
        return null;
    }

    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-gray-900 to-black">
            {/* Tab Bar */}
            <div className="flex items-center bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 overflow-x-auto">
                {openTabs.map(tab => (
                    <div
                        key={tab.fileId}
                        onClick={() => handleTabClick(tab)}
                        className={`flex items-center gap-2 px-4 py-2 cursor-pointer border-r border-gray-700 min-w-0 ${activeTabId === tab.fileId
                            ? 'bg-gray-800/50 text-gray-100'
                            : 'bg-gray-900/30 text-gray-400 hover:bg-gray-800/30'
                            }`}
                    >
                        <span className="text-sm">{getFileIcon(tab.name)}</span>
                        <span className="text-xs truncate max-w-[120px]">{tab.name}</span>
                        {hasChanges[tab.fileId] && (
                            <FiCircle size={6} className="fill-current text-orange-400" />
                        )}
                        <button
                            onClick={(e) => handleCloseTab(tab.fileId, e)}
                            className="ml-1 p-0.5 hover:bg-gray-700/50 rounded"
                        >
                            <FiX size={14} />
                        </button>
                    </div>
                ))}
            </div>

            {/* Professional Editor Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
                {/* Left Section - File Info */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-lg">{getFileIcon(activeTab.name)}</span>
                    <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium text-gray-200 truncate">
                            {activeTab.name}
                        </span>
                        {hasChanges[activeTabId] && (
                            <div className="flex items-center gap-1">
                                <FiCircle size={6} className="fill-current text-orange-400" />
                            </div>
                        )}
                    </div>
                    <div className="h-4 w-px bg-gray-700"></div>
                    <span className="text-xs text-gray-400 uppercase font-mono">
                        {getLanguageFromExtension(activeTab.name)}
                    </span>
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-2">
                    {/* Auto-save Toggle */}
                    <button
                        onClick={() => setAutoSave(!autoSave)}
                        className={`p-2 rounded-md transition-colors flex items-center gap-1.5 ${autoSave
                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                            : 'text-gray-500 hover:bg-gray-700/50'
                            }`}
                        title={autoSave ? 'Auto-save enabled (2s delay)' : 'Auto-save disabled'}
                    >
                        {autoSave ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                        <span className="text-xs">Auto</span>
                    </button>

                    {/* Copy Button */}
                    <button
                        onClick={handleCopyCode}
                        className="p-2 hover:bg-gray-700/50 rounded-md transition-colors text-gray-200"
                        title="Copy code"
                    >
                        {copied ? (
                            <FiCheck size={14} className="text-green-400" />
                        ) : (
                            <FiCopy size={14} />
                        )}
                    </button>

                    {/* Save Button */}
                    <button
                        onClick={() => handleSave(activeTabId)}
                        disabled={!hasChanges[activeTabId] || isSaving}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${hasChanges[activeTabId] && !isSaving
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                            : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                            }`}
                        title={hasChanges[activeTabId] ? 'Save (⌘S)' : 'No changes'}
                    >
                        {isSaving ? (
                            <>
                                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <FiSave size={12} />
                                <span>Save</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-1 bg-gray-700/50 border-b border-gray-700 text-xs">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-gray-200">
                        <span className="font-medium">{lineCount}</span>
                        <span>lines</span>
                    </div>
                    {tabContents[activeTabId] && (
                        <div className="flex items-center gap-1.5 text-gray-200">
                            <span className="font-medium">{tabContents[activeTabId].length}</span>
                            <span>chars</span>
                        </div>
                    )}
                    {hasChanges[activeTabId] && !autoSave && (
                        <div className="flex items-center gap-1.5 text-orange-300">
                            <FiCircle size={6} className="fill-current" />
                            <span className="font-medium">Unsaved</span>
                        </div>
                    )}
                    {autoSave && hasChanges[activeTabId] && (
                        <div className="flex items-center gap-1.5 text-yellow-300">
                            <span className="font-medium">Auto-saving...</span>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {lastSaved && !hasChanges[activeTabId] && (
                        <div className="flex items-center gap-1.5 text-green-300">
                            <FiCheck size={12} />
                            <span>Saved {lastSaved.toLocaleTimeString()}</span>
                        </div>
                    )}
                    <div className="text-gray-300">
                        UTF-8
                    </div>
                    <div className="text-gray-300">
                        LF
                    </div>
                </div>
            </div>

            {/* Editor */}
            <div className="flex-1 relative">
                <Editor
                    height="100%"
                    defaultLanguage={getLanguageFromExtension(activeTab.name)}
                    language={getLanguageFromExtension(activeTab.name)}
                    value={tabContents[activeTabId] || ''}
                    onChange={handleEditorChange}
                    theme={theme === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                        minimap: {
                            enabled: true,
                            size: 'fit',
                            showSlider: 'mouseover'
                        },
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 2,
                        fontSize: 14,
                        fontFamily: "'Fira Code', 'JetBrains Mono', 'Cascadia Code', 'Consolas', monospace",
                        fontLigatures: true,
                        cursorBlinking: 'smooth',
                        cursorSmoothCaretAnimation: 'on',
                        smoothScrolling: true,
                        bracketPairColorization: { enabled: true },
                        guides: {
                            bracketPairs: true,
                            indentation: true
                        },
                        padding: { top: 16, bottom: 16 },
                        renderLineHighlight: 'all',
                        scrollbar: {
                            verticalScrollbarSize: 10,
                            horizontalScrollbarSize: 10,
                            useShadows: false,
                        },
                        suggest: {
                            showKeywords: true,
                            showSnippets: true,
                        },
                        quickSuggestions: {
                            other: true,
                            comments: false,
                            strings: true
                        },
                        wordWrap: 'off',
                        formatOnPaste: true,
                        formatOnType: true,
                        autoClosingBrackets: 'always',
                        autoClosingQuotes: 'always',
                        renderWhitespace: 'selection',
                    }}
                />
            </div>
        </div>
    );
};

export default CodeEditor;
