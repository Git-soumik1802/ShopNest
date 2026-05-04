const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const importData = async () => {
  try {
    console.log("🚀 Seeding started...");

    await User.deleteMany();
    await Product.deleteMany();

    // Create admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@shopnest.com',
      password: hashedPassword,
      role: 'admin'
    });

    // ✅ MATCHED WITH YOUR MODEL
    const products = [
      {
        name: 'Wireless Noise-Cancelling Headphones',
        description: 'Immersive sound with active noise cancellation.',
        price: 299.99,
        category: 'Electronics',
        countInStock: 15,
        image: 'https://media.extra.com/s/aurora/100306854_800/Anker-Soundcore-Active-Noise-Cancelling-Headphone%2C-Black-?locale=en-GB,en-*,*',
        rating: 4.8,
        numReviews: 24
      },
      {
        name: 'Minimalist Modern Chair',
        description: 'Stylish and comfortable chair.',
        price: 150,
        category: 'Furniture',
        countInStock: 30,
        image: 'https://th.bing.com/th/id/OIP.u0lXemJx0iRqsnyfn0dvewHaE7?w=279&h=186&c=7&r=0&o=7&dpr=1.7&pid=1.7&rm=3',
        rating: 4.2,
        numReviews: 12
      },
      {
        name: 'Professional DSLR Camera',
        description: 'High-resolution DSLR camera.',
        price: 1199.99,
        category: 'Electronics',
        countInStock: 8,
        image: 'https://tse2.mm.bing.net/th/id/OIP.O-jmYJ0Oz6jlAkuljlN5IAHaD3?pid=ImgDet&w=198&h=103&c=7&dpr=1.7&o=7&rm=3',
        rating: 4.9,
        numReviews: 50
      },
      {
        name: 'Classic White Sneakers',
        description: 'Comfortable casual sneakers.',
        price: 85,
        category: 'Clothing',
        countInStock: 50,
        image: 'https://th.bing.com/th/id/OIP.3BfTm2eOksvkArx-owlKTQHaFL?w=179&h=150&c=6&o=7&dpr=1.7&pid=1.7&rm=3',
        rating: 4.5,
        numReviews: 89
      }
    ];

    await Product.insertMany(products);

    console.log('✅ Data Imported Successfully!');
    process.exit();

  } catch (error) {
    console.error(`❌ Seeder Error: ${error.message}`);
    process.exit(1);
  }
};

importData();