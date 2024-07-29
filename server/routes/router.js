// semua routing pada aplikasi

const express = require('express');

// IMPORT CONTROLLERS
const { displayBuku, addBuku, updateBuku, deleteBuku } = require('./controllers/appController')
const { register, login } = require('./controllers/authController')

// menggunakan interface router Express
const router = express.Router();

// routes
// 1 - mem-fetch semua buku
router.get('/buku', displayBuku);

// 2 - menambahkan buku baru
router.post('/add', addBuku);

// 3 - mengupdate buku
router.put('/buku/:id', )