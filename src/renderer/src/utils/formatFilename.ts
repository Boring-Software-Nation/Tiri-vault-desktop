export const formatFilename = (filename: string, maxLength: number) => {
    const fileparts: string[] = filename.split('.');
    let ext: string | undefined = '';
    if (fileparts.length > 1) {
        ext = fileparts.pop();
        filename = fileparts.join('.');
    }
    const inputString = filename;
    console.log(inputString)
    if (inputString.length <= maxLength) {
        return inputString + (ext && ext.length > 0 ? '.' + ext : ''); // No need to truncate
    }

    const ellipsis = '...';
    const mid = Math.floor(maxLength / 2) - Math.floor(ellipsis.length / 2);

    // Split the input string into two parts with the ellipsis in the middle
    const firstPart = inputString.substring(0, mid);
    const secondPart = inputString.substring(inputString.length - (maxLength - mid) + ellipsis.length);

    // Combine and return the formatted string
    return firstPart + ellipsis + secondPart + (ext && ext.length > 0 ? '.' + ext : '');
}
