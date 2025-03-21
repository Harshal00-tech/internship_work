const db = require('../util/database')


module.exports = class Cart {
  static addProduct(id) {
    const query = 'INSERT INTO cart(product_id) values (?)'
    return db.execute(query, [id])
  }

  static updateProduct(id, quantity) {
    const query = 'UPDATE cart SET quantity = ? where product_id = ?'
    return db.execute(query, [quantity, id])
  }

  static findById(id){
    const query = 'SELECT * FROM cart WHERE id = ?'
    return db.execute(query, [Number(id)])
  }

  static fetchCartProduct(){
    const query = 'SELECT products.title,products.id,  cart.quantity, products.price from cart INNER JOIN products WHERE cart.product_id = products.id'
    return db.execute(query)
  }

  static deleteProduct(id) {
    console.log(id)
    const query = 'DELETE from cart WHERE id = ?'
    return db.execute(query, [Number(id)])
  }
};


//the structure of the cart is {products : [{id : id, quantity : quantity}, totalPrice : Number]