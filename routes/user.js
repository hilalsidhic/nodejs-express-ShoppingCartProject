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

router.get('/cart',verifylogin,async(req, res, next)=>{
  let user=req.session.user;
  cartCount=await userHelpers.getCartCount(req.session.user._id) 
  Total=await userHelpers.getCartTotal(req.session.user._id)
  cartTotal=Total[0].totals
  userHelpers.findincart(user._id).then((products)=>{
    res.render('user/usercart',{user,products,cartCount,cartTotal})
  }) 
})

router.post('/changeProductQuantity',(req, res, next)=>{
  details={
    cart:req.body.cart,
    product:req.body.product,
    count:req.body.count,
    quantity:req.body.quantity
  }
   userHelpers.changeQuantity(details).then((result)=>{
     res.json(result)
   })
   
})

router.post('/removeProduct',(req, res, next)=>{
  details={
    cart:req.body.cart,
    product:req.body.product   
  }
  userHelpers.removeProductfromCart(details).then((result)=>{
    res.json(result)
  })
})

router.get('/placeorder',verifylogin,async(req, res, next)=>{
  let total= await userHelpers.getCartTotal(req.session.user._id)
  let user=req.session.user
  let passTotal =total[0].totals
  res.render('user/placeorder',{passTotal,user})
})

router.post('/placeorder',async(req, res, next)=>{
  let total= await userHelpers.getCartTotal(req.body.user)
  let products= await userHelpers.getCartProducts(req.body.user)
  userHelpers.placeOrder(req.body,products,total).then((result)=>{
    console.log(result) 
    if(result.paymentMethod === 'COD'){
      res.json(result.status)
    }else{
      userHelpers.orderPayment(result._id.toString(),total).then((RazorResult)=>{
        res.json(RazorResult)
      })
    } 
  }) 
})

router.get('/cartTotal',async(req, res, next)=>{
  let total= await userHelpers.getCartTotal(req.session.user._id)
  console.log(total[0].totals)
  let passTotal =total[0].totals;
  res.json(passTotal)
})

router.get('/ordercomplete',(req, res, next)=>{
  res.render('user/ordercomplete')
})

router.get('/viewOrders',verifylogin,async(req, res, next)=>{
  let user=req.session.user
   let OrderDetails=await userHelpers.getOrderDetails(req.session.user._id)
   res.render('user/vieworders',{OrderDetails,user}) 
})

router.get('/moreDetails/:id',verifylogin,(req, res, next)=>{
  let user=req.session.user;
  userHelpers.moreDetails(req.params.id).then((product)=>{
    console.log(product)
    res.render('user/moreDetails',{product,user})
  })
})

router.post('/verifyRazorpay',(req, res, next)=>{
  console.log(req.body);
})

module.exports = router;
