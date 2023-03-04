var express = require('express');
var router = express.Router();
const {allProduct}=require('../controllers/products')
const {addUser,checkUser}=require('../controllers/user')

/* GET home page. */
router.get('/', async(req, res, next)=> {
  try {
    let products=await allProduct()
    res.render('user/all-products', { products,admin:false});
  } catch (error) {
    res.send(error);
  }
  
});

router.get('/login',(req,res)=>{
  res.render('user/login')
})

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',addUser)

router.post('/login',checkUser)

module.exports = router;
