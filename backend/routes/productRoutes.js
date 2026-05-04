const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// 🔥 multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });


// ✅ GET ALL PRODUCTS
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ✅ GET SINGLE PRODUCT
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID' });
    }
});


// ✅ CREATE PRODUCT
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category, countInStock } = req.body;

        let imageUrl = '';

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            imageUrl = result.secure_url;
        }

        const product = new Product({
            name,
            description,
            price,
            category,
            countInStock,
            image: imageUrl
        });

        const createdProduct = await product.save();

        res.status(201).json(createdProduct);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ✅ UPDATE PRODUCT
router.put('/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category, countInStock } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.category = category || product.category;
        product.countInStock = countInStock ?? product.countInStock;

        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path);
            product.image = result.secure_url;
        }

        const updatedProduct = await product.save();

        res.json(updatedProduct);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ✅ DELETE PRODUCT 🔥 (THIS FIXES YOUR ISSUE)
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        await product.deleteOne();

        res.json({ message: 'Product deleted successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;