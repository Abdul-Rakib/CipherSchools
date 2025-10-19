import React, { useContext, useMemo, useEffect } from 'react';
import { SandpackProvider, SandpackPreview } from '@codesandbox/sandpack-react';
import { IDEContext } from '../../context/ideContext';

const Preview = ({ editorCode, currentFileName }) => {
    const { files, theme } = useContext(IDEContext);

    // Add custom styles to ensure full height
    useEffect(() => {
        const style = document.createElement('style');
        style.innerHTML = `
            .sandpack-preview-wrapper {
                height: 100% !important;
                display: flex !important;
                flex-direction: column !important;
            }
            .sp-wrapper,
            .sp-layout,
            .sp-stack {
                height: 100% !important;
                display: flex !important;
                flex-direction: column !important;
            }
            .sp-preview-container {
                flex: 1 !important;
                height: 100% !important;
                display: flex !important;
                flex-direction: column !important;
            }
            .sp-preview-iframe {
                height: 100% !important;
                flex: 1 !important;
            }
            /* Hide editor completely */
            .sp-code-editor {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    // Build file structure for Sandpack with live editor code
    const fileStructure = useMemo(() => {
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
                let path = buildFilePath(file.fileId, files);

                // Use live editor code if this is the currently edited file
                const isCurrentFile = currentFileName && path === currentFileName;

                structure[`/${path}`] = {
                    code: isCurrentFile && editorCode ? editorCode : (file.content || ''),
                    hidden: false,
                };
            }
        });

        return structure;
    }, [files, editorCode, currentFileName]);

    return (
        <div
            className={`absolute inset-0 border-l sandpack-preview-wrapper ${theme === 'dark' ? 'bg-[#1e1e1e] border-[#3e3e42]' : 'bg-white border-gray-300'
                }`}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Sandpack Preview Only - Full Height */}
            <SandpackProvider
                files={fileStructure}
                template="react"
                theme={theme === 'dark' ? 'dark' : 'light'}
                options={{
                    autoReload: true,
                    autorun: true,
                }}
            >
                <SandpackPreview
                    showNavigator={false}
                    showRefreshButton={true}
                    showOpenInCodeSandbox={false}
                    style={{
                        height: '100%',
                        width: '100%',
                        flex: 1,
                    }}
                />
            </SandpackProvider>
        </div>
    );
};

// Helper function to build full path to a file (excluding root folder)
function buildFilePath(fileId, files) {
    const file = files.find(f => f.fileId === fileId);
    if (!file) return '';

    // Find root folder (parentId === null)
    let current = file;
    const pathParts = [file.name];

    while (current.parentId !== null) {
        const parent = files.find(f => f.fileId === current.parentId);
        if (!parent) break;

        // Stop if we've reached the root folder
        if (parent.parentId === null) {
            break;
        }

        pathParts.unshift(parent.name);
        current = parent;
    }

    return pathParts.join('/');
}

export default Preview;
