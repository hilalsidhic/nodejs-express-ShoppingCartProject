const collection= require('../config/collection')
const db= require('../config/connection')
const bcrypt=require('bcrypt')

module.exports = {
  doSignup: (userdata) => {
    return new Promise(async (resolve, reject) => {
      userdata.password = await bcrypt.hash(userdata.password, 10);
      db.get().collection(collection.USER_COLLECTION).insertOne(userdata).then((data) => {
        console.log(data.insertedId.toString());
        resolve(data.insertedId.toString())
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
}
}