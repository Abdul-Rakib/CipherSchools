import File from '../models/file.js';
import Project from '../models/project.js';
import { v4 as uuidv4 } from 'uuid';

// Create a file or folder
export const createFile = async (req, res) => {
    try {
        const { projectId, parentId, name, type, content = '', language = 'javascript' } = req.body;

        if (!projectId || !name || !type) {
            return res.status(400).json({ success: false, msg: 'Missing required fields' });
        }

        if (!['file', 'folder'].includes(type)) {
            return res.status(400).json({ success: false, msg: 'Invalid file type' });
        }

        // Check if user owns the project
        const project = await Project.findOne({ projectId });
        if (!project || project.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, msg: 'Unauthorized' });
        }

        // Check for duplicate names in same parent
        const existing = await File.findOne({ projectId, parentId, name });
        if (existing) {
            return res.status(400).json({ success: false, msg: 'File/folder already exists with this name' });
        }

        const fileId = uuidv4();

        const file = new File({
            fileId,
            projectId,
            parentId: parentId || null,
            name,
            type,
            content: type === 'file' ? content : '',
            language: type === 'file' ? language : '',
        });

        await file.save();

        // Update project's lastModified
        await Project.updateOne({ projectId }, { lastModified: new Date() });

        res.status(201).json({ success: true, msg: 'File/folder created successfully', file });
    } catch (error) {
        console.error('Error creating file:', error);
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Get file details
export const getFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        const file = await File.findOne({ fileId }).lean();

        if (!file) {
            return res.status(404).json({ success: false, msg: 'File not found' });
        }

        // Check authorization
        const project = await Project.findOne({ projectId: file.projectId });
        if (!project || project.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, msg: 'Unauthorized' });
        }

        res.json({ success: true, file });
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Update file content or rename
export const updateFile = async (req, res) => {
    try {
        const { fileId } = req.params;
        const { content, name } = req.body;

        const file = await File.findOne({ fileId });

        if (!file) {
            return res.status(404).json({ success: false, msg: 'File not found' });
        }

        // Check authorization
        const project = await Project.findOne({ projectId: file.projectId });
        if (!project || project.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, msg: 'Unauthorized' });
        }

        // Check for duplicate names if renaming
        if (name && name !== file.name) {
            const existing = await File.findOne({
                projectId: file.projectId,
                parentId: file.parentId,
                name,
                fileId: { $ne: fileId },
            });
            if (existing) {
                return res.status(400).json({ success: false, msg: 'File/folder with this name already exists' });
            }
            file.name = name;
        }

        if (content !== undefined) {
            file.content = content;
        }

        await file.save();

        // Update project's lastModified
        await Project.updateOne({ projectId: file.projectId }, { lastModified: new Date() });

        res.json({ success: true, msg: 'File updated successfully', file });
    } catch (error) {
        console.error('Error updating file:', error);
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Delete file or folder
export const deleteFile = async (req, res) => {
    try {
        const { fileId } = req.params;

        const file = await File.findOne({ fileId });

        if (!file) {
            return res.status(404).json({ success: false, msg: 'File not found' });
        }

        // Check authorization
        const project = await Project.findOne({ projectId: file.projectId });
        if (!project || project.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, msg: 'Unauthorized' });
        }

        // If folder, delete all children recursively
        if (file.type === 'folder') {
            await deleteFileRecursive(fileId, file.projectId);
        }

        // Delete the file itself
        await File.deleteOne({ fileId });

        // Update project's lastModified
        await Project.updateOne({ projectId: file.projectId }, { lastModified: new Date() });

        res.json({ success: true, msg: 'File/folder deleted successfully' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Get all files in a project
export const getProjectFiles = async (req, res) => {
    try {
        const { projectId } = req.params;

        // Check authorization
        const project = await Project.findOne({ projectId });
        if (!project || project.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, msg: 'Unauthorized' });
        }

        const files = await File.find({ projectId }).lean();

        res.json({ success: true, files });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Helper function to recursively delete folder contents
async function deleteFileRecursive(parentId, projectId) {
    const children = await File.find({ parentId, projectId });
    for (const child of children) {
        if (child.type === 'folder') {
            await deleteFileRecursive(child.fileId, projectId);
        }
        await File.deleteOne({ fileId: child.fileId });
    }
}
