'use strict';

import Evaluate from '../models/evaluate.js';
import User from '../models/user.js';
import Product from '../models/product.js';

export const addEvaluate = async (req, res) => {
    try {
        //idUser, idProduct, star not null

        console.log('ADD -- suc');
        //console.log(req.body);
        if (!req.userID || !req.body.idProduct || !req.body.star ||
            typeof req.userID == 'default' || typeof req.body.idProduct == 'default' || typeof req.body.star == 'default') {
            res.status(200).json({ message: 'idUser or idProduct or star null' })
        }
        else {
            const idUser = req.userID;
            const idProduct = req.body.idProduct;
            let user = await User.find({ _id: idUser });
            let product = await Product.findOne({ _id: idProduct });
            //check user and product exist
            if (user.length === 0 || product.length === 0) {
                res.status(200).json({ message: 'User or Product not exist' });
            }
            else {
                // lưu đánh giá
                const star = req.body.star;
                let comment = req.body.comment;
                let title = req.body.title;
                //check comment 
                if (!comment || typeof comment == 'default')
                    comment = null;
                const newEvaluate = new Evaluate({
                    idUser: idUser,
                    idProduct: idProduct,
                    star: star,
                    comment: comment,
                    title: title,
                });
                await newEvaluate.save();
                //cập nhật sao trung bình và số lượng đánh giá
                let review_count = product.review_count + 1;
                let rating_average = (product.rating_average * product.review_count + star)/review_count;
                rating_average = rating_average.toFixed(1);
                const updateProduct = await Product.findByIdAndUpdate(idProduct, {review_count: review_count, rating_average: rating_average}, {new: true})
                res.status(200).json(newEvaluate);
            }
        }

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getEvaluateToProduct = async (req, res) => {
    try {
        const idProduct = req.params.idProduct;

        console.log('getEvaluateToProduct');
        console.log(idProduct);
        let product = await Product.find({ _id: idProduct })
        //check product not exist
        if (product.length === 0) {
            res.status(200).json({ message: 'Product not exist' });
        }
        else {
            console.log(idProduct);
            let evaluate = await Evaluate.find(
                { idProduct: idProduct },
                {idUser:1, star:1, comment:1, title:1}    
            )

            console.log(evaluate);
            let resData = [];
            
            for (let eva of evaluate){
                let newRes = {};
                newRes.idUser = eva.idUser;
                newRes.title = eva.title;
                newRes.comment = eva.comment;
                newRes.star = eva.star;


                let idUser = eva.idUser; 
                const infoUser = await User.findOne({_id: idUser}, {
                    name: 1,
                    avatar: 1
                })
                newRes.avatar = infoUser.avatar;
                newRes.name = infoUser.name;
                resData.push(newRes)
            }

            res.status(200).json(resData);
        }

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateEvaluateToStar = async (req, res) => {
    try {
        //check date creatAt,  star or user not null
        if (!req.body.createAt || typeof req.body.createAt == 'default' || 
        !req.body.star || typeof req.body.star == 'default' ||
        !req.userId.id || typeof req.userId.id == 'default') {
            res.status(200).json({ message: 'CreateAt or star is null' });
        }
        else {
            const idUser = req.userId.id;
            const idProduct = req.params.idProduct;
            const createAt = req.body.createAt;
            const star = req.body.star;
            const user = await User.find({ _id: idUser });
            const product = await Product.find({ _id: idProduct });
            // check product and user exist
            if (user.length === 0 || product.length === 0) {
                res.status(200).json({ message: 'User or Product not exist' });
            }
            else {
                const updateEvalueteStar = await Evaluate.findOneAndUpdate({
                    idUser: idUser,
                    idProduct: idProduct,
                    createAt: createAt
                }, { star: star }, { new: true });
                res.status(200).json(updateEvalueteStar);
            }
        }
    } catch (error) {
        res.status(404).json({ message: message.error });
    }
}
export const updateEvaluateToComment = async (req, res) => {
    try {
        //check date creatAt or star not null
        if (!req.body.createAt || typeof req.body.createAt == 'default' || 
        !req.body.comment || typeof req.body.comment == 'default' ||
        !req.userId.id || typeof req.userId.id == 'default') {
            res.status(200).json({ message: 'CreateAt or comment is null' });
        }
        else {
            const iduser = req.userId.id;
            const idProduct = req.params.idProduct;
            const createAt = req.body.createAt;
            const comment = req.body.comment;
            const user = await User.find({ _id: iduser });
            const product = await Product.find({ _id: idProduct });
            // check product and user exist
            if (user.length === 0 || product.length === 0) {
                res.status(200).json({ message: 'User or Product not exist' });
            }
            else {
                const updateEvalueteComment = await Evaluate.findOneAndUpdate({
                    idUser: iduser,
                    idProduct: idProduct,
                    createAt: createAt
                }, { comment: comment }, { new: true });
                res.status(200).json(updateEvalueteComment);
            }
        }
    } catch (error) {
        res.status(404).json({ message: message.error });
    }
}