const fs = require('fs')
const path = require('path')

// const products = []

const p = path.join(__dirname,'..',  'data', 'product.json')

module.exports = class Product{
    constructor(title){
        this.title = title 
    }
    save(){
        // const p = path.join(__dirname,'..',  'data', 'product.json')
        let products = []

        fs.readFile(p, (err, content) => {
            if (!err) {
                products = JSON.parse(content)
            }
        })
        products.push(this)
        fs.writeFile(p, JSON.stringify(products), (err) => {
            console.error(err)
        })
    }
    static fetchAll(cb){
        let products = []
        fs.readFile(p, (err, content) => {
            if (!err) {
                cb(JSON.parse(content))
            }
            cb([])
        })
    }
}