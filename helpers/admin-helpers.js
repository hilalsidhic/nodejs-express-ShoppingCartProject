const { ObjectId } = require("mongodb");
const db = require("../config/connection");
const collection = require("../config/collection");
const bcrypt=require('bcrypt')

module.exports = {
  doLogin: (admindata) => {
    return new Promise(async (resolve, reject) => {
      let loginstatus = false;
      let response = {};
      let admin = await db
        .get()
        .collection(collection.ADMIN_COLLECTION)
        .findOne({ email: admindata.email });
      if (admin) {
        bcrypt.compare(admindata.password, admin.password).then((status) => {
          if (status) {
            console.log("Login Success");
            response.admin = admin;
            response.status = true;
            resolve(response);
          } else {
            console.log("Login Failed-Check The Password");
            resolve({ status: false });
          }
        });
      } else {
        console.log("Login Failed-Wrong Email");
        resolve({ status: false });
      }
    });
  },
  doSignup: (admindata) => {
    return new Promise(async (resolve, reject) => {
      admindata.password = await bcrypt.hash(admindata.password, 10);
      db.get().collection(collection.ADMIN_COLLECTION).insertOne(admindata).then((data) => {
        console.log(admindata);
        resolve(admindata);
      })
    })
  }
};
