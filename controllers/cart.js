const carts = require('../models/cart')
const users = require('../models/users')
const products = require('../models/products')
const mongoose=require('mongoose')

const convertDoc=(docs)=>{
    const objects = docs.map(doc => ({ ...doc }));
    return objects;
}


const addToCart = async (req, res) => {
    try {
        let proId =new mongoose.Types.ObjectId(req.params.id);
        let user_id = req.session.user._id;
        let cart = await carts.findOne({userId:user_id})
        if(!cart){
            cart = new carts({
                userId: user_id,
                products: [proId]
            })
        }
        else{
            await cart.products.push(proId)
        }
        await cart.save()
        res.redirect('/cart')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const getCartProducts =  async(req,res) =>{
    try {
        let user_id = req.session.user._id;
        let cart=await carts.findOne({userId:user_id}).populate('products').exec()
        cart=cart.toObject()
        let productArray=cart.products
        console.log(productArray)
        res.render('user/cart',{products:productArray})
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

module.exports={
    addToCart,
    getCartProducts
}