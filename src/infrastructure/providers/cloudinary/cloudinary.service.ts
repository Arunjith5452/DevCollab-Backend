import { injectable } from "inversify";
import { IStorageService, SignedUrlResponse } from "@/application/interface/storage.service.interface";
import { v2 as cloudinary } from "cloudinary";
import { logger } from "../logs/logger.service";

@injectable()
export class CloudinaryService implements IStorageService {
    constructor() {
        const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
        const api_key = process.env.CLOUDINARY_API_KEY;
        const api_secret = process.env.CLOUDINARY_API_SECRET;

        if (!cloud_name || !api_key || !api_secret) {
            logger.error("FATAL ERROR: Cloudinary Credentials are missing.");
            throw new Error("Missing Cloudinary configuration.");
        }

        cloudinary.config({
            cloud_name: cloud_name,
            api_key: api_key,
            api_secret: api_secret,
        });
    }

    async generateUploadSignedUrl(fileName: string, fileType: string): Promise<SignedUrlResponse> {
        try {
            const timestamp = Math.round((new Date).getTime() / 1000);
            
            const cloudName = process.env.CLOUDINARY_CLOUD_NAME as string;
            const apiKey = process.env.CLOUDINARY_API_KEY as string;

            // Generate a random public ID to ensure uniqueness, similar to Date.now()-fileName
            const publicId = `project-images/${Date.now()}-${fileName.replace(/\.[^/.]+$/, "")}`; // Removing extension for Cloudinary public_id
            
            const paramsToSign = {
                timestamp: timestamp,
                folder: 'project-images',
                public_id: publicId,
            };

            const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET as string);

            const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
            
            // The file extension might not match exactly, but Cloudinary generally serves it via URL.
            // When uploading with a public_id, the URL doesn't have an extension unless requested with one.
            // But if we want to retain the original format in the fileUrl we should append it or let Cloudinary detect it.
            // A safer bet is to use the cloudinary format or omit it. Actually, omitting extension serves original format.
            const fileUrl = `https://res.cloudinary.com/${cloudName}/image/upload/v${timestamp}/${publicId}`;

            return { 
                uploadUrl, 
                fileUrl,
                provider: 'cloudinary',
                cloudinaryData: {
                    timestamp,
                    signature,
                    apiKey,
                    cloudName,
                    folder: 'project-images',
                    publicId
                }
            };
        } catch (error) {
            logger.error("Cloudinary Generate Signed URL failed:", error);
            throw error;
        }
    }

    async deleteFile(fileUrl: string): Promise<void> {
        try {
            const urlParts = fileUrl.split('/');
            const uploadIndex = urlParts.findIndex(part => part === 'upload');
            if (uploadIndex !== -1 && urlParts.length > uploadIndex + 2) {
                // Handle cases where version might or might not be present (e.g. v1312461204)
                // If it starts with 'v' and numbers, it's a version string.
                let pathStartIndex = uploadIndex + 1;
                if (urlParts[pathStartIndex].match(/^v\d+$/)) {
                    pathStartIndex++;
                }

                const publicIdWithExt = urlParts.slice(pathStartIndex).join('/');
                const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // remove extension
                
                await cloudinary.uploader.destroy(publicId);
                logger.info(`Successfully deleted file from Cloudinary: ${publicId}`);
            }
        } catch (error) {
            logger.error("Error deleting file from Cloudinary:", error);
        }
    }
}
