export interface SignedUrlResponse {
    uploadUrl: string;
    fileUrl: string;
    provider?: 's3' | 'cloudinary';
    cloudinaryData?: {
        timestamp: number;
        signature: string;
        apiKey: string;
        cloudName: string;
        folder: string;
        publicId: string;
    };
}