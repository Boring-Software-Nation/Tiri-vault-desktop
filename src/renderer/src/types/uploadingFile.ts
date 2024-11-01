export default interface UploadingFile {
        basename: string,
        path: string,
        type: string,
        visibility: string,
        storage: string,
        file_size: number,
        last_modified: string,
        extra_metadata: string[],
        extension: string,
        mime_type: string
        status: string,
}
