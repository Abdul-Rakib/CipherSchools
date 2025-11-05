import { useEffect } from 'react';

export const usePreviewStyles = () => {
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
        
        return () => {
            document.head.removeChild(style);
        };
    }, []);
};
