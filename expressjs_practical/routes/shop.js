const path = require('path');
const express = require('express');
const rootDir = require('../util/path');
const router = express.Router();

const shopController = require('../controllers/products.controller')

router.get('/', shopController.showProductList);

module.exports = router;
