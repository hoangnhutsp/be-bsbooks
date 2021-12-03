import mongoose from 'mongoose';

const sessionSchema = mongoose.Schema({
    time: [Date],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Session = mongoose.model('session', sessionSchema);

export default Session;