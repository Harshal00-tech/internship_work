import app from './app.js'
import mongoose from 'mongoose'

mongoose.connect('mongodb+srv://harshal:admin004@cluster0.p9va5.mongodb.net/ecommerce1?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => {
    console.log('mongodb connected!')
    app.listen(8080)
  })
  .catch(err => console.log(err))


