var express = require('express');
var router = express.Router();
const {allProduct}=require('../controllers/products')
const {addUser,checkUser}=require('../controllers/user')
const verifyLogin=require('../middleware/login-verify')



router.get('/', async(req, res, next)=> {
  try {
    const user=req.session.user
    console.log(user)
    let products=await allProduct()
    res.render('user/all-products', { products,user});
  } catch (error) {
    res.send(error);
  }
  
});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }
  else{
    res.render('user/login',{"loginerror":req.session.loginerr})
    req.session.loginerr=false
  }
})

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',addUser)

router.post('/login',checkUser)

router.get('/logout',async(req,res)=>{
  await req.session.destroy()
  res.redirect('/')
})

router.get('/cart',verifyLogin,async(req,res)=>{
  res.render('user/cart')
})

module.exports = router;
