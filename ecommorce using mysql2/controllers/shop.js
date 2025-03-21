const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([products, metadata]) => {
      res.render('shop/product-list', { 
        prods: products,
        pageTitle: 'All Products',
        path: '/products'
      });
    })
    .catch((err) => {
      console.log(err)
    })
    
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(([product, metadeta]) => {
      res.render('shop/product-detail', {
        product: product[0],
        pageTitle: product[0].title,
        path: '/products'
      })
    })
    .catch((err) => {
      console.error(err)
    })
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
      .then(([products, field]) => {
        res.render('shop/index', {
          prods: products,
          pageTitle: 'Shop',
          path: '/'
        });
      })
};

exports.getCart = async (req, res, next) => {
  try {
    const data = await Cart.fetchCartProduct()
    let totalPrice = 0 
    for(let productDetail of data[0]){
      totalPrice += productDetail.quantity * productDetail.price
    }
    cartProducts = [data[0], totalPrice]
    console.log(cartProducts)
    res.render('shop/cart', {
      path: '/cart',
      pageTitle: 'Your Cart',
      products: cartProducts
    });
  } catch (error) {
    console.error(error)
  }
};

exports.postCart = async (req, res, next) => {
  const productId = req.params.productId
  console.log(productId)
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  await Cart.deleteProduct(prodId)
  res.redirect('/');
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
