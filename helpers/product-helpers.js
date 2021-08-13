const { ObjectId } = require('mongodb');
const db= require('../config/connection')


module.exports = {
    addProduct:(product,callback)=>{
        

        db.get().collection('products').insertOne(product).then((data)=>{
            console.log(data.insertedId.toString());
            callback(data.insertedId.toString());
        })
    }
}