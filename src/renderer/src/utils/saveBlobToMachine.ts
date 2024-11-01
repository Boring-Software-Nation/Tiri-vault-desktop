export function saveBlobToMachine(name: string, blob: Blob) {
    const href = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = name
    document.body.appendChild(link)
    link.click()
    setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        document.body.removeChild(link)
        URL.revokeObjectURL(href)
    }, 100)
}
