const collection= require('../config/collection')
const db= require('../config/connection')
const bcrypt=require('bcrypt')
const { ObjectId } = require('mongodb')

module.exports = {
  doSignup: (userdata) => {
    return new Promise(async (resolve, reject) => {
      userdata.password = await bcrypt.hash(userdata.password, 10);
      db.get().collection(collection.USER_COLLECTION).insertOne(userdata).then((data) => {
        console.log(userdata);
        resolve(userdata);
      })
    })
  },
  doLogin:  (userdata) => {
    return new Promise(async (resolve, reject) => {
      let loginstatus=false;
      let response={}
      let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userdata.email })
      if(user){
        bcrypt.compare(userdata.password,user.password).then((status)=>{
          if(status){
             console.log("Login Success")
             response.user = user;
             response.status=true
             resolve(response)
            }
          else{
             console.log("Login Failed-Check The Password")
             resolve({status:false})
            }
        })
      }else{
        console.log("Login Failed-Wrong Email")
        resolve({status:false})
      }

  })
  },
  addToCart:(prodId,userId)=>{
    return new Promise(async (resolve,reject)=>{
      let proObj={
        item:ObjectId(prodId),
        quantity:1
      }
        let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
          if(userCart){
            let proExist=userCart.products.findIndex(product=> product.item==prodId)
            if(proExist!=-1){
              db.get().collection(collection.CART_COLLECTION)
              .updateOne({user:objectId(userId),'products.item':ObjectId(prodId)},
                {
                  $inc:{'products.$.quantity':1}
                }
              ).then(()=>{
                resolve()
              })
            }
            else{
              db.get().collection(collection.CART_COLLECTION).updateOne({user:ObjectId(userId)},
              {
                    $push:{products:proObj}
                
              }).then((result)=>{resolve(result)})
            }
            
          }
          else{
            let cartObj={
              user:ObjectId(userId),
              products:[proObj]
            }
           db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((result)=>{
            resolve(result)
        })
      }
    })
    
  },
  findincart:(userId)=>{
    return new Promise(async(resolve,reject)=>{
      let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
        {
          $match:{user:ObjectId(userId)}
        },
        {
          $unwind:'$products'
        },
        {
          $project:{
            item:'$products.item',
            quantity:'$products.quantity'
          }
        },
        {
          $lookup:{
            from:collection.PRODUCT_COLLECTION,
            localField:'item',
            foreignField:'_id',
            as:'product'
          }
        },
        {
          $project:{
            item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
          }
        }
        // {
        //   $lookup:{
        //     from:collection.PRODUCT_COLLECTION,
        //     let:{proList:'$products.item'},
        //     pipeline:[
        //       {
        //          $match:{
        //            $expr:{  
        //              $in:['$_id',"$$proList"]
        //            }
        //          }
        //       }
        //     ],
        //     as:'cartItems'
        //   }
        // }
      ]).toArray()
      console.log(cartItems);
      resolve(cartItems)
    })
  },
  getCartCount:(userId)=>{
    return new Promise(async(resolve, reject)=>{
      let count = 0
       let cart= await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
       if(cart){
         console.log(cart.products.length)
         for(let i=0;i<cart.products.length;i++){
           count = count + cart.products[i].quantity
         }
        
       }
       resolve(count)
    })
  },
  changeQuantity:(details)=>{
    cartId=details.cart;
    prodId=details.product;
    count=parseInt(details.count)
    return new Promise((resolve, reject)=>{
      db.get().collection(collection.CART_COLLECTION)
      .updateOne({_id:ObjectId(cartId),'products.item':ObjectId(prodId)},
                {
                  $inc:{'products.$.quantity':count}
                }
              ).then((result)=>{
                resolve(result)
              })
    })
  }
    
}
