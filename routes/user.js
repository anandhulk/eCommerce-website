var express = require('express');
var router = express.Router();
const {allProduct}=require('../controllers/products')

/* GET home page. */
router.get('/', async(req, res, next)=> {
  try {
    let products=await allProduct()
    res.render('user/all-products', { products,admin:false});
  } catch (error) {
    res.send(error);
  }
  
});

module.exports = router;
