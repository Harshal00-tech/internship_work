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
  const products = new Product(title, imageUrl, description, price, req.user._id)
  products.save() 
    .then((data) => {
      res.redirect('/')
    })
    .catch(err => {
      throw new Error('data insertion Error')
    })
};

exports.getEditProduct = async  (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  const prodId = req.params.productId;
  const product = await Product.fetchProduct(prodId)
  res.render('admin/edit-product', {
    pageTitle: 'Edit Product',
    path: '/admin/edit-product',
    editing: editMode,
    product: product
  });
};

exports.postEditProduct = async  (req, res, next) => {
  const _id = req.body.productId;
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  try {
    const product = await Product.updateProduct({_id, title, imageUrl, description, price, userId : req.user._id})
    res.redirect('/admin/products');
  } catch (error) {
    console.log(error)
  }  
};  

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll()
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products'
    });
  } catch (error) {
    throw new Error('Product fetching Error')
  }
  
};

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const prodId = req.body.productId;
    await Product.deleteById(prodId)
    res.redirect('/admin/products');
  } catch (error) {
    throw error
  }
};
