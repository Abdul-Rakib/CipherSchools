import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: '',
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    template: {
        type: String,
        enum: ['react', 'vanilla'],
        default: 'react',
    },
    lastModified: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
