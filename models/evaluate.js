import mongoose from 'mongoose';

const evaluateSchema = mongoose.Schema({
    idUser: {
        type: mongoose.Types.ObjectId
    },
    idProduct: {
        type: mongoose.Types.ObjectId
    },
    star: Number,
    comment: String,
    title: String,
    createAt: {
        type: Date,
        default: Date.now
    },
    deleteAt: {
        type: Date,
        default: null
    }
});

const Evaluate = mongoose.model('evaluates', evaluateSchema);
export default Evaluate;