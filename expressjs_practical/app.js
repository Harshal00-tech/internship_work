const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
// const expressHBS = require('express-handlebars')
app.use(express.static(path.join(__dirname, 'public')));



const adminRouter = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const showErrorPage = require('./controllers/error.controller')

// app.engine('hbs', expressHBS({layoutDir : 'views/layouts/header.layout.hbs', defaultLayout : 'header.layout.hbs', extname: 'hbs'}))
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: false}));

app.use('/admin', adminRouter);
app.use(shopRoutes);    

app.use(showErrorPage);

app.listen(3000, () => {
    console.log('server is running...')
});
