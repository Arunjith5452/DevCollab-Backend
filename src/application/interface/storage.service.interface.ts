
export interface SignedUrlResponse {
    uploadUrl: string;
    fileUrl: string;
}

export interface IStorageService {
    generateUploadSignedUrl(fileName: string, fileType: string): Promise<SignedUrlResponse>;
    deleteFile(fileUrl: string): Promise<void>;
}
