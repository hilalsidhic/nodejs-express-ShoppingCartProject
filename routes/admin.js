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
      if (!err) 
        res.redirect('/admin') 
    })
    
  })
  

})

module.exports = router;
