
export const buildFilePath = (fileId, files) => {
    const file = files.find(f => f.fileId === fileId);
    if (!file) return '';

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
};
