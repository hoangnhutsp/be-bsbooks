import mongoose from 'mongoose';

const recentlyViewedSchema = mongoose.Schema({
    id_session: String,
    id_product: String,
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const RecentlyViewed = mongoose.model('recently_viewed', recentlyViewedSchema);

export default RecentlyViewed;