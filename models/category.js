import mongoose from 'mongoose';

const categorySchema = mongoose.Schema({
    id: Number,
    name: String,
    id_parent: Number,
    id_path: String,
});

const Category = mongoose.model('categorys', categorySchema);

export default Category;
