import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const SECRET = process.env.SECRET;

const createToken = (id) => {
    return jwt.sign({ id }, SECRET, { expiresIn: "30d" })
};

const checkInfo = (info) => {
    if (!info.email || !info.password || !info.name ||
        !info.phone || !info.gender ||
        !info.birthday) return 0;
    return 1;
}

export const getAllUser = async(req, res) => {
    try {
        const allUser = await User.find({role: [ "USER", "ADMIN" ]}).sort({role: 1});
        res.status(200).json(allUser)
    } catch (error) {
        res.status(200).json({message: error.message})
    }
}

export const getProfileUserById = async (req, res) => {
    try {
        const _id = req.query.id;
        const user = await User.findOne({ _id });

        if (user.length !== 0) {
            res.status(200).json(user);
        }
        else
            res.sentStatus(400)
    } catch (error) {
        res.status(200).json({ message: error.message })
    }
}

export const addAdmin = async (req, res) => {
    try {

        let info = req.body;
        if (!checkInfo(info)) {
            res.status(200).json({ status: 0, message: 'Thong tin khong hop le' })
        }

        let email = info.email;

        const find_user = await User.find({ email })
        if (find_user.length) {
            res.status(200).json({ status: 0, message: 'Email da duoc su dung' })
        } else {

            const hashPassword = await bcrypt.hash(info.password, 12);
            info.password = hashPassword;
            const newUser = new User(info);
            await newUser.save();
            res.status(200).json({ status: 1 });
        }
    } catch (error) {
        res.sendStatus(400)
    }
}