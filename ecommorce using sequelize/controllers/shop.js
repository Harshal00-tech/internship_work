const Product = require('../models/product');

exports.getProducts = async (req, res, next) => {
    const products = await req.user.getProducts()
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'All Products',
      path: '/products'
    });
};

exports.getProduct = async  (req, res, next) => {
    const prodId = req.params.productId;
    const products = await req.user.getProducts({where : {id : prodId }})
    res.render('shop/product-detail', {
      product: products[0],
      pageTitle: products[0].title,
      path: '/products'
    });
};

exports.getIndex = async (req, res, next) => {
  const products = await req.user.getProducts()
  res.render('shop/index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/'
  });
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then((cart) => {
      if(cart){
        cart.getProducts()
        .then(products => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'Your Cart',
            products: products
          });
        })
        .catch((err) => console.error(err))
      }
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
  let fetchedCart
  let newQuantity = 1;
  req.user.getCart()
    .then((cart) => {
      fetchedCart = cart
      return cart.getProducts({where : {id : prodId}})
    })
    .then(products => {
      let product;
      if(products.length > 0 ){
        product = products[0]
      }
      if (product) {
        newQuantity = product.cartItem.quantity + 1
        return product
      }
      return Product.findByPk(prodId)
    })
    .then(product => {
      return fetchedCart.addProduct(product, {through : {quantity : newQuantity}})
    })
    .then(ans => {
      res.redirect('/cart')
    })
    .catch((err) => console.log(err))
  
  // req.user
  //   .getCart()
  //   .then((cart) => {
  //     cart.setProducts({})
  //   })
  //   .catch(err => console.log(err))
  // res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({where : {id : prodId}})
    })
    .then(products => {
      return products[0]
    })
    .then(product => {
      return product.cartItem.destroy()
    })
    .then(ans => {
      res.redirect('/cart')
    })
    .catch((err) => {
      console.log(err)
    })
};

exports.postOrder =  (req, res, next) => {

  let fetchedCart;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart
      return cart.getProducts()
    })
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          order.addProducts(products.map(product => {
            product.orderItem.quantity = product.cartItem.quantity
            return product
          }))
        })
        .catch(err => console.log(err))
    })
    .then(() => {
      return  fetchedCart.destroy() 
    })
    .then(() => {
      res.redirect('/orders')
    })
    .catch(err => {
      console.log(err)
    })
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
    .then((orders) => {
      console.log(orders)
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => console.log(err))
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout'
  });
};
