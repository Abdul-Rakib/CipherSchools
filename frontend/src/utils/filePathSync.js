
export const buildFilePathForSync = (fileId, filesList) => {
    const file = filesList.find(f => f.fileId === fileId);
    if (!file) return '';

    let current = file;
    const pathParts = [file.name];

    while (current.parentId !== null) {
        const parent = filesList.find(f => f.fileId === current.parentId);
        if (!parent) break;

        // Stop if we've reached the root folder (parentId === null)
        if (parent.parentId === null) {
            break;
        }

        pathParts.unshift(parent.name);
        current = parent;
    }

    return pathParts.join('/');
};
