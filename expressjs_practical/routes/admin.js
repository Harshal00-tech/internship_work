const path = require('path');

const express = require('express');

const rootDir = require('../util/path');

const router = express.Router();

const productController = require('../controllers/products.controller.js')

// /admin/add-product => GET
router.get('/add-product', productController.fetchForm);

// /admin/add-product => POST
router.post('/add-product', productController.addProduct);

module.exports = router;
