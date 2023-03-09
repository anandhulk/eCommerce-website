var express = require('express');
var router = express.Router();
const {allProduct}=require('../controllers/products')
const {addUser,checkUser}=require('../controllers/user')
const verifyLogin=require('../middleware/login-verify')
const {addToCart,getCartProducts,getCartCount,cartChange}=require('../controllers/cart')


router.get('/', async(req, res, next)=> {
  try {
    const user=req.session.user
    let cartCount=null
    if(user){
      cartCount= await getCartCount(user._id)
    }
    let products=await allProduct()
    res.render('user/all-products', { products,user,cartCount});
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

router.get('/cart',verifyLogin,getCartProducts);

router.post('/add-to-cart/:id',addToCart);

router.put('/cart',cartChange);

module.exports = router;
