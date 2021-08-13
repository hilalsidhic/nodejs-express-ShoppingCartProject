var express = require('express');
var router = express.Router();

/* GET home page. */
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
  res.render('index', {products,admin:false});
});

module.exports = router;
