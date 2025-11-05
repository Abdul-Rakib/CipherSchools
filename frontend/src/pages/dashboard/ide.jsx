import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IDEContext } from '../../context/ideContext';
import FileExplorer from '../../components/ide/FileExplorer';
import CodeEditor from '../../components/ide/CodeEditor';
import Preview from '../../components/ide/Preview';
import IDETopBar from '../../components/ide/IDETopBar';
import { IDELoadingScreen, IDEErrorScreen } from '../../components/ide/IDEScreens';
import { FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useResizablePanel } from '../../hooks/useResizablePanel';
import { buildFilePathForSync } from '../../utils/filePathSync';

const IDE = () => {
    const { projectId } = useParams();
    const navigate = useNavigate();
    const { fetchProject, currentProject, updateProject, theme, toggleTheme, loading, error, files, currentFile } =
        useContext(IDEContext);
    const [isRenaming, setIsRenaming] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [editorCode, setEditorCode] = useState('');
    const [currentFileName, setCurrentFileName] = useState('');

    // Resizable panels using custom hook
    const explorerPanel = useResizablePanel(256, { minWidth: 200, maxWidth: 600 });
    const previewPanel = useResizablePanel(500, { minWidth: 200, maxWidth: 1400, fromRight: true });
    
    const [isExplorerMinimized, setIsExplorerMinimized] = useState(false);
    const [explorerWidthBeforeMinimize, setExplorerWidthBeforeMinimize] = useState(256);
    const containerRef = useRef(null);

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

    const toggleExplorerMinimize = () => {
        if (isExplorerMinimized) {
            // Maximize
            explorerPanel.setWidth(explorerWidthBeforeMinimize);
            setIsExplorerMinimized(false);
        } else {
            // Minimize
            setExplorerWidthBeforeMinimize(explorerPanel.width);
            explorerPanel.setWidth(0);
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

    // Add global mouse event listeners for explorer panel
    useEffect(() => {
        const handleMouseMove = (e) => {
            e.preventDefault();
            e.stopPropagation();
            explorerPanel.handleMouseMove(e);
        };
        const handleMouseUp = (e) => {
            e.preventDefault();
            e.stopPropagation();
            explorerPanel.handleMouseUp();
        };

        if (explorerPanel.isDragging) {
            window.addEventListener('mousemove', handleMouseMove, true);
            window.addEventListener('mouseup', handleMouseUp, true);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';

            return () => {
                window.removeEventListener('mousemove', handleMouseMove, true);
                window.removeEventListener('mouseup', handleMouseUp, true);
            };
        }
    }, [explorerPanel.isDragging, explorerPanel.handleMouseMove, explorerPanel.handleMouseUp]);

    // Add global mouse event listeners for preview panel
    useEffect(() => {
        const handleMouseMove = (e) => {
            e.preventDefault();
            e.stopPropagation();
            previewPanel.handleMouseMove(e);
        };
        const handleMouseUp = (e) => {
            e.preventDefault();
            e.stopPropagation();
            previewPanel.handleMouseUp();
        };

        if (previewPanel.isDragging) {
            window.addEventListener('mousemove', handleMouseMove, true);
            window.addEventListener('mouseup', handleMouseUp, true);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';

            return () => {
                window.removeEventListener('mousemove', handleMouseMove, true);
                window.removeEventListener('mouseup', handleMouseUp, true);
            };
        }
    }, [previewPanel.isDragging, previewPanel.handleMouseMove, previewPanel.handleMouseUp]);

    if (loading) {
        return <IDELoadingScreen />;
    }

    if (!currentProject) {
        return <IDEErrorScreen onAction={() => navigate('/dashboard')} />;
    }

    return (
        <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-black' : 'bg-white'
            }`}>
            {/* VS Code Style Top Bar */}
            <IDETopBar
                onBack={() => navigate('/dashboard')}
                projectName={projectName}
                isRenaming={isRenaming}
                onRename={handleRenameProject}
                onCancelRename={() => {
                    setIsRenaming(false);
                    setProjectName(currentProject.name);
                }}
                onNameChange={(e) => setProjectName(e.target.value)}
                onStartRename={() => setIsRenaming(true)}
                onToggleTheme={toggleTheme}
                theme={theme}
            />

            {/* Main Content - Dark Theme Layout */}
            <div ref={containerRef} className={`flex-1 flex overflow-hidden relative ${theme === 'dark' ? 'bg-[#1e1e1e]' : 'bg-white'
                }`}>
                {/* Dragging Overlay - blocks all pointer events from iframe */}
                {(explorerPanel.isDragging || previewPanel.isDragging) && (
                    <div className="absolute inset-0 z-50" style={{ cursor: 'col-resize' }} />
                )}

                {/* File Explorer */}
                <div
                    className="overflow-hidden flex-shrink-0 flex flex-col relative"
                    style={{ width: `${explorerPanel.width}px` }}
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
                        onMouseDown={explorerPanel.handleMouseDown}
                        className={`w-1 cursor-col-resize flex-shrink-0 transition-colors relative z-10 ${explorerPanel.isDragging
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
                    onMouseDown={previewPanel.handleMouseDown}
                    className={`w-1 cursor-col-resize flex-shrink-0 transition-colors relative z-10 ${previewPanel.isDragging
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
                    style={{ width: `${previewPanel.width}px` }}
                >
                    <Preview editorCode={editorCode} currentFileName={currentFileName} />
                </div>
            </div>
        </div>
    );
};

export default IDE;
