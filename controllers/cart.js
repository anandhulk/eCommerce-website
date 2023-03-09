const carts = require('../models/cart')
const users = require('../models/users')
const products = require('../models/products')
const mongoose = require('mongoose')



const addToCart = async (req, res) => {
    try {
        let proId = req.params.id;
        let user_id = req.session.user._id;
        let cart = await carts.findOne({ userId: user_id })
        if (!cart) {
            cart = new carts({
                userId: user_id,
                products: [{ product: proId, count: 1 }]
            })
        }
        else {
            const existingProduct = cart.products.find(
                (p) => p.product.toString() === proId
            );
            if (existingProduct) {
                await carts.findOneAndUpdate({
                    userId: user_id,
                    "products.product": proId
                },
                { "$inc": { "products.$.count": 1 } });

            } else {
                let pro = { product: proId, count: 1 }
                await cart.products.push(pro)
            }
        }
        await cart.save()
        res.redirect('/cart')
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const getCartProducts = async (req, res) => {
    try {
        let user_id = req.session.user._id;
        let cart = await carts.findOne({ userId: user_id }).populate('products.product').exec()
        cart = cart.toObject()
        let productArray = cart.products
        res.render('user/cart', { products: productArray, user: req.session.user })
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const getCartCount = async (userid) => {
    let count = 0
    let cart = await carts.findOne({ userId: userid })
    if (cart) {
        count = cart.products.length
    }
    return count;
}

const cartChange = async(req,res)=>{
    try {
        let proId = req.query.id;
        let count=req.query.count
        if(count=='inc') {
            console.log("increased")
            count=1;
        }
        else if (count=='dec'){
            count=-1;
            console.log("decreased")
        } 
        let user_id = req.session.user._id;
        let cart=await carts.findOneAndUpdate(
            {
                userId:user_id,
                "products.product":proId
            },
                {"$inc":{"products.$.count":count}},
                {new:true}
        )
        
        const updatedProduct = cart.products.find(
            (p) => p.product.toString() === proId
        );
        res.json({count:updatedProduct.count});
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    addToCart,
    getCartProducts,
    getCartCount,
    cartChange
}