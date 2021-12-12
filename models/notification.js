import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
    id_user: {
        type: mongoose.Types.ObjectId,
        require: true,
    },
    image: {
        type: String,
        default: "https://be-bsbooks.herokuapp.com/default/images/notification.png",
    },
    title: String,
    description: String,
    status: {
        type: Number,
        default: 0,
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})

const Notification = mongoose.model('notifications', notificationSchema);
export default Notification;