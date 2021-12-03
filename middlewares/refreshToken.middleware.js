import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const SECRET = 'bsbooksToken';

const createToken = (id) => {
    return jwt.sign({ id }, SECRET, {expiresIn: "30d"})
};

export const refreshTokenMiddleware = async (req, res, next) => {
    try {
        if (req.headers.authorization && req.headers.authorization.split(" ")[1] !== 'undefined') {
            const token = req.headers.authorization.split(" ")[1];
            let decodedData = jwt.verify(token, SECRET);
            const user = await User.find({ _id: decodedData.id });
            if (user.length === 0) {
                res.status(200).json({ message: 'User not exist' });
            }
            const refrToken = createToken(decodedData.id);
            let tokenUpdate = user[0]["token"];
            req.oldToten = tokenUpdate;
            req.refreshToken = refrToken;
            //Lấy những token khác với token đang gửi
            tokenUpdate = tokenUpdate.filter((tokens) => {
                return tokens !== token
            })
            //thêm refrToken vào trong danh sách token
            tokenUpdate.push(refrToken);
            const userUpdate = await User.findByIdAndUpdate(decodedData.id, { token: tokenUpdate }, { new: true });
        }
        else
            console.log('Not refresh token')
        next()
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
