import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    fileId: {
        type: String,
        required: true,
        unique: true,
    },
    projectId: {
        type: String,
        required: true,
        index: true,
    },
    parentId: {
        type: String,
        default: null,
    },
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['file', 'folder'],
        required: true,
    },
    content: {
        type: String,
        default: '',
    },
    s3Key: {
        type: String,
        default: null,
    },
    language: {
        type: String,
        default: 'javascript',
    },
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);
export default File;
