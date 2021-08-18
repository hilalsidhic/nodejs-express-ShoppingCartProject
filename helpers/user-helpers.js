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
        let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:ObjectId(userId)})
          if(userCart){
            db.get().collection(collection.CART_COLLECTION).updateOne({user:ObjectId(userId)},
            {
                  $push:{products:ObjectId(prodId)}
              
            }).then((result)=>{resolve(result)})
          }
          else{
            let cartObj={
              user:ObjectId(userId),
              products:[ObjectId(prodId)]
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
          $lookup:{
            from:collection.PRODUCT_COLLECTION,
            let:{proList:'$products'},
            pipeline:[
              {
                 $match:{
                   $expr:{  
                     $in:['$_id',"$$proList"]
                   }
                 }
              }
            ],
            as:'cartItems'
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
         count=cart.products.length
       }
       resolve(count)
    })
  }
    
}
