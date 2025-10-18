import express from 'express';
import { generatePresignedPutUrl, generatePresignedGetUrl, deleteFileFromS3, checkIfObjectExists } from '../controllers/s3.js';

const router = express.Router();

router.post('/generate-presigned-put-url', generatePresignedPutUrl);
router.post('/generate-presigned-get-url', generatePresignedGetUrl);
router.post('/delete-file', deleteFileFromS3);
router.post('/check-object-exists', checkIfObjectExists);

export default router;