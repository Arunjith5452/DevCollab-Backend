import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export interface SignedUrlResponse {
  uploadUrl: string;
  fileUrl: string;
}

const getS3Client = () => {

  const region = process.env.AWS_REGION;
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!region || !accessKeyId || !secretAccessKey) {
    console.error("FATAL ERROR: AWS Credentials or Region are missing in environment variables.");
    throw new Error("Missing AWS configuration for S3 client.");
  }
  return new S3Client({
    region: region,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });

};


export const generateUploadSignedUrl = async (
  fileName: string,
  fileType: string
): Promise<SignedUrlResponse> => {
  const s3 = getS3Client();

  const bucketName = process.env.AWS_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("AWS_BUCKET_NAME is not set.");
  }

  const key = `project-images/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: fileType,
  });

  try {
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return { uploadUrl, fileUrl };
  } catch (error) {
    console.error("S3 Generate Signed URL failed:", error);
    throw error;
  }
};

export const deleteFile = async (fileUrl: string): Promise<void> => {
  const s3 = getS3Client();
  const bucketName = process.env.AWS_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("AWS_BUCKET_NAME is not set.");
  }

  try {
    const url = new URL(fileUrl);
    // Pathname starts with /, so slice(1) removes it
    // Based on line 52: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    // The pathname will be `/${key}`.

    const key = url.pathname.slice(1); // Remove leading slash

    if (!key) {
      console.warn("Could not extract key from file URL:", fileUrl);
      return;
    }

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await s3.send(command);
    console.log(`Successfully deleted file from S3: ${key}`);

  } catch (error) {
    console.error("Error deleting file from S3:", error);
  }
};