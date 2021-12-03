"use strict";
import Notification from "../models/notification.js";

export const addNotification = async (req, res) => {
    try {
            const id_user = req.body.id_user;
            const title = req.body.title;
            const description = req.body.description
            const image = req.body.image;
            const newNotification = new Notification({
                id_user,
                title,
                description,
                image,
                status: 0,
            })
            await newNotification.save()
            res.status(200).json(newNotification);
       
    } catch (error) {
        res.status(200).json({ message: error.message })
    }
}

//lấy tất cả thông báo dựa trên id_user
export const getNotificationByIdUser = async (req, res) => {
    try {
        console.log('GET NOTIFICATION');
        const id_user = req.userID;
        const notification = await Notification.find({ id_user })
        console.log(notification);
        res.status(200).json(notification)
    } catch (error) {
        res.status(200).json({ message: error.message })
    }
}

//cập nhật trạng thái 
export const updateStatus = async (req, res) => {
    try {
        console.log('UPDATE STATUS');
        const id_user = req.userID;
        const updateNotification = await Notification.updateMany({ id_user: id_user }, { status: 1 }, { insert: false })
        if (!updateNotification)
            res.status(200).json({ status: 0, message: 'Lỗi cập nhật...' })
        else res.status(200).json({ status: 1 })
    } catch (error) {
        res.status(200).json({ status: 0, message: error.message })
    }
}

export const deleteNotification = async (req, res) => {
    try {
        let _id = req.params.id;
        console.log(_id);
        await Notification.findByIdAndDelete({_id});
        res.status(200).json({mess: "pass"});
    } catch (error) {
        
    }
}