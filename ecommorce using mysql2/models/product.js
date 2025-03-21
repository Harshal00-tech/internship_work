const db = require("../util/database");

module.exports = class Product {
	constructor(title, imageUrl, description, price) {
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	save() {
    return db.execute(`INSERT into products(title, imageUrl, description, price) values (?, ?, ?, ?)`, [this.title, this.imageUrl, this.description, this.price])
  	} 

	editProduct(id) {
		const query = 'UPDATE products SET title = ?, imageUrl = ?, description = ?, price = ? WHERE id = ?'
		return db.execute(query, [this.title, this.imageUrl, this.description, Number(this.price), Number(id)])
	}

	static deleteById(id) {
		db.execute(`DELETE FROM products WHERE id = ${id}`)
	}

	static fetchAll() {
		return db.execute("SELECT * FROM products")
	}

	static findById(id) {
		return db.execute(`SELECT * FROM products WHERE id = ${id}`);
	}
};
