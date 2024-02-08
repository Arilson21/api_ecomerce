const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const slugify = require('slugify');


const createProduct = asyncHandler(async(req, res) => {
    if(req.body.title){
        req.body.slug = slugify(req.body.title);
    }
    try {
        const newProduct = await Product.create(req.body)
        return res.json(newProduct)
    }catch(e) {
        throw new Error(e)
    }
});

const updateProduct = asyncHandler(async(req, res) => {
    const { id } = req.params
    try {
        if(req.body.title){
            req.body.slug = slugify(req.body.title);
        }
        const updateProduct = await Product.findOne({where: { id }});
        updateProduct.update(req.body)
        res.json(updateProduct)

    }catch(e){
        throw new Error(e)
    }
});

const deleteProduct = asyncHandler(async(req, res) => {
    const { id } = req.params
    try {
        const deleteProduct = await Product.findOne({where: { id }});
        deleteProduct.destroy();
        res.json({
            message: 'Product deleted'
        });
    }catch(e){
        throw new Error(e)
    }
});

const getProduct = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params
        const findProduct = await Product.findByPk(id)
        res.json(findProduct)
    }catch(e) {
        throw new Error(e)
    }
});

const getAllProduct = asyncHandler(async(req, res) => {
    try{
        const queryObj = {...req.query}
        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach(element => delete queryObj[element]);

        let queryString = JSON.stringify(queryObj)
        const queryStr = queryString.replace(/\b(gte|gt|lte|lt)\b/g, macth => `$${macth}`)

        let query = Product.findAll({where: JSON.parse(queryStr)})

      /*   //sortiring flata pa ka fz 
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',');
            query.order = sortBy.map(item => item.split(' '));
        } else {
            query.order = [['createdAt', 'ASC']];
        }//3:28:00 ate 3:37:00 categoria ka kre muda  */


        const product = await query

        res.json(product)

    }catch(e){
        throw new Error(e)
    }
})


module.exports = {  
    createProduct, 
    getProduct,
    getAllProduct,
    updateProduct,
    deleteProduct,
}