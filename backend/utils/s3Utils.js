// s3Utils.js
import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({
    region: 'ap-south-1',
});


export const getPresignedPutUrl = async (fileName, fileType) => {
    const key = `Printlab/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
        Bucket: 'printlabs-bucket',
        Key: key,
        ContentType: fileType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 120 }); // 2 mins
    return { url, key };
};


export const getPresignedGetUrl = async (key) => {
    const command = new GetObjectCommand({
        Bucket: 'printlabs-bucket',
        Key: key,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // 1 min
    return url;
};


export const deleteFileFromS3 = async (key) => {
    const command = new DeleteObjectCommand({
        Bucket: 'printlabs-bucket',
        Key: key,
    });

    await s3.send(command);
    return true;
};


export const checkIfObjectExists = async (key) => {
    const command = new HeadObjectCommand({
        Bucket: 'printlabs-bucket',
        Key: key,
    });

    try {
        const response = await s3.send(command);
        return { exists: true, metadata: response };
    } catch (error) {
        if (error.name === 'NotFound') {
            return { exists: false };
        }
        throw error;
    }
};

// ✅ Get File Buffer (for processing or previewing)
export const getFileBuffer = async (key) => {
    const url = await getPresignedGetUrl(key);
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
};
