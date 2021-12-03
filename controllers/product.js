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

const getListCate = async (query) => {
    try {
        let id = query.category || DEFAULT_CATEGORY;

        if (id > 40) id = DEFAULT_CATEGORY;
        const category = await Category.find({ id: id })
        if (category === []) {
            console.log(' WR: URL LOCAL MONGO DB');
        }
        let id_path = category[0]["id_path"];
        let cate = await Category.find({ id_path: { $regex: RegExp(`^${id_path}`) } })
        let arrCate = [];
        cate.forEach(element => arrCate.push(element["id"]));
        return arrCate;

    } catch (error) {
        console.log('WR: getListCate');
        return [];
    }
}

const getBreadcrumbCategory = async (query) => {
    let category = query.category || DEFAULT_CATEGORY;
    let cate = await Category.findOne({ id: category })
    let breadcrumb = [];

    if (cate) {
        let id_path = cate.id_path.split('-');
        for (let i = 0; i < id_path.length; i++) {
            if (id_path[i] == 0) continue;
            let { name } = await Category.findOne({ id: id_path[i] })
            breadcrumb.push({ name, path: `/product/${id_path[i]}` })
        }
    }

    return breadcrumb
}
const initQuery = async (query) => {
    let category = await getListCate(query);
    let price = query.price || DEFAULT_PRICE;
    price = String(price).split(',');
    let minPrice = Number(price[0]);
    let maxPrice = Number(price[1]);
    if (!maxPrice) maxPrice = DEFAULT_MAX_PRICE
    let q = query.q;
    let rating = query.rating || DEFAULT_RATING;
    const queryString = {
        price: { $gt: minPrice, $lt: maxPrice },
        rating_average: { $gt: rating - 1 },
        id_category: { $in: category },
        deletedAt: null
    }

    if (q) {
        q = removeVietnameseAccent(q).toLowerCase();
        queryString['$text'] = { $search: q }
    }

    return queryString;
}

const initSort = (query) => {
    let sort = String(query.sort || DEFAULT_SORT).split(',');
    let type = sort[0];
    let criteria = sort[1] || DEFAULT_CRITERIA;


    let queryString = {}

    if (query.q) {
        queryString = {
            score: { $meta: "textScore" },
        }
    } else 
    if (query.sort !== undefined)
    {
        queryString = {
            [type]: criteria,
        }
    }

    return queryString;
}


const slicePage = (page, product) => {
    let start = (page - 1) * DEFAULT_SIZE_PAGE;
    let end = Math.min(page * DEFAULT_SIZE_PAGE, product.length);
    product = product.slice(start, end);
    return product;
}
export const getProduct = async (req, res) => {
    try {
        let tmp = await Product.find();
        const query = req.query;
        const queryString = await initQuery(query);
        const sortString = initSort(query);
        let textScore = {}

        if (query.q) textScore['score'] = { $meta: "textScore" };
        let product = await Product.find(queryString, textScore).sort(sortString);
        const size = product.length;

        let page = query.page || DEFAULT_PAGE;
        const pageMax = Math.floor((size - 1) / DEFAULT_SIZE_PAGE) + 1;
        page = Math.max(page, 1);
        page = Math.min(page, pageMax)
        product = slicePage(page, product)


        let breadcrumb = await getBreadcrumbCategory(query);

        let minPrice = queryString.price.$gt;
        let maxPrice = queryString.price.$lt;

        res.status(200).json({
            size,
            crrSize: product.length,
            page,
            pageMax,
            product,
            breadcrumb,
            queryPrice: { minPrice, maxPrice },
            queryRating: queryString.rating_average.$gt + 1
        })

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const attributeProductDetails = [
    "_id",
    "id",
    "id_category",
    "name",
    "short_description",
    "price",
    "discount",
    "discount_rate",
    "rating_average",
    "review_count",
    "thumbnail_url",
    "inventory_status",
    "publisher",
    "author_name",
    "description",
    "specifications",
    "images"
];

export const getProductByID = async (req, res) => {
    try {
        let _id = req.params.id;

        let product = await Product.findOne({ _id, deletedAt: null });

        if (product !== null) {
            let id = product["id"];
            let productDetail = await ProductDetail.findOne({ id, deletedAt: null });
    
            let data = {};
            for (let x of attributeProductDetails) {
                if (x in product) {
                    data[x] = product[x];
                } else
                    if (x in productDetail) {
                        data[x] = productDetail[x];
                    }
            }
    
            let x = {};
            x.category = data.id_category;
            let breadcrumb = await getBreadcrumbCategory(x);
    
            res.status(200).json({ data, breadcrumb });
        
        } else {
            res.status(400).json({ message: 'Khong tim thay san pham' });

        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const checkInfoProduct = (product) => {
    return true;
}
function removeVietnameseAccent (str) {
    // remove accents
    var from = "àáãảạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệđùúủũụưừứửữựòóỏõọôồốổỗộơờớởỡợìíỉĩịäëïîöüûñçýỳỹỵỷ",
        to   = "aaaaaaaaaaaaaaaaaeeeeeeeeeeeduuuuuuuuuuuoooooooooooooooooiiiiiaeiiouuncyyyyy";
    for (var i=0, l=from.length ; i < l ; i++) {
      str = str.replace(RegExp(from[i], "gi"), to[i]);
    }
  
    str = str.toLowerCase().trim().replace(/[^a-z0-9\-]/g, ' ')
    return str;
}
export const createProduct = async (req, res) => {
    try {
        let { newProduct, newProductDetail, image } = req.body;
        if (!newProduct || !newProductDetail || !image) {
            return res.status(500).json({ message: "Info not valid!!!" })
        }

        const config = await Config.findOne({forCollection: 'product'});


        if (config !== null) {
            let id = config.idSeed + 1;
            newProduct.id = newProductDetail.id = id;

            await Config.findByIdAndUpdate({_id: config._id}, {idSeed: id});

            //SOL: product
            newProduct.idx_name = removeVietnameseAccent(newProduct.name);
            newProduct.idx_author_name = removeVietnameseAccent(newProduct.author_name);
            newProduct.short_description = newProductDetail.description;
            if (newProduct.short_description.length > 200)
                newProduct.short_description = newProduct.short_description.slice(0, 200) + '...';
            newProduct.thumbnail_url = image;
            newProduct.inventory_status = "available"
            newProduct.day_ago_created = 1


            newProductDetail.images[0] = image
            const newP = new Product(newProduct);
            const newPD= new ProductDetail(newProductDetail);

            await newP.save();
            await newPD.save();
        }
        res.status(201).json({ status: 1});

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const updateProduct = async (req, res) => {
    const product = req.body;
    if (!product) {
        return res.status(400).send({ message: "Data update can not empty" })
    }
    let _id = product._id;
    let id = product.id;
    try {
        await Product.findByIdAndUpdate(_id, product, { useFindAndModify: true });
        let { specifications, description } = product
        await ProductDetail.findOneAndUpdate({ id }, { specifications, description }, { useFindAndModify: true })
        res.status(201).json({ message: "sussessfully!!!" })
    } catch (error) {
        res.status(500).json({ message: "Error Update user information" });
    }

}

export const searchProduct = async (req, res) => {
    try {
        const query = req.query;

        let q = query.q;
        let product = await Product
            .find({
                $text:
                {
                    $search: q,
                },

            },
                { score: { $meta: "textScore" } }
            )
            .sort({ score: { $meta: "textScore" } })

        res.status(200).json(product)
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const suggestionProduct = async (req, res) => {
    try {
        let q = req.query.q;
        let regex = new RegExp(q, 'i');
        const product = await Product.find({ idx_name: regex, deletedAt: null }, { name: 1 }).limit(SIZE_OF_SUGGESTION);
        res.status(200).json({ size: product.length, product })

    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getProductByCategoryLimit = async (req, res) => {
    try {
        const query = req.query;
        let category = await getListCate(query);
       
        const queryString = {
            id_category: { $in: category },
            deletedAt: null,
        }
        let product = await Product.find(queryString);

        const cate = await Category.findOne({ id: query.category });
        product = product.slice(0, query.limit);
        res.status(200).json( {title: cate.name, product})
    } catch (error) {
        res.status(400).json(error)
    }
}

export const deleteProductByID = async (req, res) => {
    try {
        let _id = req.params._id;

        const {id} = await Product.findOneAndUpdate({_id}, {deletedAt: Date.now()}, { useFindAndModify: true });
        await ProductDetail.findOneAndUpdate({id}, {deletedAt: Date.now()})
        res.status(200).json({status: 1, message: 'remove success'});
    } catch (error) {   
        res.sendStatus(400);
    }

}