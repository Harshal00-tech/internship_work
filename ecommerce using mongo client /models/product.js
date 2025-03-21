const {getDb} = require('../util/database')

const mongodb = require('mongodb')

class Product {
  constructor(title, imageUrl, description, price, userId){
    this.title = title
    this.imageUrl  = imageUrl  
    this.description = description
    this.price = price
    this.userId = new mongodb.ObjectId(userId)
  }

  save(){
    const db = getDb()
    return  db.collection('products')
      .insertOne(this)
  }

  static fetchAll(){
    const db = getDb()
    return db.collection('products').find().toArray()
  }
  
  static fetchProduct(prodId){
    const db = getDb()
    return db.collection('products')
      .find({_id : new mongodb.ObjectId(prodId)})
      .next()
      .then((product) => {
        return product
      })
      .catch(err => {
        throw err
      })
  }

  static updateProduct(product){
    const title = product.title
    const description = product.description
    const imageUrl = product.imageUrl
    const price = product.price
    const userId = product.userId
    const db = getDb()
    return db.collection('products').updateOne({_id : new mongodb.ObjectId(product._id)}, {$set : {title, description, imageUrl, price, userId}})
  }

  static deleteById(prodId){
    const db = getDb()
    return db.collection('products').deleteOne({_id : new mongodb.ObjectId(prodId)})
  }
}

// const Product = sequelize.define('product', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   title: Sequelize.STRING,
//   price: {
//     type: Sequelize.INTEGER,
//     allowNull: false
//   },
//   imageUrl: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: false
//   }
// });

module.exports = Product;
