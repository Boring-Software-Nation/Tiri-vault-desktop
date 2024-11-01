export const storageName = 'local';

export default (wallet, path) => {
    let currentDir = '';
    if (path) {
        currentDir = path.replace(storageName + '://', '');
        currentDir = currentDir.replace(wallet + '/', '');
        if (currentDir && !currentDir.endsWith('/')) {
            currentDir += '/';
        }
    }
    return currentDir;
};
