// user-service/server.js
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
		console.log("User Service connected to MongoDB");
	})
	.catch((err) => console.error("Error connecting to MongoDB:", err));

app.post("/users", (req, res) => {
	const { username, password } = req.body;
	console.log(username, password);
	res.status(201).send({ message: "User created successfully!" });
});

const port = 5000;
app.listen(port, () => {
	console.log(`User Service running on port ${port}`);
});
