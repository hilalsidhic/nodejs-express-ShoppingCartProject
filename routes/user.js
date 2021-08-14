var express = require('express');
var router = express.Router();
var productHelpers= require('../helpers/product-helpers')
/* GET home page. */
router.get("/", function (req, res, next) {
  productHelpers.showProduct().then((products) => {
    res.render("user/viewproducts", { admin: false, products });
  });
});

module.exports = router;
