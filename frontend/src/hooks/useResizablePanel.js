import { useState, useEffect, useRef } from 'react';

export const useResizablePanel = (initialWidth, options = {}) => {
    const {
        minWidth = 200,
        maxWidth = 600,
        fromRight = false
    } = options;

    const [width, setWidth] = useState(initialWidth);
    const [isDragging, setIsDragging] = useState(false);
    const isDraggingRef = useRef(false);

    useEffect(() => {
        isDraggingRef.current = isDragging;
    }, [isDragging]);

    const handleMouseMove = (e) => {
        if (isDraggingRef.current) {
            let newWidth;
            
            if (fromRight) {
                // Calculate from right edge (for preview panel)
                const containerWidth = window.innerWidth;
                const distanceFromRight = containerWidth - e.clientX;
                const effectiveMaxWidth = Math.min(maxWidth, containerWidth * 0.8);
                newWidth = Math.max(minWidth, Math.min(effectiveMaxWidth, distanceFromRight));
            } else {
                // Calculate from left edge (for explorer panel)
                newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX));
            }
            
            setWidth(newWidth);
        }
    };

    const handleMouseUp = () => {
        if (isDraggingRef.current) {
            setIsDragging(false);
            isDraggingRef.current = false;
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        }
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        setIsDragging(true);
        isDraggingRef.current = true;
    };

    return {
        width,
        setWidth,
        isDragging,
        handleMouseMove,
        handleMouseUp,
        handleMouseDown
    };
};
