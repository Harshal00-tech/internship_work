import express from 'express';
import feedRoutes from './routes/post.routes.js'
import userRoutes from './routes/user.routes.js'
import cors from 'cors'
import path from 'path'
import { storage } from './middleware/upload.js';
import multer from 'multer';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cookieParser())
app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Header', 'Content-Type, Authorization')
  next()
})
app.use(express.json())
app.use(express.static("/Users/differenz124/Documents/ecommerce/rest-api/public"));
app.use(multer({storage: storage}).single('imageUrl'))


app.use('/feed', feedRoutes)
app.use('/user', userRoutes)

export default app