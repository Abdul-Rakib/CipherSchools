import { getPresignedPutUrl, getPresignedGetUrl, deleteFileFromS3 as deleteFromS3, checkIfObjectExists as checkObject } from "../utils/s3Utils.js";

export const generatePresignedPutUrl = async (req, res) => {
    try {
        const { fileName, fileType } = req.body;
        const { url, key } = await getPresignedPutUrl(fileName, fileType);
        res.status(200).json({
            success: true,
            msg: 'Presigned URL generated successfully',
            data: { url, key },
        });
    } catch (err) {
        console.error('Failed to generate presigned URL:', err);
        res.status(500).json({
            success: false,
            msg: 'Failed to generate presigned URL',
        });
    }
};

export const generatePresignedGetUrl = async (req, res) => {
    try {
        const { key } = req.body;
        const url = await getPresignedGetUrl(key);
        res.status(200).json({
            success: true,
            msg: 'Presigned GET URL generated successfully',
            data: { url },
        });
    } catch (err) {
        console.error('Failed to generate GET presigned URL:', err);
        res.status(500).json({
            success: false,
            msg: 'Failed to generate GET presigned URL',
        });
    }
};

export const deleteFileFromS3 = async (req, res) => {
    try {
        const { key } = req.body;
        await deleteFromS3(key);
        res.status(200).json({
            success: true,
            msg: 'File deleted successfully.',
        });
    } catch (err) {
        console.error('Failed to delete file:', err);
        res.status(500).json({
            success: false,
            msg: 'Failed to delete file from S3',
        });
    }
};

export const checkIfObjectExists = async (req, res) => {
    try {
        const { key } = req.body;
        const result = await checkObject(key);

        res.status(200).json({
            success: true,
            msg: result.exists ? 'Object exists' : 'Object does not exist',
            data: result,
        });
    } catch (error) {
        console.error('Error checking object:', error);
        res.status(500).json({
            success: false,
            msg: 'Failed to check object',
        });
    }
};
