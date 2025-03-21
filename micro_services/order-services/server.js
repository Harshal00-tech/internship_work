// order-service/server.js
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
		console.log("order Service connected to MongoDB");
	})
	.catch((err) => console.error("Error connecting to MongoDB:", err));

app.post("/orders", (req, res) => {
	const { userId, productIds } = req.body;
	console.log(userId, productIds);
	res.status(201).send({ message: "Order created successfully!" });
});

const port = 7000;
app.listen(port, () => {
	console.log(`Order Service running on port ${port}`);
});
