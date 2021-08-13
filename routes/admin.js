var express = require('express');
var router = express.Router();
var productHelpers= require('../helpers/product-helpers')

/* GET users listing. */
router.get('/', function(req, res, next) {
  let products=[{
    Name:"Iphone 11",
    Category:"Mobile",
    Description:"This is Iphone",                                                                                                 
    image:"https://m.media-amazon.com/images/I/71w3oJ7aWyL._AC_UY218_.jpg"
},{
  Name:"Oneplus Nord 2",
  Category:"Mobile",                                                                  
  Description:"This is Nord",
  image:"https://images-eu.ssl-images-amazon.com/images/I/41bUrjJLJyS.jpg"
},{
Name:"Samsung M21",
Category:"Mobile",
Description:"This is Iphone",
image:"https://images-eu.ssl-images-amazon.com/images/I/41+UAS6TLkL.jpg"
},{
Name:"Redmi note 10",
Category:"Mobile",
Description:"This is Redmi",
image:"https://images-eu.ssl-images-amazon.com/images/I/31kpAzgIFsL.jpg"
}]
  res.render('admin/viewproducts' ,{admin:true,products});
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
        res.send(req.body)       
    })
    
  })
  

})

module.exports = router;
