const { getDb } = require('../util/database')
const mongodb = require('mongodb')
const Product = require('./product')


class User {
    constructor(name, email, cart, id) {
        this.name = name
        this.email = email
        this.cart = cart
        this._id = id 
    }
    save() {
        const db = getDb()
        return db.collection('users')
            .insertOne(this)
    }

    addToCart(prodId){
        //check if the prodId is already there 
        const existedProductIndex = this.cart.items.findIndex(cp => {return  cp.productId == prodId})
        let newQtn = 1
        let updatedCartItems = [...this.cart.items]
        if (existedProductIndex >= 0){
            newQtn = this.cart.items[existedProductIndex].quantity + 1
            updatedCartItems[existedProductIndex].quantity = newQtn
        } else {
            updatedCartItems.push({productId : new mongodb.ObjectId(prodId), quantity : newQtn})
        }
        const updatedCart = {
            items : updatedCartItems
        }
   
        const db = getDb()
        return db.collection('users')
            .updateOne({_id : new mongodb.ObjectId(this._id)},{$set : { cart : updatedCart}})
    }

    static findById(userId) {
        const db = getDb()
        return db.collection('users')
            .findOne({ _id: new mongodb.ObjectId(userId) })
            .then(user => {
                return user
            })
            .catch(err => {
                throw err
            })
    }

    getCart(){
        const db = getDb();
        const productIds = this.cart.items.map(i => {
          return i.productId;
        });
        return db
          .collection('products')
          .find({ _id: { $in: productIds } })
          .toArray()
          .then(products => {
            return products.map(p => {
              return {
                ...p,
                quantity: this.cart.items.find(i => {
                  return i.productId.toString() === p._id.toString();
                }).quantity
              };
            });
          });
    }

    addOrder(){
        const db = getDb()
        return this.getCart()
        .then((products) => {
            return db.collection('orders')
            .insertOne({products, userId : this._id}) 
            .then(() => {
                let updatedCart = {items : []}
                this.cart = updatedCart
                return db.collection('users')
                    .updateOne({_id : new mongodb.ObjectId(this._id)},{$set : { cart : updatedCart}})
            })
        })
        .catch(err => {throw err})
    }

    getOrders(){
        const db = getDb()
        return db.collection('orders')
            .find()
            .toArray()
            .then((orders) => {
                return orders
            })
            .catch(err => {throw err })
    }

    deleteCartItem(prodId){
        const updatedCartItems = this.cart.items.filter(item => {return item.productId != prodId})
        const db = getDb()
        
        return db.collection('users')
            .updateOne({_id : new mongodb.ObjectId(this._id)},{$set : { cart : {items: updatedCartItems}}})
    }
}

module.exports = User