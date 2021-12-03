'use strict';

import Cart from '../models/cart.js';


const checkInfoCart = cart => {
    return true;
}
const checkUserID = userID => {
    return true;
}
export const addToCart = async (req, res) => {
    try {
        console.log('ADD TO CART');
        let infoCart = req.body;
        let userID = req.userID;

        if (!checkUserID(userID) || !checkInfoCart(infoCart)) {
            res.status(400).json({status: 0});
        }
        else {
            const cart = await Cart.findOne({ userID });
            if (!cart) {
                const newCart = new Cart({
                    userID,
                    items: infoCart,
                    count: 1,
                    status: 0,
                });
                await newCart.save();
            }
            else {
                const items = cart["items"];
                let count = cart.count;

                let indexItem = items.findIndex(q => q["_id"] == infoCart["_id"]);
                if (indexItem !== -1) {
                    items[indexItem]["quantity"] += infoCart["quantity"];
                } else {
                    items.push(infoCart)
                    count++;
                }

                let newcart = {};
                newcart.items = items;
                newcart.count = count;
                await Cart.findByIdAndUpdate(cart["_id"], newcart, { new: true });
            }
            res.status(200).json({ status: 1 });
        }
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

const resDataCart = {
    count: 0,
    items: [],
}
export const getCartItem = async (req, res) => {
    try {
        console.log('get CART ITEM');
        let userID = req.userID;
        console.log(userID);
        const filter = {
            userID: {$eq : userID},
        }

        let cart = await Cart.findOne(filter);

        if (cart) {
            resDataCart.items = cart.items;
            resDataCart.count = cart.count;
        }

        console.log(resDataCart);
        res.status(200).json(resDataCart)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}

export const updateCart = async (req, res) => {
    try {
        let userID = req.userID;
        let infoCart = req.body;
        const filter = {
            userID: {$eq : userID},
            status: {$eq : 0},
        }
        const doc = await Cart.findOneAndUpdate(filter, infoCart, {new: true});
        res.status(200).json(doc)
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
}