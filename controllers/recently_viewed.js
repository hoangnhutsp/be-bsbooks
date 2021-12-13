"use strict";

import Product from '../models/product.js';
import RecentlyViewed from '../models/recently_viewed.js'
import mongoose from 'mongoose';

const DEFAULT_SIZE_RECENTLY_VIEWED = 4;

export const getRecentlyViewed = async (req, res) => {
    try {
        let id_session = req.sessionID;

        const recentlyViewed = await RecentlyViewed
            .find({
                id_session,
            })
            .sort({ createdAt: "desc" })
            .limit(DEFAULT_SIZE_RECENTLY_VIEWED);

        console.log(recentlyViewed);
        let recentlyViewedProduct = [];
        for (let i = 0; i < recentlyViewed.length; i++){
            let id_product = recentlyViewed[i].id_product;
            let product = await Product.findOne({_id: id_product});

            recentlyViewedProduct.push(product);
        }

        res.status(200).send(recentlyViewedProduct);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const updateRecentlyViewed = async (req, res, next) => {
    try {
        let id_product = req.params.id;
        let id_session = req.sessionID;

        const recentlyView = {
            id_session,
            id_product,
        };

        const re = await RecentlyViewed.findOneAndUpdate({
            id_session,
            id_product,
        },
            { createdAt: new Date() }
        )
        if (!re) {
            const newRecentlyViewed = new RecentlyViewed(recentlyView);
            await newRecentlyViewed.save();
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}