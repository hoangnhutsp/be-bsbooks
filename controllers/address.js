'use strict';

import Address from '../models/address.js';
import User from '../models/user.js';
import MESSAGE_ADDRESS from './../constant/messageAddress.js'

export const addAddress = async (req, res) => {
    try {
        const data = req.body;
        let idUser = req.userID;
        const listAddress = await Address.find({ id_user: idUser })
        const sameAddress = listAddress.filter(addr => {
            return (addr['address'] === data.address)
        })
        if (sameAddress.length != 0){

            res.status(200).json({ message: 'Địa chỉ đã tồn tại' })}
        else {
            let def = 0;
            if (listAddress.length === 0) def = 1;
            const newAddress = new Address({
                id_user: idUser,
                address: data.address,
                is_default: def,
                phone: data.phone,
                // email: data.email,
                name: data.name,
            })

            console.log(newAddress);
            await newAddress.save()
            res.status(200).json(newAddress)
        }
    } catch (error) {
        res.sendStatus(400);
    }
}

//Lấy thông tin địa chỉ theo id
export const getAddressById = async (req, res) => {
    try {
        const idUser = req.userID;
        //kiểm tra user có tồn tại không
        const user = await User.findOne({ _id: idUser });
        if (!user)
            res.status(200).json({ message: 'Bạn cần phải đăng nhập' })
        else {
            const id_address = req.params.id;
            const address = await Address.findOne({ _id: id_address });
            if (!address)
                res.status(200).json({ message: 'Địa chỉ không tồn tại' })
            else res.status(200).json(address);
        }

    } catch (error) {
        res.sendStatus(400);
    }

}
//Lấy thông tin địa chỉ bằng id_user
export const getAddressByIdUser = async (req, res) => {
    try {
        console.log('GET ID USER');
        const idUser = req.userID;
        const user = await User.findOne({ _id: idUser });
        if (!user)
            res.status(200).json({ message: 'Bạn cần phải đăng nhập' });
        else {
            const address = await Address.find({ id_user: idUser }).sort({is_default: 'desc'})
            const count_address = address.length;
            res.status(200).json({ result: address, count_address })
        }
    } catch (error) {
        res.sendStatus(400);
    }
}

//Sửa địa chỉ
export const updateAddress = async (req, res) => {
    try {
        const idUser = req.userID;
        const id_address = req.params.id;
        const user = await User.findOne({ _id: idUser });
        if (!user)
            res.status(200).json({ message: 'Bạn cần phải đăng nhập' })
        else {
            //kiểm tra address rỗng
            if (!req.body.address)
                res.status(200).json({ message: 'Vui lòng điền địa chỉ' })
            else {
                const data = req.body
                console.log(data);
                const updateAddress = await Address.findByIdAndUpdate(id_address, data, { new: true })
                res.status(200).json(updateAddress);
            }
        }
    } catch (error) {
        res.sendStatus(400);
    }
}
//Đặt làm defaul
export const setAddressDefaul = async (req, res) => {
    try {
        console.log('setAddressDefault ???');
        const idUser = req.userID;
        const user = await User.findOne({ _id: idUser });
        if (!user)
            res.status(400).json({ message: 'Bạn cần phải đăng nhập' })
        else {
            const id_address = req.params.id;
            console.log('id_address: ', id_address)
            const isExist = await Address.findById(id_address);
            if (!isExist)
                res.status(400).json({ message: 'Địa chỉ không tồn tại' })
            else {
                const setNotDefaul = await Address.updateMany({ id_user: idUser }, { is_default: 0 }, { insert: false })
                const setDefaul = await Address.findByIdAndUpdate(id_address, { is_default: 1 }, { new: true })
                if (!setDefaul) {
                    res.status(400).json({ message: "Lỗi cập nhật..." })
                }
                else res.status(200).json(setDefaul)
            }
        }
    } catch (error) {
        res.sendStatus(400);
    }
}

//Xóa địa chỉ
export const deleteAddress = async (req, res) => {
    try {
        console.log('router');
        const idUser = req.userID;
        const user = await User.findOne({ _id: idUser });
        console.log(user);

        if (!user)
            res.status(200).json({ message: "Bạn cần đăng nhập" })
        else {
            const id_address = req.params.id;
            console.log(id_address);
            const isExist = await Address.findById(id_address);
            console.log(isExist);
            if (!isExist)
                res.status(200).json({ message: 'Địa chỉ không tồn tại' })
            else {
                console.log('delete address');
                const deleteAddr = await Address.findByIdAndDelete(id_address);
                console.log(deleteAddr)
                if (!deleteAddr)
                    res.status(200).json({ message: "Lỗi cập nhật..." })
                else res.status(200).json(deleteAddr);
            }
        }
    } catch (error) {
        res.sendStatus(400);
    }
}