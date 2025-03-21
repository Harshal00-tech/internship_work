// product-service/server.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config({
	path: "../.env",
});

const app = express();
app.use(bodyParser.json());

mongoose
	.connect(process.env.MONGO_CONNECTION_URL)
	.then(() => {
		console.log("product Service connected to MongoDB");
	})
	.catch((err) => console.error("Error connecting to MongoDB:", err));

app.post("/products", (req, res) => {
	const { name, price } = req.body;
	console.log(name, price);
	res.status(201).send({ message: "Product added successfully!" });
});

const port = 6000;
app.listen(port, () => {
	console.log(`Product Service running on port ${port}`);
});
