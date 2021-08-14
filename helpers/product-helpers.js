const { ObjectId } = require('mongodb');
const db= require('../config/connection')
const collection = require('../config/collection')

module.exports = {
    addProduct:(product,callback)=>{
        

        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data)=>{
            console.log(data.insertedId.toString());
            callback(data.insertedId.toString());
        })
    },
    showProduct:()=>{

       return new Promise(async(resolve, reject)=>{
           var products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
           resolve(products)
       })
    }
}