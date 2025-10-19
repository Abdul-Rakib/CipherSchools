import Project from '../models/project.js';
import File from '../models/file.js';
import { v4 as uuidv4 } from 'uuid';

// Create a new project
export const createProject = async (req, res) => {
    try {
        const { name, description, template = 'react' } = req.body;
        const userId = req.user._id;

        if (!name) {
            return res.status(400).json({ success: false, msg: 'Project name is required' });
        }

        const projectId = uuidv4();

        // Create project
        const project = new Project({
            projectId,
            userId,
            name,
            description,
            template,
        });

        await project.save();

        // Create root folder
        const rootFileId = uuidv4();
        const rootFile = new File({
            fileId: rootFileId,
            projectId,
            parentId: null,
            name,
            type: 'folder',
        });

        await rootFile.save();

        // Create default files based on template
        if (template === 'react') {
            const srcFolderId = uuidv4();
            const publicFolderId = uuidv4();
            const packageJsonId = uuidv4();

            // Create src folder
            await new File({
                fileId: srcFolderId,
                projectId,
                parentId: rootFileId,
                name: 'src',
                type: 'folder',
            }).save();

            // Create public folder
            await new File({
                fileId: publicFolderId,
                projectId,
                parentId: rootFileId,
                name: 'public',
                type: 'folder',
            }).save();

            // Create package.json
            const packageJsonContent = JSON.stringify({
                name: name.toLowerCase().replace(/\s+/g, '-'),
                version: '1.0.0',
                private: true,
                dependencies: {
                    react: '^18.3.1',
                    'react-dom': '^18.3.1',
                },
            }, null, 2);

            await new File({
                fileId: packageJsonId,
                projectId,
                parentId: rootFileId,
                name: 'package.json',
                type: 'file',
                content: packageJsonContent,
                language: 'json',
            }).save();

            // Create App.js
            const appJsId = uuidv4();
            const appJsContent = `export default function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Welcome to ${name}</h1>
      <p>Start editing to see your changes here!</p>
    </div>
  );
}`;

            await new File({
                fileId: appJsId,
                projectId,
                parentId: srcFolderId,
                name: 'App.js',
                type: 'file',
                content: appJsContent,
                language: 'javascript',
            }).save();

            // Create index.js
            const indexJsId = uuidv4();
            const indexJsContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`;

            await new File({
                fileId: indexJsId,
                projectId,
                parentId: srcFolderId,
                name: 'index.js',
                type: 'file',
                content: indexJsContent,
                language: 'javascript',
            }).save();

            // Create index.html
            const indexHtmlId = uuidv4();
            const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${name}</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>`;

            await new File({
                fileId: indexHtmlId,
                projectId,
                parentId: publicFolderId,
                name: 'index.html',
                type: 'file',
                content: indexHtmlContent,
                language: 'html',
            }).save();
        }

        res.status(201).json({
            success: true,
            msg: 'Project created successfully',
            project: {
                ...project.toObject(),
                rootFolderId: rootFileId,
            },
        });
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Get all projects for a user
export const getUserProjects = async (req, res) => {
    try {
        const userId = req.user._id;

        const projects = await Project.find({ userId })
            .sort({ createdAt: -1 })
            .lean();

        res.json({ success: true, projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Get project by ID
export const getProjectById = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findOne({ projectId }).lean();

        if (!project) {
            return res.status(404).json({ success: false, msg: 'Project not found' });
        }

        // Check authorization
        if (project.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, msg: 'Unauthorized' });
        }

        // Get all files for this project
        const files = await File.find({ projectId }).lean();

        // Build file tree
        const fileTree = buildFileTree(files);

        res.json({ success: true, project, fileTree, files });
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Update project
export const updateProject = async (req, res) => {
    try {
        const { projectId } = req.params;
        const { name, description } = req.body;

        const project = await Project.findOne({ projectId });

        if (!project) {
            return res.status(404).json({ success: false, msg: 'Project not found' });
        }

        if (project.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, msg: 'Unauthorized' });
        }

        if (name) project.name = name;
        if (description !== undefined) project.description = description;
        project.lastModified = new Date();

        await project.save();

        res.json({ success: true, msg: 'Project updated successfully', project });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Delete project
export const deleteProject = async (req, res) => {
    try {
        const { projectId } = req.params;

        const project = await Project.findOne({ projectId });

        if (!project) {
            return res.status(404).json({ success: false, msg: 'Project not found' });
        }

        if (project.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, msg: 'Unauthorized' });
        }

        // Delete all files associated with project
        await File.deleteMany({ projectId });

        // Delete project
        await Project.deleteOne({ projectId });

        res.json({ success: true, msg: 'Project deleted successfully' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ success: false, msg: error.message });
    }
};

// Helper function to build file tree
function buildFileTree(files) {
    const tree = {};
    const map = {};

    files.forEach(file => {
        map[file.fileId] = { ...file, children: [] };
    });

    files.forEach(file => {
        if (file.parentId === null) {
            tree[file.fileId] = map[file.fileId];
        } else if (map[file.parentId]) {
            map[file.parentId].children.push(map[file.fileId]);
        }
    });

    return tree;
}
