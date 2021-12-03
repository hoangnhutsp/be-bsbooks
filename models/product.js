import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    id: Number,
    id_category: Number,
    name: String,
    short_description: String,
    price: Number,
    discount: {
        type: Number,
        default: 0,
    },
    discount_rate: {
        type: Number,
        default: 0,
    },
    rating_average: {
        type: Number,
        default: 0,
    },
    review_count:  {
        type: Number,
        default: 0,
    },
    thumbnail_url: String,
    inventory_status: String,
    publisher: {
        type: String,
        default: ''
    },
    author_name: String,
    day_ago_created: Number,
    idx_name: String,
    idx_author_name: String,
    createdAt:{
        type: Date,
        default: Date.now(),
    },
    deletedAt: {
        type: Date,
        default: null,
    }
});

const Product = mongoose.model('products', productSchema);

export default Product;
