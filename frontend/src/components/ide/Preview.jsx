import React, { useContext, useMemo } from 'react';
import { SandpackProvider, SandpackPreview } from '@codesandbox/sandpack-react';
import { IDEContext } from '../../context/ideContext';
import { usePreviewStyles } from '../../hooks/usePreviewStyles';
import { buildFileStructure } from '../../utils/fileStructureBuilder';

const Preview = ({ editorCode, currentFileName }) => {
    const { files, theme } = useContext(IDEContext);

    // Apply custom styles for full height preview
    usePreviewStyles();

    // Build file structure for Sandpack with live editor code
    const fileStructure = useMemo(() => {
        return buildFileStructure(files, editorCode, currentFileName);
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

export default Preview;
