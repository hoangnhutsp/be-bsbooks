import mongoose from 'mongoose';

const permissionSchema = mongoose.Schema({
    name: String,
    path: String,
    method: String,
    description: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Permission = mongoose.model('permission', permissionSchema);

export default Permission;