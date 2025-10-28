import React, { useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IDEContext } from '../../context/ideContext';
import FileExplorer from '../../components/ide/FileExplorer';
import CodeEditor from '../../components/ide/CodeEditor';
import Preview from '../../components/ide/Preview';
import { FiArrowLeft, FiMoon, FiSun, FiSave, FiCode, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';

const IDE = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { fetchProject, currentProject, updateProject, theme, toggleTheme, loading, error, files, currentFile } =
        useContext(IDEContext);
    const [isRenaming, setIsRenaming] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [editorCode, setEditorCode] = useState('');
    const [currentFileName, setCurrentFileName] = useState('');

    // Resizable panel state
    const [explorerWidth, setExplorerWidth] = useState(256); // 16rem = 256px
    const [previewWidth, setPreviewWidth] = useState(500); // in pixels
    const [isDraggingExplorer, setIsDraggingExplorer] = useState(false);
    const [isDraggingPreview, setIsDraggingPreview] = useState(false);
    const [isExplorerMinimized, setIsExplorerMinimized] = useState(false);
    const [explorerWidthBeforeMinimize, setExplorerWidthBeforeMinimize] = useState(256);

    // Use refs to track dragging state
    const isDraggingExplorerRef = useRef(false);
    const isDraggingPreviewRef = useRef(false);
    const containerRef = useRef(null);

    useEffect(() => {
        isDraggingExplorerRef.current = isDraggingExplorer;
    }, [isDraggingExplorer]);

    useEffect(() => {
        isDraggingPreviewRef.current = isDraggingPreview;
    }, [isDraggingPreview]);

    useEffect(() => {
        if (projectId) {
            fetchProject(projectId);
        }
    }, [projectId, fetchProject]);

    useEffect(() => {
        if (currentProject) {
            setProjectName(currentProject.name);
        }
    }, [currentProject]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    // Update current file name for Preview synchronization
    useEffect(() => {
        if (currentFile && currentFile.type === 'file') {
            const fileName = buildFilePathForSync(currentFile.fileId, files);
            setCurrentFileName(fileName);
            setEditorCode(currentFile.content || '');
        }
    }, [currentFile, files]);

    // Handle real-time code changes from editor
    const handleCodeChange = (code) => {
        setEditorCode(code);
    };

    // Helper function to build file path (excluding root folder)
    const buildFilePathForSync = (fileId, filesList) => {
        const file = filesList.find(f => f.fileId === fileId);
        if (!file) return '';

        // Find root folder (parentId === null)
        let current = file;
        const pathParts = [file.name];

        while (current.parentId !== null) {
            const parent = filesList.find(f => f.fileId === current.parentId);
            if (!parent) break;

            // Stop if we've reached the root folder (parentId === null)
            if (parent.parentId === null) {
                break;
            }

            pathParts.unshift(parent.name);
            current = parent;
        }

        return pathParts.join('/');
    };

    const toggleExplorerMinimize = () => {
        if (isExplorerMinimized) {
            // Maximize
            setExplorerWidth(explorerWidthBeforeMinimize);
            setIsExplorerMinimized(false);
        } else {
            // Minimize
            setExplorerWidthBeforeMinimize(explorerWidth);
            setExplorerWidth(0);
            setIsExplorerMinimized(true);
        }
    };

    const handleRenameProject = async () => {
        if (!projectName.trim()) {
            toast.error('Project name cannot be empty');
            return;
        }

        try {
            await updateProject(projectId, projectName, currentProject.description);
            toast.success('Project renamed successfully');
            setIsRenaming(false);
        } catch (err) {
            toast.error('Failed to rename project');
        }
    };

    // Resizer handlers for Explorer
    const handleExplorerMouseMove = useCallback((e) => {
        if (isDraggingExplorerRef.current) {
            const newWidth = Math.max(200, Math.min(600, e.clientX));
            setExplorerWidth(newWidth);
        }
    }, []);

    const handleExplorerMouseUp = useCallback(() => {
        if (isDraggingExplorerRef.current) {
            setIsDraggingExplorer(false);
            isDraggingExplorerRef.current = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    }, []);

    const handleExplorerMouseDown = (e) => {
        e.preventDefault();
        setIsDraggingExplorer(true);
        isDraggingExplorerRef.current = true;
    };

    // Resizer handlers for Preview  
    const handlePreviewMouseMove = useCallback((e) => {
        if (isDraggingPreviewRef.current) {
            // Use the SAME approach as Explorer: absolute position
            // For preview on the right side, calculate from the right edge
            const containerWidth = window.innerWidth;
            const distanceFromRight = containerWidth - e.clientX;
            // Apply constraints: min 200px, max 1400px (or 80% of screen)
            const maxWidth = Math.min(1400, containerWidth * 0.8);
            const newWidth = Math.max(200, Math.min(maxWidth, distanceFromRight));
            setPreviewWidth(newWidth);
        }
    }, []);

    const handlePreviewMouseUp = useCallback(() => {
        if (isDraggingPreviewRef.current) {
            setIsDraggingPreview(false);
            isDraggingPreviewRef.current = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    }, []);

    const handlePreviewMouseDown = (e) => {
        e.preventDefault();
        setIsDraggingPreview(true);
        isDraggingPreviewRef.current = true;
    };

    // Add global mouse event listeners
    useEffect(() => {
        const handleMouseMove = (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleExplorerMouseMove(e);
        };
        const handleMouseUp = (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleExplorerMouseUp();
        };

        if (isDraggingExplorer) {
            window.addEventListener('mousemove', handleMouseMove, true);
            window.addEventListener('mouseup', handleMouseUp, true);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';

            return () => {
                window.removeEventListener('mousemove', handleMouseMove, true);
                window.removeEventListener('mouseup', handleMouseUp, true);
            };
        }
    }, [isDraggingExplorer, handleExplorerMouseMove, handleExplorerMouseUp]);

    useEffect(() => {
        const handleMouseMove = (e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePreviewMouseMove(e);
        };
        const handleMouseUp = (e) => {
            e.preventDefault();
            e.stopPropagation();
            handlePreviewMouseUp();
        };

        if (isDraggingPreview) {
            window.addEventListener('mousemove', handleMouseMove, true);
            window.addEventListener('mouseup', handleMouseUp, true);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';

            return () => {
                window.removeEventListener('mousemove', handleMouseMove, true);
                window.removeEventListener('mouseup', handleMouseUp, true);
            };
        }
    }, [isDraggingPreview, handlePreviewMouseMove, handlePreviewMouseUp]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#1e1e1e]">
                <div className="text-center">
                    <div className="inline-block">
                        <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#3e3e42] border-t-[#007acc] mb-4"></div>
                    </div>
                    <p className="text-sm text-[#858585]">Loading project...</p>
                </div>
            </div>
        );
    }

    if (!currentProject) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#1e1e1e]">
                <div className="text-center bg-[#2d2d30] p-8 rounded-lg border border-[#3e3e42]">
                    <p className="text-[#cccccc] mb-6">Project not found</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-[#0e639c] hover:bg-[#1177bb] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-black' : 'bg-white'
            }`}>
            {/* VS Code Style Top Bar */}
            <div className={`border-b px-4 py-2.5 flex items-center justify-between ${theme === 'dark'
                ? 'bg-gray-900/50 border-gray-800 backdrop-blur-sm'
                : 'bg-gray-100 border-gray-300'
                }`}>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className={`p-2 rounded-md transition-colors ${theme === 'dark'
                            ? 'hover:bg-[#3e3e42] text-[#cccccc]'
                            : 'hover:bg-gray-200 text-gray-700'
                            }`}
                        title="Back to dashboard"
                    >
                        <FiArrowLeft size={18} />
                    </button>

                    <div className={`h-5 w-px ${theme === 'dark' ? 'bg-[#3e3e42]' : 'bg-gray-300'
                        }`}></div>

                    <div className="flex items-center gap-3">
                        <FiCode size={16} className={theme === 'dark' ? 'text-[#858585]' : 'text-gray-600'} />
                        {isRenaming ? (
                            <div className="flex gap-2">
                                <input
                                    autoFocus
                                    value={projectName}
                                    onChange={e => setProjectName(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') handleRenameProject();
                                        if (e.key === 'Escape') {
                                            setIsRenaming(false);
                                            setProjectName(currentProject.name);
                                        }
                                    }}
                                    className={`px-3 py-1 rounded border text-sm focus:outline-none focus:ring-1 ${theme === 'dark'
                                        ? 'border-[#007acc] bg-[#1e1e1e] text-[#cccccc] focus:ring-[#007acc]'
                                        : 'border-blue-500 bg-white text-gray-900 focus:ring-blue-500'
                                        }`}
                                />
                                <button
                                    onClick={handleRenameProject}
                                    className="px-3 py-1 bg-[#0e639c] hover:bg-[#1177bb] text-white rounded text-sm font-medium transition-colors"
                                >
                                    <FiSave size={14} />
                                </button>
                            </div>
                        ) : (
                            <h1
                                onClick={() => setIsRenaming(true)}
                                className={`text-base font-medium cursor-pointer transition-colors ${theme === 'dark'
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
                    onClick={toggleTheme}
                    className="p-2 hover:bg-[#3e3e42] rounded-md transition-colors text-[#cccccc]"
                    title="Toggle theme"
                >
                    {theme === 'dark' ? <FiSun size={18} /> : <FiMoon size={18} />}
                </button>
            </div>

            {/* Main Content - Dark Theme Layout */}
            <div ref={containerRef} className={`flex-1 flex overflow-hidden relative ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'
                }`}>
                {/* Dragging Overlay - blocks all pointer events from iframe */}
                {(isDraggingExplorer || isDraggingPreview) && (
                    <div className="absolute inset-0 z-50" style={{ cursor: 'col-resize' }} />
                )}

                {/* File Explorer */}
                <div
                    className="overflow-hidden flex-shrink-0 flex flex-col relative"
                    style={{ width: `${explorerWidth}px` }}
                >
                    <FileExplorer onMinimize={toggleExplorerMinimize} isMinimized={isExplorerMinimized} />
                </div>

                {/* Collapsed Explorer Toggle - visible when minimized */}
                {isExplorerMinimized && (
                    <button
                        onClick={toggleExplorerMinimize}
                        className={`w-10 flex-shrink-0 flex items-center justify-center transition-colors ${theme === 'dark'
                            ? 'bg-gray-800/50 hover:bg-gray-700 border-r border-gray-700'
                            : 'bg-gray-100 hover:bg-gray-200 border-r border-gray-300'
                            }`}
                        title="Expand explorer"
                    >
                        <FiChevronRight size={18} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                    </button>
                )}

                {/* Resizer for Explorer - hidden when minimized */}
                {!isExplorerMinimized && (
                    <div
                        onMouseDown={handleExplorerMouseDown}
                        className={`w-1 cursor-col-resize flex-shrink-0 transition-colors relative z-10 ${isDraggingExplorer
                            ? 'bg-[#007acc]'
                            : theme === 'dark'
                                ? 'bg-[#3e3e42] hover:bg-[#007acc]'
                                : 'bg-gray-300 hover:bg-blue-400'
                            }`}
                        style={{ cursor: 'col-resize' }}
                    />
                )}

                {/* Code Editor */}
                <div className="flex-1 overflow-hidden min-w-0">
                    <CodeEditor onCodeChange={handleCodeChange} />
                </div>

                {/* Resizer for Preview */}
                <div
                    onMouseDown={handlePreviewMouseDown}
                    className={`w-1 cursor-col-resize flex-shrink-0 transition-colors relative z-10 ${isDraggingPreview
                        ? 'bg-[#007acc]'
                        : theme === 'dark'
                            ? 'bg-[#3e3e42] hover:bg-[#007acc]'
                            : 'bg-gray-300 hover:bg-blue-400'
                        }`}
                    style={{ cursor: 'col-resize' }}
                />

                {/* Preview */}
                <div
                    className="relative flex-shrink-0 overflow-hidden"
                    style={{ width: `${previewWidth}px` }}
                >
                    <Preview editorCode={editorCode} currentFileName={currentFileName} />
                </div>
            </div>
        </div>
    );
};

export default IDE;
