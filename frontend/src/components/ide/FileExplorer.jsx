import React, { useContext, useState } from 'react';
import { IDEContext } from '../../context/ideContext';
import { FiChevronDown, FiChevronRight, FiFile, FiFolder, FiPlus, FiTrash2, FiEdit2, FiX, FiCheck } from 'react-icons/fi';
import { toast } from 'react-toastify';

const FileExplorer = () => {
    const { files, currentFile, setCurrentFile, createFile, deleteFile, renameFile, currentProject, theme } =
        useContext(IDEContext);
    const [expandedFolders, setExpandedFolders] = useState(new Set());
    const [renamingFileId, setRenamingFileId] = useState(null);
    const [newName, setNewName] = useState('');
    const [creatingInParentId, setCreatingInParentId] = useState(null);
    const [createName, setCreateName] = useState('');
    const [showCreateInput, setShowCreateInput] = useState(false);

    const toggleFolder = (folderId) => {
        const newSet = new Set(expandedFolders);
        if (newSet.has(folderId)) {
            newSet.delete(folderId);
        } else {
            newSet.add(folderId);
        }
        setExpandedFolders(newSet);
    };

    const handleCreateFile = async () => {
        if (!createName.trim()) {
            toast.error('Please enter a file name');
            return;
        }

        // Auto-detect type: if name has extension (contains .), it's a file, otherwise folder
        const detectedType = createName.includes('.') ? 'file' : 'folder';

        try {
            await createFile(currentProject.projectId, createName, detectedType, creatingInParentId);
            toast.success(`${detectedType} created successfully`);
            setCreatingInParentId(null);
            setCreateName('');
            setShowCreateInput(false);
        } catch (err) {
            toast.error(err.response?.data?.msg || `Failed to create ${detectedType}`);
        }
    };

    const handleRename = async (fileId) => {
        if (!newName.trim()) {
            toast.error('Please enter a valid name');
            return;
        }

        try {
            await renameFile(fileId, newName);
            toast.success('File renamed successfully');
            setRenamingFileId(null);
            setNewName('');
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to rename file');
        }
    };

    const handleDelete = async (fileId) => {
        if (window.confirm('Are you sure you want to delete this?')) {
            try {
                await deleteFile(fileId);
                toast.success('File deleted successfully');
            } catch (err) {
                toast.error(err.response?.data?.msg || 'Failed to delete file');
            }
        }
    };

    const getChildFiles = (parentId) => {
        return files.filter(f => f.parentId === parentId);
    };

    const renderFileTree = (parentId = null, level = 0) => {
        const children = getChildFiles(parentId);

        return children.map(file => (
            <div key={file.fileId}>
                <div
                    draggable={file.type === 'file'}
                    onDragStart={(e) => {
                        if (file.type === 'file') {
                            e.dataTransfer.setData('application/json', JSON.stringify(file));
                            e.dataTransfer.effectAllowed = 'copy';
                        }
                    }}
                    className={`flex items-center gap-2 px-2 py-1.5 cursor-pointer transition-colors text-sm group/item ${currentFile?.fileId === file.fileId
                        ? theme === 'dark'
                            ? 'bg-[#37373d] text-[#ffffff]'
                            : 'bg-blue-100 text-gray-900'
                        : theme === 'dark'
                            ? 'text-[#cccccc] hover:bg-[#2a2d2e]'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                    style={{ paddingLeft: `${level * 12 + 8}px` }}
                    onClick={() => {
                        if (file.type === 'file') {
                            setCurrentFile(file);
                        } else {
                            // Auto-expand folder on click
                            toggleFolder(file.fileId);
                        }
                    }}
                >
                    {file.type === 'folder' && (
                        <div className="flex-shrink-0">
                            {expandedFolders.has(file.fileId) ? (
                                <FiChevronDown size={14} />
                            ) : (
                                <FiChevronRight size={14} />
                            )}
                        </div>
                    )}
                    {file.type === 'folder' ? (
                        <FiFolder size={14} className={
                            expandedFolders.has(file.fileId)
                                ? theme === 'dark' ? 'text-[#dcb67a]' : 'text-yellow-600'
                                : theme === 'dark' ? 'text-[#858585]' : 'text-gray-500'
                        } />
                    ) : (
                        <FiFile size={14} className={theme === 'dark' ? 'text-[#858585]' : 'text-gray-500'} />
                    )}

                    {renamingFileId === file.fileId ? (
                        <div className="flex-1 flex items-center gap-1" onClick={e => e.stopPropagation()}>
                            <input
                                autoFocus
                                value={newName}
                                onChange={e => setNewName(e.target.value)}
                                onKeyDown={e => {
                                    if (e.key === 'Enter') handleRename(file.fileId);
                                    if (e.key === 'Escape') setRenamingFileId(null);
                                }}
                                className={`flex-1 px-1.5 py-0.5 rounded text-xs border focus:outline-none ${theme === 'dark'
                                    ? 'bg-[#1e1e1e] border-[#007acc] text-[#cccccc]'
                                    : 'bg-white border-blue-500 text-gray-900'
                                    }`}
                            />
                            <button
                                onClick={() => handleRename(file.fileId)}
                                className="p-1 hover:bg-[#2d2d30] rounded"
                            >
                                <FiCheck size={12} className="text-green-400" />
                            </button>
                            <button
                                onClick={() => setRenamingFileId(null)}
                                className="p-1 hover:bg-[#2d2d30] rounded"
                            >
                                <FiX size={12} className="text-red-400" />
                            </button>
                        </div>
                    ) : (
                        <span className="flex-1 text-xs truncate font-mono">{file.name}</span>
                    )}

                    {renamingFileId !== file.fileId && (
                        <div className="flex gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            {file.type === 'folder' && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setCreatingInParentId(file.fileId);
                                    }}
                                    className="p-1 hover:bg-[#2d2d30] rounded"
                                    title="New file/folder"
                                >
                                    <FiPlus size={12} />
                                </button>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setRenamingFileId(file.fileId);
                                    setNewName(file.name);
                                }}
                                className="p-1 hover:bg-[#2d2d30] rounded"
                                title="Rename"
                            >
                                <FiEdit2 size={12} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(file.fileId);
                                }}
                                className="p-1 hover:bg-[#2d2d30] rounded"
                                title="Delete"
                            >
                                <FiTrash2 size={12} className="text-red-400" />
                            </button>
                        </div>
                    )}
                </div>

                {file.type === 'folder' && expandedFolders.has(file.fileId) && (
                    <div>
                        {creatingInParentId === file.fileId && (
                            <div
                                className="flex items-center gap-2 px-2 py-1.5 text-xs"
                                style={{ paddingLeft: `${(level + 1) * 12 + 8}px` }}
                            >
                                <FiFile size={14} className="text-[#858585]" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={createName}
                                    onChange={e => setCreateName(e.target.value)}
                                    placeholder="name.ext or folder"
                                    className="flex-1 bg-[#1e1e1e] px-1.5 py-0.5 rounded border border-[#007acc] focus:outline-none text-[#cccccc] placeholder-[#6a6a6a]"
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') handleCreateFile();
                                        if (e.key === 'Escape') {
                                            setCreatingInParentId(null);
                                            setCreateName('');
                                        }
                                    }}
                                />
                            </div>
                        )}
                        {renderFileTree(file.fileId, level + 1)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className={`h-full flex flex-col border-r ${theme === 'dark'
                ? 'bg-gray-900 border-gray-800'
                : 'bg-gray-50 border-gray-300'
            }`}>
            {/* Header */}
            <div className={`px-3 py-3 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'
                }`}>
                <div className="flex items-center justify-between">
                    <h3 className={`text-xs font-semibold uppercase tracking-wide ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                        Explorer
                    </h3>
                    <button
                        onClick={() => {
                            setCreatingInParentId(null);
                            setCreateName('');
                            setShowCreateInput(true);
                        }}
                        className={`p-1.5 rounded transition-colors ${theme === 'dark'
                            ? 'hover:bg-[#2d2d30] text-[#858585] hover:text-[#cccccc]'
                            : 'hover:bg-gray-200 text-gray-600 hover:text-gray-900'
                            }`}
                        title="New file/folder"
                    >
                        <FiPlus size={14} />
                    </button>
                </div>
            </div>

            {/* File Tree */}
            <div className="flex-1 overflow-y-auto px-2 py-2">
                {files.length === 0 ? (
                    <p className={`text-xs p-3 text-center ${theme === 'dark' ? 'text-[#6a6a6a]' : 'text-gray-500'
                        }`}>No files yet</p>
                ) : (
                    <>
                        {showCreateInput && creatingInParentId === null && (
                            <div className={`flex items-center gap-2 px-2 py-1.5 mb-1 text-xs rounded border ${theme === 'dark'
                                ? 'bg-[#1e1e1e] border-[#007acc]'
                                : 'bg-white border-blue-500'
                                }`}>
                                <FiFile size={14} className={theme === 'dark' ? 'text-[#858585]' : 'text-gray-500'} />
                                <input
                                    autoFocus
                                    type="text"
                                    value={createName}
                                    onChange={e => setCreateName(e.target.value)}
                                    placeholder="name.ext or folder"
                                    className={`flex-1 bg-transparent px-1 py-0.5 focus:outline-none ${theme === 'dark'
                                        ? 'text-[#cccccc] placeholder-[#6a6a6a]'
                                        : 'text-gray-900 placeholder-gray-400'
                                        }`}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') handleCreateFile();
                                        if (e.key === 'Escape') {
                                            setCreateName('');
                                            setShowCreateInput(false);
                                        }
                                    }}
                                    onBlur={() => {
                                        if (!createName.trim()) {
                                            setCreateName('');
                                            setShowCreateInput(false);
                                        }
                                    }}
                                />
                            </div>
                        )}
                        {renderFileTree()}
                    </>
                )}
            </div>
        </div>
    );
};

export default FileExplorer;
