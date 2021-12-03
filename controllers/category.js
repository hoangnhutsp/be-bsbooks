import mongoose from 'mongoose';
import Category from '../models/category.js';

export const getCategory = async (req, res) => {
    try {
        let category = await Category.find();
        res.status(200).json(category)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const getCategoryByID = async (req, res) => {
    try {
        const id = req.params.id
        const category = await Category.find({ id: id });
        if (category.length !== 0)
            res.status(200).json(category)
        else
            res.status(200).json({ message: "NOT FOUND" })

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}
