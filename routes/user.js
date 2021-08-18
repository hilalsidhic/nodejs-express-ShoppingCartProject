var express = require('express');
var router = express.Router();
var productHelpers= require('../helpers/product-helpers')
var userHelpers= require('../helpers/user-helpers')
const verifylogin=(req, res, next) => {
  console.log("done");
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect("/login")
  }
}
/* GET home page. */
router.get("/",async function (req, res, next) {
  let cartCount=null;
  if(req.session.loggedIn){
    cartCount=await userHelpers.getCartCount(req.session.user._id) 
  }
  productHelpers.showProduct().then((products) => {
    let user=req.session.user;
    res.render("user/viewproducts", { admin: false, products,user,cartCount});
  });
});

router.get("/login", function (req, res, next) {
  if(req.session.loggedIn) {
    res.redirect('/')
  }else{
  res.render("user/userlogin",{"loginErr":req.session.loginError})
  req.session.loginError=false;
  }
})

router.post("/login", function (req, res, next){
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status){
      req.session.loggedIn = true;
      req.session.user = response.user;
      res.redirect("/")
    }
    else{
      req.session.loginError = true;
      res.redirect('/login')
    }
  })
})

router.get("/signup",(req, res, next)=>{
  res.render("user/usersignup")
})

router.post("/signup",(req, res, next)=>{
  userHelpers.doSignup(req.body).then((response) => {
      req.session.loggedIn = true;
      req.session.user = response;
      res.redirect("/")
  })
})

router.get('/logout',(req, res, next)=>{
  req.session.destroy(()=>{
    res.redirect('/')
  })
})

router.get('/addtocart/:id',verifylogin,(req, res, next)=>{
  console.log("api call");
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    console.log(req.session.user);
    res.json({status:true})
 })
})

router.get('/cart',verifylogin,(req, res, next)=>{
  let user=req.session.user;
  userHelpers.findincart(user._id).then((products)=>{
    console.log(products[0].cartItems);
    product = products[0].cartItems
    res.render('user/usercart',{user,product})
  }) 
})



module.exports = router;
