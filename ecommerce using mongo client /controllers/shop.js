const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.fetchAll()
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
  } catch (error) {
    throw new Error('Product fetching Error')
  }
    
};

exports.getProduct = async  (req, res, next) => {
    try {
      const prodId = req.params.productId;
      const product = await Product.fetchProduct(prodId)
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    } catch (error) {
      throw new Error('fetching product error')
    }
    
};

exports.getIndex = async (req, res, next) => {
  try {
    const products = await Product.fetchAll()
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/'
    });
  } catch (error) {
    throw new Error('Product fetching Error')
  }
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then((cart) => {
      console.log(cart)
      
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cart
      });
        
    })
    .catch((err) => console.log(err))
  // Cart.getCart(cart => {
  //   Product.fetchAll(products => {
  //     const cartProducts = [];
  //     for (product of products) {
  //       const cartProductData = cart.products.find(
  //         prod => prod.id === product.id
  //       );
  //       if (cartProductData) {
  //         cartProducts.push({ productData: product, qty: cartProductData.qty });
  //       }
  //     }
  //     res.render('shop/cart', {
  //       path: '/cart',
  //       pageTitle: 'Your Cart',
  //       products: cartProducts
  //     });
  //   });
  // });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .addToCart(prodId)
    .then(() => {
      res.redirect('/cart');
    })
    .catch(err => {
      console.log('error', err)
      throw err
    })
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     cart.setProducts({})
  //   })
  //   .catch(err => console.log(err))
  // 
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .deleteCartItem(prodId)
    .then(() => {
      res.redirect('/cart')
    })
    .catch((err) => {
      console.log(err)
    })
};

exports.postOrder =  (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders()
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err))
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };
