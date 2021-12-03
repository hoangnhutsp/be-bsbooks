import mongoose from 'mongoose';

const rolePermissionSchema = mongoose.Schema({
    role: String,
    permission: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const RolePermission = mongoose.model('role_permission', rolePermissionSchema);

export default RolePermission;