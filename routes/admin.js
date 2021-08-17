var express = require('express');
var router = express.Router();
var productHelpers= require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.showProduct().then((products) => {

    res.render('admin/viewproducts' ,{admin:true,products});
  })
});

router.get('/addProduct',function(req, res, next){
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

router.get('/deleteproduct/:id',(req, res, next)=>{
  productHelpers.deleteProduct(req.params.id).then((result)=>{
    console.log(result);
    res.redirect('/admin')
  })
 
})

router.get('/editProduct/:id',(req, res, next)=>{
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



module.exports = router;
