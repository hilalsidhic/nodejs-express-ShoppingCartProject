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
      ]).toArray()
      
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
    count=parseInt(details.count);
    quantity=parseInt(details.quantity);
    return new Promise((resolve, reject)=>{

      if(count==-1 && quantity==1){

        db.get().collection(collection.CART_COLLECTION)
        .updateOne({_id:ObjectId(cartId)},{
          $pull:{products:{item:ObjectId(prodId)}}
        }).then((result)=>{resolve({removeProduct:true})})
      }
      else{
        db.get().collection(collection.CART_COLLECTION)
        .updateOne({_id:ObjectId(cartId),'products.item':ObjectId(prodId)},
                {
                  $inc:{'products.$.quantity':count}
                }
              ).then((result)=>{
                resolve(true)
              })
         }
      
    })
  },
  removeProductfromCart:(details)=>{
    cartId=details.cart;
    prodId=details.product;
    return new Promise((resolve, reject)=>{
      db.get().collection(collection.CART_COLLECTION)
      .updateOne({_id:ObjectId(cartId)},{
      $pull:{products:{item:ObjectId(prodId)}}
      }).then((result)=>{
      resolve(true)
    })
    })
    
  },
  getCartTotal:(userId)=>{
    return new Promise(async(resolve,reject)=>{
      let Sumtotal = await db.get().collection(collection.CART_COLLECTION).aggregate([
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
        },
        {
          $group:{
            _id:null,
             totals:{$sum:{$multiply:['$quantity',{$convert:{input:'$product.Price',to:'int'}}]}}
          } 
        }
      ]).toArray()
      resolve(Sumtotal)
    })
  },
  getCartProducts:(userId)=>{
    return new Promise(async (resolve, reject)=>{
      let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
      resolve(cart.products)
    })
  },
  placeOrder:(details,product,total)=>{
    return new Promise((resolve, reject)=>{
      let status= details.paymentMethod ==='COD'?'placed':'pending'
      let orderObj={
        deliveryDetails:{
          Phone:details.Phone,
          Pincode:details.Pincode,
          Address:details.Address
        },
        userId:ObjectId(details.user),
        product:product,
        total:total[0].totals,
        status:status,
        paymentMethod:details.paymentMethod,
        date:new Date()
      }
      db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((result)=>{
        db.get().collection(collection.CART_COLLECTION).deleteOne({user:ObjectId(orderObj.userId)})
        resolve(orderObj.status)
      })
    })
  },
  getOrderDetails:(user)=>{
    return new Promise(async(resolve, reject)=>{
     let OrderDetails=await db.get().collection(collection.ORDER_COLLECTION).find({userId:ObjectId(user)}).toArray();
     resolve(OrderDetails)
    })
  }
}
