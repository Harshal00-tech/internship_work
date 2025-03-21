const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();

const User = require('./models/user')
// const Product = require('./models/product')
// const Cart = require('./models/cart')
// const CartItem = require('./models/cart-item')


//settting up template engine as ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// const Order = require('./models/order');
// const OrderItem = require('./models/order-item');
const {mongoConnect} = require('./util/database')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//middleware to set user at req body
app.use(async (req, res, next) => {
  try {
    const user = await User.findById('679889c437b387d986e4f253');  // Use `where` to follow Sequelize syntax
    req.user = new User(user.name, user.email, user.cart, user._id);  // Set user on req object
    next();  // Call next to pass control to the next middleware
  } catch (err) {
    console.log(err);
    throw err  // Ensure you call next with the error to handle it properly
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


mongoConnect(() => {
  app.listen(3000)
})

