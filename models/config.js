import mongoose from 'mongoose';

const configSchema = mongoose.Schema({
    idSeed: Number,
    forCollection: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Config = mongoose.model('config', configSchema);

export default Config;