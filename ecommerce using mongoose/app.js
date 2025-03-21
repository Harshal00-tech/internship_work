const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongodbStore = require("connect-mongo");
const errorController = require("./controllers/error");
const User = require("./models/user");
const flash = require("connect-flash");
const multer = require("multer");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		cb(null, +Math.floor(Math.random() * 1000) + "-" + file.originalname);
	},
});

const app = express();
app.set("view engine", "ejs");
app.set("views", "views");

const store = MongodbStore.create({
	mongoUrl:
		"mongodb+srv://harshal:admin004@cluster0.p9va5.mongodb.net/ecommerce?appName=Cluster0",
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(multer({ storage: fileStorage }).single("imageUrl"));
app.use(
	session({
		secret: "we make difference",
		resave: false,
		saveUninitialized: false,
		store: store,
	})
);
app.use(flash());

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(errorController.get404);

// app.use((err, req, res, next) => {
// 	res.render('error', {
// 		path : '/error',
// 		pageTitle : 'Error',
// 		isLogin : req.session.isLogin,
// 	})
// })
mongoose
	.connect(
		"mongodb+srv://harshal:admin004@cluster0.p9va5.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
	)
	.then(() => {
		app.listen(3000);
	})
	.catch((err) => {
		console.log(err);
	});
