const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  try {
    req.user.createProduct({
      title, imageUrl, price, description
    })
    res.redirect('/admin/products');
  } catch (error) {
    console.log(error)
  }
};

exports.getEditProduct = async  (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  const products = await req.user.getProducts({where: { id : prodId }})
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
    product: products[0]
  });
};

exports.postEditProduct = async  (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;
  try {
    const response = await Product.update({title: updatedTitle, price: updatedPrice, imageUrl: updatedImageUrl, description: updatedDesc}, {where : {id: prodId}})
    res.redirect('/admin/products');
  } catch (error) {
    console.log(error)
  }  
};  

exports.getProducts = async (req, res, next) => {
  const products = await req.user.getProducts()
  res.render('admin/products', {
    prods: products,
    pageTitle: 'Admin Products',
    path: '/admin/products'
  });
};

exports.postDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  await Product.destroy({where: {id : prodId}});
  res.redirect('/admin/products');
};
