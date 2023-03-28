var express = require('express');
var router = express.Router();
const {allProduct}=require('../controllers/products')
const {addUser,checkUser}=require('../controllers/user')
const verifyLogin=require('../middleware/login-verify')
const {addToCart,getCartProducts,getCartCount,cartChange, removeProduct}=require('../controllers/cart')
const passport= require('passport')


router.get('/', async(req, res, next)=> {
  try {
    let user=null
    let cartCount=null
    if(req.isAuthenticated()){
      user=req.user.toObject();
      cartCount= await getCartCount(user._id)
    }
    let products=await allProduct()
    res.render('user/all-products', { products, user, cartCount});
  } catch (error) {
    res.send(error);
  }
  
});

router.get('/login',(req,res)=>{
  if(req.isAuthenticated()){
    res.redirect('/')
  }
  else{
    res.render('user/login')
  }
})

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',addUser)

router.post('/login',passport.authenticate('local',{failureRedirect:'/login',successRedirect:'/'}))

router.get('/logout',(req,res,next)=>{
  req.logout( (err)=> {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

router.get('/cart',verifyLogin,getCartProducts);

router.post('/add-to-cart',addToCart);

router.put('/cart',cartChange);

router.get('/remove-product/:id',removeProduct);

module.exports = router;
