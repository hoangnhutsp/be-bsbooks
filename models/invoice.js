import mongoose from 'mongoose';

const invoiceSchema = mongoose.Schema({
    userID: String,
    items: [
        {
            _id: String,
            name: String,
            price: Number,
            quantity: Number,
            image: String,
        }   
    ],
    update: [Date],
    status_invoice : {
        type: Number,
        default: 0,
    },
    name: String,
    email: String,
    phone: String,
    address: String,
    sum_price: Number,
    ship_price: Number,
    total: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Invoice = mongoose.model('invoice', invoiceSchema);

export default Invoice;