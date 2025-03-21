const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

const app = express();

const User = require('./models/user')
const Product = require('./models/product')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')


//settting up template engine as ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


//middleware to set user at req body
app.use(async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: 1 } });  // Use `where` to follow Sequelize syntax
    req.user = user;  // Set user on req object
    next();  // Call next to pass control to the next middleware
  } catch (err) {
    console.log(err);
    next(err);  // Ensure you call next with the error to handle it properly
  }
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//Association rule(one to many)
Product.belongsTo(User, {onDelete: 'CASCADE'})
User.hasMany(Product)
User.hasOne(Cart, {onDelete: 'CASCADE'})
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through: CartItem})
Product.belongsToMany(Cart, {through: CartItem})
Order.belongsTo(User)
User.hasMany(Order, {onDelete : 'CASCADE'})
Order.belongsToMany(Product, {through : OrderItem})



sequelize
  .sync()
  .then(result => {
    return User.findByPk(1)
  })
  .then((user) => {
    if (!user){
      return User.create({name : 'max', email : 'max123@gmail.com'}) 
    }
    return user
  })
  .then(user => {
    if (user){
      return user.getCart()
      .then(cart => {
        if (!cart) {
          user.createCart()
        }
      })
      .catch((err) => console.log(err))
    }
    throw new Error("can't set default user.")
  })
      
  .then(cart => {
    app.listen(3000)
  }) 
  .catch(err => {
    console.log(err);
  });
