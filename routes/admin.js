var express = require('express');
var router = express.Router();
var productHelpers= require('../helpers/product-helpers')
var adminHelpers= require('../helpers/admin-helpers')
var verifylogin=(req,res,next)=>{
  if(req.session.adminloggedIn){
    next();
  }
  else{
    res.redirect('/admin/login')
  }
}

/* GET users listing. */
router.get('/',verifylogin, function(req, res, next) {
  productHelpers.showProduct().then((products) => {

    res.render('admin/viewproducts' ,{admin:true,products});
  })
});

router.get('/addProduct',verifylogin,function(req, res, next){
  res.render("admin/addproduct",{admin:true})
})

router.post('/addProduct',function(req, res, next){
  productHelpers.addProduct(req.body,(id)=>{
    console.log(id);
    let image = req.files.Image
    image.mv("./public/Productimages/"+id+".jpg",(err,done)=>{
      if (!err){ 
        res.redirect('/admin')
       }
    })    
  })
})

router.get('/deleteproduct/:id',verifylogin,(req, res, next)=>{
  productHelpers.deleteProduct(req.params.id).then((result)=>{
    console.log(result);
    res.redirect('/admin')
  })
 
})

router.get('/editProduct/:id',verifylogin,(req, res, next)=>{
  productHelpers.findProduct(req.params.id).then((products) => {
    res.render('admin/editproduct',{admin:true,products});
  }) 
})

router.post('/editProduct/:id',(req, res, next)=>{
  console.log(req.body)
  productHelpers.editProduct(req.body,req.params.id).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image = req.files.Image
      image.mv("./public/Productimages/"+req.params.id+".jpg")
    }
   })
 })

 router.get("/login", function (req, res, next) {
  if(req.session.adminloggedIn) {
    res.redirect('/admin')
  }else{
  res.render("admin/adminlogin",{"loginErr":req.session.adminloginError})
  req.session.adminloginError=false;
  }
})

router.post("/login", function (req, res, next){
  adminHelpers.doLogin(req.body).then((response) => {
    if (response.status){    
      req.session.admin = response.admin;
      req.session.adminloggedIn = true;
      res.redirect("/admin")
    }
    else{
      req.session.adminloginError = true;
      res.redirect('/admin/login')
    }
  })
})

router.get("/signup",(req, res, next)=>{
  res.render("admin/adminsignup",{admin:true})
})

router.post("/signup",(req, res, next)=>{
  adminHelpers.doSignup(req.body).then((response) => {     
      req.session.admin = response;
      req.session.adminloggedIn = true;
      res.redirect("/admin")
  })
})

router.get('/logout',(req, res, next)=>{
  req.session.admin=null;
  req.session.adminloggedIn = false;
  res.redirect('/admin')
})


module.exports = router;
