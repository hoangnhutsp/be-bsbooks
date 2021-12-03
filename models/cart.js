import mongoose from 'mongoose';

const cartSchema = mongoose.Schema({
    userID: {
        type: String
    },
    items: [
        {
            _id: String,
            quantity: Number,
            name: String,
            price: Number,
            image: String,
            checked: {
                type: Boolean,
                default: 1,
            }
        }   
    ],
    status : {
        type: Number,
        default: 0,
    },
    count: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Cart = mongoose.model('cart', cartSchema);

export default Cart;