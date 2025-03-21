const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user')
const path = require('path')
const stripe = require('stripe')('sk_test_51QoJihCvHK4FRZTRsY2xdpUzwPknT4BeZfWNOvrPJsdtcK9NOCg2w7ARK6m0Qc8GQbcxMx5ergHBmSNIODNGUSLB00xEH8Civ4')
const fs = require('fs')
const PDFdocument = require('pdfkit')

exports.getProducts = (req, res, next) => {
  const limit = 1;
  const page = +req.query.page || 1
  let totalItems; 
  Product.find().count()
    .then(numProduct => {
      totalItems = numProduct
      return Product.find()
      .skip((page - 1) * limit)
      .limit(limit)
    })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isLogin : req.session.isLogin,
        totalProduct : totalItems,
        firstPage : 1,
        hasPrevPage : page > 1,
        hasNextPage : page * limit < totalItems, 
        currentPage : page,
        nextPage : page + 1,
        prevPage : page - 1,
        lastPage : Math.floor(totalItems / limit)
      });
    })
    .catch(err => {
      console.log(err);
    });
  
    
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
        isLogin : req.session.isLogin
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  const limit = 1;
  const page = +req.query.page || 1
  let totalItems; 
  Product.find().count()
    .then(numProduct => {
      totalItems = numProduct
      return Product.find()
      .skip((page - 1) * limit)
      .limit(limit)
    })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        isLogin : req.session.isLogin,
        totalProduct : totalItems,
        firstPage : 1,
        hasPrevPage : page > 1,
        hasNextPage : page * limit < totalItems, 
        currentPage : page,
        nextPage : page + 1,
        prevPage : page - 1,
        lastPage : Math.floor(totalItems / limit)
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  User.findById(req.session.user._id)
    .populate('cart.items.productId')
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
        isLogin : req.session.isLogin
      });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      console.log(req.session.user._id)
      return User.findById(req.session.user._id)
        .then(user => {
          console.log(user)
          return user.addToCart(product);
        })
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(err => console.error(err))
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.session.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
  User.findById(req.session.user._id)
    .populate('cart.items.productId')
    .then(async userDoc => {
      const products = userDoc.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      console.log(userDoc)
      const order = new Order({
        user: {
          email: userDoc.email,
          userId: userDoc._id
        },
        products: products
      });
     
      return order.save()
        .then(() => {
          return userDoc.clearCart();
        })
        .catch((err) => {
          throw console.error(err);
          
        })
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log('order posting Error',err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.session.user._id })
  .then((orders) => {
    res.render('shop/orders', {
      path: '/orders',
      pageTitle: 'Your Orders',
      orders: orders,
      isLogin : req.session.isLogin
    });
  })
  .catch(err => console.log(err));
};



exports.getInvoice  = (req, res, next) => {
  const orderId = req.params.orderId;
  console.log(orderId)
  const invoiceName = 'invoices-' + orderId + '.pdf'
  const invoicePath = path.join('public', 'invoices', invoiceName);
  Order.findById(orderId)
    .then((orders) => {
      const pdfkit = new PDFdocument()
      pdfkit.pipe(fs.createWriteStream(invoicePath))
      res.setHeader('Content-Type', 'application/pdf')
      res.setHeader('Content-Disposition', 'inline; filename= "' + invoiceName + '"')
      pdfkit.pipe(res); 
          
    pdfkit.fontSize(16)
    .font('Helvetica-Bold')
    .text('Order Value', {
      align: 'center',
      characterSpacing: 0.1,
      underline: true
    });

    pdfkit.moveDown(1);

    orders.products.forEach((p, index) => {
    pdfkit.fontSize(12)
      .font('Helvetica')
      .text(`${p.product.title} - ${p.product.price} -> Quantity: ${p.quantity}`, {
        width: 300,
        align: 'center',
        characterSpacing: 0.1
      });

    pdfkit.fontSize(10)
      .font('Helvetica-Oblique')
      .text(` ${p.product.description}`, {
        width: 300,
        align: 'center',
        characterSpacing: 0.1
      });

    pdfkit.moveDown(0.5);

    if (index < orders.products.length - 1) {
      pdfkit.moveDown(0.5)
        .strokeColor('gray')
        .lineWidth(0.5)
        .moveTo(50, pdfkit.y)
        .lineTo(550, pdfkit.y)
        .stroke();
      pdfkit.moveDown(1); 
    }
    });

    pdfkit.fontSize(10)
    .font('Helvetica')
    .text('Thank you for your order!', {
      align: 'center',
      characterSpacing: 0.1
    });

    pdfkit.end();
    }).catch(error => {
      const err = new Error(error)
      res.httpStatusCode(500)
      next(err)
    })
  
}


module.exports.checkOut = (req, res, next) => {
  let Products;
  let total = 0;
  User.findById(req.session.user._id)
  .populate('cart.items.productId')
  .then(user => {
    const products = user.cart.items;
    Products = products
    products.forEach(p => {
      total += p.quantity * p.productId.price
    })
    return stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: Products.map(p => {
        console.log(p)
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: p.productId.title,
              description: p.productId.description,
            },
            unit_amount: p.productId.price * 100, 
          },
          quantity: p.quantity,
        };
      }),
      mode: 'payment',
      success_url: 'http://localhost:3000',
      cancel_url: 'http://localhost:3000/orders',
    });
    
  })
  .then((session) => {
    res.render('shop/checkout', {
      path: '/checkout',
      pageTitle: 'Your Cart',
      products: Products,
      isLogin : req.session.isLogin,
      sessionId : session.id
    });
  })
  .catch(err => console.log(err));
}


module.exports.deleteOrder = (req, res, next) => {
  const orderId = req.body.orderId
  Order.findByIdAndDelete(orderId)
    .then(() => {
      res.redirect('/orders')
    })
    .catch(error => {
      const err = new Error(error)
      res.httpStatusCode(500)
      next(err)
    })
}
