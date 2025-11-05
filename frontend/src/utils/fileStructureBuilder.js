import { buildFilePath } from './pathBuilder';

export const buildFileStructure = (files, editorCode, currentFileName) => {
    const structure = {};

    // Add package.json with main entry point
    structure['/package.json'] = {
        code: JSON.stringify({
            name: 'cipherudio-react',
            version: '1.0.0',
            private: true,
            main: '/src/index.js',
            dependencies: {
                react: '18.3.1',
                'react-dom': '18.3.1',
            },
        }, null, 2),
        hidden: true,
    };

    // Add all files from the project
    files.forEach(file => {
        if (file.type === 'file') {
            // Build path
            const path = buildFilePath(file.fileId, files);

            // Use live editor code if this is the currently edited file
            const isCurrentFile = currentFileName && path === currentFileName;

            structure[`/${path}`] = {
                code: isCurrentFile && editorCode ? editorCode : (file.content || ''),
                hidden: false,
            };
        }
    });

    return structure;
};
