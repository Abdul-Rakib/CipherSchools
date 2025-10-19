import React, { createContext, useState, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const IDEContext = createContext();

export const IDEProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    const [files, setFiles] = useState([]);
    const [currentFile, setCurrentFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem('cipherstudio-theme');
        return saved || 'light';
    });

    const token = localStorage.getItem('token');

    // Fetch user's projects
    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const userId = localStorage.getItem('userId');
            if (!userId) {
                setError('User ID not found');
                return;
            }
            const response = await axios.get(`${API_URL}/api/projects/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                setProjects(response.data.projects);
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Create a new project
    const createProject = useCallback(async (name, description = '', template = 'react') => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${API_URL}/api/projects`,
                { name, description, template },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.data.success) {
                setProjects([response.data.project, ...projects]);
                return response.data.project;
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to create project');
            throw err;
        } finally {
            setLoading(false);
        }
    }, [projects, token]);

    // Fetch project by ID
    const fetchProject = useCallback(async (projectId) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/projects/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.success) {
                setCurrentProject(response.data.project);
                setFiles(response.data.files || []);
                if (response.data.files.length > 0) {
                    setCurrentFile(response.data.files[0]);
                }
                return response.data;
            }
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to fetch project');
        } finally {
            setLoading(false);
        }
    }, [token]);

    // Update project
    const updateProject = useCallback(
        async (projectId, name, description) => {
            try {
                const response = await axios.put(
                    `${API_URL}/api/projects/${projectId}`,
                    { name, description },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.success) {
                    setCurrentProject(response.data.project);
                    setProjects(
                        projects.map(p => (p.projectId === projectId ? response.data.project : p))
                    );
                }
            } catch (err) {
                setError(err.response?.data?.msg || 'Failed to update project');
            }
        },
        [projects, token]
    );

    // Delete project
    const deleteProject = useCallback(
        async (projectId) => {
            try {
                const response = await axios.delete(`${API_URL}/api/projects/${projectId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data.success) {
                    setProjects(projects.filter(p => p.projectId !== projectId));
                    if (currentProject?.projectId === projectId) {
                        setCurrentProject(null);
                        setFiles([]);
                        setCurrentFile(null);
                    }
                }
            } catch (err) {
                setError(err.response?.data?.msg || 'Failed to delete project');
            }
        },
        [projects, currentProject, token]
    );

    // Create a file or folder
    const createFile = useCallback(
        async (projectId, name, type, parentId = null, content = '') => {
            try {
                const response = await axios.post(
                    `${API_URL}/api/files`,
                    { projectId, name, type, parentId, content },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.success) {
                    setFiles([...files, response.data.file]);
                    return response.data.file;
                }
            } catch (err) {
                setError(err.response?.data?.msg || 'Failed to create file');
                throw err;
            }
        },
        [files, token]
    );

    // Update file content
    const updateFileContent = useCallback(
        async (fileId, content) => {
            try {
                const response = await axios.put(
                    `${API_URL}/api/files/${fileId}`,
                    { content },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.success) {
                    const updated = response.data.file;
                    setFiles(files.map(f => (f.fileId === fileId ? updated : f)));
                    if (currentFile?.fileId === fileId) {
                        setCurrentFile(updated);
                    }
                }
            } catch (err) {
                setError(err.response?.data?.msg || 'Failed to update file');
            }
        },
        [files, currentFile, token]
    );

    // Rename file
    const renameFile = useCallback(
        async (fileId, newName) => {
            try {
                const response = await axios.put(
                    `${API_URL}/api/files/${fileId}`,
                    { name: newName },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data.success) {
                    const updated = response.data.file;
                    setFiles(files.map(f => (f.fileId === fileId ? updated : f)));
                    if (currentFile?.fileId === fileId) {
                        setCurrentFile(updated);
                    }
                }
            } catch (err) {
                setError(err.response?.data?.msg || 'Failed to rename file');
                throw err;
            }
        },
        [files, currentFile, token]
    );

    // Delete file
    const deleteFile = useCallback(
        async (fileId) => {
            try {
                const response = await axios.delete(`${API_URL}/api/files/${fileId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data.success) {
                    setFiles(files.filter(f => f.fileId !== fileId));
                    if (currentFile?.fileId === fileId) {
                        setCurrentFile(files.find(f => f.fileId !== fileId) || null);
                    }
                }
            } catch (err) {
                setError(err.response?.data?.msg || 'Failed to delete file');
            }
        },
        [files, currentFile, token]
    );

    // Toggle theme
    const toggleTheme = useCallback(() => {
        setTheme(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('cipherstudio-theme', newTheme);
            return newTheme;
        });
    }, []);

    const value = {
        // State
        projects,
        currentProject,
        files,
        currentFile,
        loading,
        error,
        theme,

        // Methods
        fetchProjects,
        createProject,
        fetchProject,
        updateProject,
        deleteProject,
        createFile,
        updateFileContent,
        renameFile,
        deleteFile,
        setCurrentFile,
        toggleTheme,
        setError,
    };

    return <IDEContext.Provider value={value}>{children}</IDEContext.Provider>;
};
