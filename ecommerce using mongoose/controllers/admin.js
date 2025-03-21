const Order = require('../models/order');
const Product = require('../models/product');
const fs = require('fs')

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isLogin : req.session.isLogin,
    product : ''
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: '/' + imageUrl.path,
    userId: req.session.user
  });
  product
    .save()
    .then(result => {
      res.redirect('/admin/products');
    })
    .catch(error => {
      console.log(error)
      // const err = new Error(error)
      // res.status(500)
      // next(err) 
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  Product.findOne({_id : prodId, userId : req.session.user._id})
    .then(product => {
      // if (!product) {
      //   return res.redirect('/admin');
      // }
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: product,
        isLogin : req.session.isLogin,
      });
    })
    .catch(error => {
      console.log(error)
      // const err = new Error(error)
      // res.status(500)
      // next(err) 
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.file;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then(product => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (updatedImageUrl){
          product.imageUrl = '/' + updatedImageUrl.path;
      }
      return product.save();
    })
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/admin/products');
    })
    .catch(error => {
      // const err = new Error(error)
      // res.status(500)
      // next(err)
      console.log(error)
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({userId : req.session.user._id})
    .then(products => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
        isLogin : req.session.isLogin
      });
    })
  .catch(error => {
    const err = new Error(error)
    res.status(500)
    next(err) 
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch(error => {
      const err = new Error(error)
      res.status(500)
      next(err) 
    });
};

