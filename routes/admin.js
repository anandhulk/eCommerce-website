var express = require('express');
const {addProduct,allProduct}=require('../controllers/products')
var router = express.Router();


/* GET users listing. */
router.get('/', async(req,res)=>{
  try {
    let all_products= await allProduct()
    res.render('admin/all-products',{admin:true,all_products})
  } catch (error) {
    res.send(error)
  }
});

router.get('/add-products',(req,res)=>{
  res.render('admin/add-products',{admin:true})
})

router.post('/add-products', addProduct);

module.exports = router;
