const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');

// ✅ Get ALL products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get SINGLE product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid product ID' });
  }
};

// ✅ CREATE product (🔥 FIXED)
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, countInStock } = req.body;

    let image = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image = result.secure_url;
    }

    const product = new Product({
      name,
      description,
      price: Number(price),                   // ✅ convert to number
      category,
      countInStock: Number(countInStock),     // ✅ CRITICAL FIX
      image
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ UPDATE product (🔥 FIXED)
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name ?? product.name;
      product.description = description ?? product.description;
      product.price = price !== undefined ? Number(price) : product.price;
      product.category = category ?? product.category;

      // 🔥 IMPORTANT FIX (allows 0 also)
      product.countInStock =
        countInStock !== undefined
          ? Number(countInStock)
          : product.countInStock;

      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        product.image = result.secure_url;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);

    } else {
      res.status(404).json({ message: 'Product not found' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ DELETE product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};