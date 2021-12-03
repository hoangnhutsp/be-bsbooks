"use strict";

import Product from '../models/product.js';
import Category from '../models/category.js'
import ProductDetail from '../models/product_detail.js'
import Config from '../models/config.js';

const DEFAULT_PAGE = 1;
const DEFAULT_SIZE_PAGE = 20;
const DEFAULT_PRICE = "0,100000000";
const DEFAULT_RATING = 0;
const DEFAULT_SORT = "review_count,desc";
const DEFAULT_CRITERIA = "desc";
const DEFAULT_CATEGORY = 1;
const SIZE_OF_SUGGESTION = 6;
const DEFAULT_MAX_PRICE = 100000000;

export const getProduct = async (req, res) => {
    try {
        const product = await Product.find();
        res.status(200).json({
            product
        })

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
