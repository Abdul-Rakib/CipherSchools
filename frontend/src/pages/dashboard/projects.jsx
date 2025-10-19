import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IDEContext } from '../../context/ideContext';
import { FiPlus, FiTrash2, FiEdit2, FiCode, FiArrowRight, FiFolder, FiClock, FiSun, FiMoon, FiGrid, FiList } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Dashboard = () => {
    const navigate = useNavigate();
    const { projects, fetchProjects, createProject, deleteProject, theme, toggleTheme, loading } =
        useContext(IDEContext);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const handleCreateProject = async () => {
        if (!projectName.trim()) {
            toast.error('Please enter a project name');
            return;
        }

        try {
            setIsCreating(true);
            const project = await createProject(projectName, projectDescription, 'react');
            toast.success('Project created successfully');
            setShowCreateDialog(false);
            setProjectName('');
            setProjectDescription('');
            // Navigate to IDE
            navigate(`/ide/${project.projectId}`);
        } catch (err) {
            toast.error(err.response?.data?.msg || 'Failed to create project');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteProject = (projectId) => {
        if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            deleteProject(projectId);
            toast.success('Project deleted');
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-900 to-black' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'}`}>
            {/* Enhanced Header with gradient */}
            <div className={`${theme === 'dark' ? 'bg-gray-900/50' : 'bg-white/50'} backdrop-blur-sm border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'} sticky top-0 z-10`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-blue-100'} backdrop-blur-sm`}>
                                <FiCode size={28} className={theme === 'dark' ? 'text-gray-300' : 'text-blue-600'} />
                            </div>
                            <div>
                                <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>
                                    Your Projects
                                </h1>
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {projects.length} {projects.length === 1 ? 'project' : 'projects'} • Build amazing things
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* View Mode Toggle */}
                            {projects.length > 0 && (
                                <div className={`flex items-center rounded-xl overflow-hidden ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                                    }`}>
                                    <button
                                        onClick={() => setViewMode('table')}
                                        className={`p-3 transition-all ${viewMode === 'table'
                                                ? theme === 'dark'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-blue-500 text-white'
                                                : theme === 'dark'
                                                    ? 'text-gray-400 hover:text-gray-200'
                                                    : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        title="Table view"
                                    >
                                        <FiList size={20} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-3 transition-all ${viewMode === 'grid'
                                                ? theme === 'dark'
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-blue-500 text-white'
                                                : theme === 'dark'
                                                    ? 'text-gray-400 hover:text-gray-200'
                                                    : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                        title="Grid view"
                                    >
                                        <FiGrid size={20} />
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={toggleTheme}
                                className={`p-3 rounded-xl transition-all ${theme === 'dark'
                                        ? 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                    }`}
                                title="Toggle theme"
                            >
                                {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
                            </button>
                            <button
                                onClick={() => setShowCreateDialog(true)}
                                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <FiPlus size={20} />
                                New Project
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Projects Grid */}
                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                Loading your projects...
                            </p>
                        </div>
                    </div>
                ) : projects.length === 0 ? (
                    <div className={`text-center py-16 rounded-2xl border-2 border-dashed ${theme === 'dark'
                            ? 'bg-gray-800/50 border-gray-700'
                            : 'bg-white/80 border-gray-300'
                        } backdrop-blur-sm`}>
                        <div className={`inline-flex p-6 rounded-full mb-6 ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-blue-100'
                            }`}>
                            <FiFolder size={48} className={theme === 'dark' ? 'text-gray-300' : 'text-blue-600'} />
                        </div>
                        <h3 className={`text-2xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                            No projects yet
                        </h3>
                        <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                            }`}>
                            Create your first project and start building something amazing
                        </p>
                        <button
                            onClick={() => setShowCreateDialog(true)}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <FiPlus size={20} />
                            Create First Project
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Table View */}
                        {viewMode === 'table' ? (
                            <div className={`rounded-2xl overflow-hidden border ${theme === 'dark'
                                    ? 'bg-gray-800/50 border-gray-700'
                                    : 'bg-white border-gray-200'
                                } backdrop-blur-sm shadow-lg`}>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className={`border-b ${theme === 'dark' ? 'border-gray-700 bg-gray-800/80' : 'border-gray-200 bg-gray-50'
                                                }`}>
                                                <th className={`px-6 py-4 text-left text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                                    }`}>
                                                    Project
                                                </th>
                                                <th className={`px-6 py-4 text-left text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                                    }`}>
                                                    Description
                                                </th>
                                                <th className={`px-6 py-4 text-left text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                                    }`}>
                                                    Type
                                                </th>
                                                <th className={`px-6 py-4 text-left text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                                    }`}>
                                                    Last Modified
                                                </th>
                                                <th className={`px-6 py-4 text-right text-sm font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                                    }`}>
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {projects.map(project => (
                                                <tr
                                                    key={project.projectId}
                                                    className={`border-b transition-colors ${theme === 'dark'
                                                            ? 'border-gray-700 hover:bg-gray-800/60'
                                                            : 'border-gray-100 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-blue-100'
                                                                }`}>
                                                                <FiCode size={20} className={theme === 'dark' ? 'text-gray-300' : 'text-blue-600'} />
                                                            </div>
                                                            <div>
                                                                <div className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                                    }`}>
                                                                    {project.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className={`text-sm max-w-md truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>
                                                            {project.description || 'No description'}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${theme === 'dark'
                                                                ? 'bg-gray-700/50 text-gray-300'
                                                                : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {project.template}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className={`flex items-center gap-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                            }`}>
                                                            <FiClock size={14} />
                                                            {formatDate(project.lastModified || project.updatedAt)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => navigate(`/ide/${project.projectId}`)}
                                                                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 px-4 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                                                            >
                                                                <FiEdit2 size={16} />
                                                                Open
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteProject(project.projectId)}
                                                                className={`p-2 rounded-xl transition-all ${theme === 'dark'
                                                                        ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                                                                        : 'bg-red-50 hover:bg-red-100 text-red-600'
                                                                    }`}
                                                                title="Delete project"
                                                            >
                                                                <FiTrash2 size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            /* Grid View */
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.map(project => (
                                    <div
                                        key={project.projectId}
                                        className={`group relative rounded-2xl transition-all duration-300 hover:scale-105 ${theme === 'dark'
                                                ? 'bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700 hover:border-blue-500/50'
                                                : 'bg-white hover:bg-white/90 border border-gray-200 hover:border-blue-300'
                                            } backdrop-blur-sm shadow-lg hover:shadow-2xl p-6`}
                                    >
                                        {/* Project Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-blue-600/20' : 'bg-blue-100'
                                                } group-hover:scale-110 transition-transform`}>
                                                <FiCode size={24} className={theme === 'dark' ? 'text-blue-400' : 'text-blue-600'} />
                                            </div>
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${theme === 'dark'
                                                    ? 'bg-blue-600/20 text-blue-300'
                                                    : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {project.template}
                                            </span>
                                        </div>

                                        {/* Project Info */}
                                        <div className="mb-4">
                                            <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                {project.name}
                                            </h3>
                                            {project.description && (
                                                <p className={`text-sm line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                    }`}>
                                                    {project.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Last Modified */}
                                        <div className={`flex items-center gap-2 text-xs mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                            }`}>
                                            <FiClock size={14} />
                                            <span>Updated {formatDate(project.lastModified || project.updatedAt)}</span>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/ide/${project.projectId}`)}
                                                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2.5 px-4 rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
                                            >
                                                <FiEdit2 size={16} />
                                                Open
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProject(project.projectId)}
                                                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium transition-all ${theme === 'dark'
                                                        ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                                                        : 'bg-red-50 hover:bg-red-100 text-red-600'
                                                    }`}
                                                title="Delete project"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>

                                        {/* Hover Effect Overlay */}
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all pointer-events-none"></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Enhanced Create Project Dialog */}
            {showCreateDialog && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className={`rounded-2xl shadow-2xl w-full max-w-md transform transition-all ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                        }`}>
                        {/* Dialog Header with Gradient */}
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                    <FiPlus size={24} />
                                </div>
                                Create New Project
                            </h2>
                            <p className="text-blue-100 text-sm mt-2">
                                Start building something amazing
                            </p>
                        </div>

                        {/* Dialog Content */}
                        <div className="p-6">
                            <div className="mb-6">
                                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                    Project Name *
                                </label>
                                <input
                                    autoFocus
                                    type="text"
                                    value={projectName}
                                    onChange={e => setProjectName(e.target.value)}
                                    placeholder="e.g., My Awesome App"
                                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                        }`}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') handleCreateProject();
                                    }}
                                />
                            </div>

                            <div className="mb-6">
                                <label className={`block text-sm font-semibold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                    }`}>
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={projectDescription}
                                    onChange={e => setProjectDescription(e.target.value)}
                                    placeholder="Describe your project..."
                                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none ${theme === 'dark'
                                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                        }`}
                                    rows="3"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleCreateProject}
                                    disabled={isCreating}
                                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-blue-400 disabled:to-blue-500 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                                >
                                    {isCreating ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <FiArrowRight size={18} />
                                            Create Project
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCreateDialog(false);
                                        setProjectName('');
                                        setProjectDescription('');
                                    }}
                                    disabled={isCreating}
                                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${theme === 'dark'
                                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
