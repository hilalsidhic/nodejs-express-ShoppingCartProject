var express = require('express');
var router = express.Router();
var productHelpers= require('../helpers/product-helpers')
var userHelpers= require('../helpers/user-helpers')
/* GET home page. */
router.get("/", function (req, res, next) {
  productHelpers.showProduct().then((products) => {
    let user=req.session.user;
    res.render("user/viewproducts", { admin: false, products,user});
  });
});

router.get("/login", function (req, res, next) {
  res.render("user/userlogin")
})

router.post("/login", function (req, res, next){
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status){
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect("/")
    }
    else{
      res.redirect('/login')
    }
  })
})

router.get("/signup",(req, res, next)=>{
  res.render("user/usersignup")
})

router.post("/signup",(req, res, next)=>{
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response)
    res.redirect("/login")
  })
})

router.get('/logout',(req, res, next)=>{
  req.session.destroy(()=>{
    res.redirect('/')
  })
})



module.exports = router;
