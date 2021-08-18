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
    },
    deleteProduct:(userdata)=>{
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:ObjectId(userdata)}).then((result)=>{
                resolve(result)
            })
        })
    },
    findProduct:(userdata)=>{
        return new Promise((resolve, reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(userdata)}).then((result)=>{
                resolve(result)
                console.log(result)
            })
        })
    },
    editProduct:(userdata,id)=>{
        return new Promise(async(resolve, reject)=>{
            await db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:ObjectId(id)},
            {
              $set: { 'name': userdata.name, 'Price': userdata.Price, 'Category': userdata.Category, 'Description':userdata.Description}
            }
          ).then((result)=>{
              resolve(result)
          })
        })
        
    }
}