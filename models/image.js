import mongoose from 'mongoose';

const imageSchema = mongoose.Schema({
    idSession: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
})