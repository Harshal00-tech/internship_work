
// const products = []
const Product = require('../models/product')
module.exports.fetchForm =  (req, res, next) => {
    res.render('add-product', {docTitle : "Add product", path : 'add-product', addProductTab : true})
}

module.exports.addProduct = (req, res, next) => {
    // products.push(req.body)
    const product = new Product(req.body.title)
    product.save()
    res.redirect('/');  
}

module.exports.showProductList = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop', {products : products , docTitle : 'My Shop', path : 'shop', shopTab : true, productLength : products.length > 0})
    })
}