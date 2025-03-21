// user-service/server.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({
	path: "../.env",
});
const app = express();
app.use(express.json());

app.post("/create-user", async (req, res) => {
	const response = await axios.post(process.env.USER_ENDPOINT, req.body);
	res.status(response.status).send(response.data);
});

app.post("/create-product", async (req, res) => {
	const response = await axios.post(process.env.PRODUCT_ENDPOINT, req.body);
	res.status(response.status).send(response.data);
});

app.post("/create-order", async (req, res) => {
	const response = await axios.post(process.env.ORDER_ENDPOINT, req.body);
	res.status(response.status).send(response.data);
});

const port = 4000;
app.listen(port, () => {
	console.log(`API Gateway running on port ${port}`);
});
