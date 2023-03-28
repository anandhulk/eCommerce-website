const carts = require('../models/cart')
const users = require('../models/users')
const products = require('../models/products')
const mongoose = require('mongoose')



const addToCart = async (req, res) => {
    try {
        let proId = req.query.id;
        let price = parseInt(req.query.price);
        let user_id = req.user._id;
        let cart = await carts.findOne({ userId: user_id })
        if (!cart) {
            cart = new carts({
                userId: user_id,
                products: [{ product: proId, count: 1 ,price:price}],
                totalPrice:price
            })
        }
        else {
            const existingProductIndex = cart.products.findIndex(
                (p) => p.product.toString() === proId
            );
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].count += 1
                cart.products[existingProductIndex].price += price
            } else {
                let pro = { product: proId, count: 1, price:price }
                await cart.products.push(pro)
            }
            cart.totalPrice += price
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
        let user = req.user.toObject();
        let user_id=user._id;
        let cart = await carts.findOne({ userId: user_id }).populate('products.product').exec()
        cart = cart.toObject()
        let productArray = cart.products
        let totalPrice=cart.totalPrice
        res.render('user/cart', { products: productArray, user: user, totalPrice })
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
        let proId = req.body.id
        let count=req.body.count
        let price=parseInt(req.body.price)
        if(count=='inc') {
            count=1;
        }
        else if (count=='dec'){
            count=-1;
        } 
        let user_id = req.user._id;
        let cart= await carts.findOne({userId:user_id})
        const updatingProductIndex= await cart.products.findIndex(
            (p)=> p.product.toString() === proId
        )

        cart.products[updatingProductIndex].count += count
        cart.products[updatingProductIndex].price += count*price
        cart.totalPrice += count*price

        await cart.save()

        const updatedProduct = cart.products.find(
            (p) => p.product.toString() === proId
        );

        res.json({
            count:updatedProduct.count,
            price:updatedProduct.price,
            totalPrice:cart.totalPrice
        });
    } catch (error) {
        console.log(error)
    }
}

const removeProduct=async(req,res)=>{
    try {
        let proId=req.params.id;
        let userId=req.user._id;
        let cart=await carts.findOneAndUpdate({userId:userId},
            {$pull :{products:{product:proId}}
        })

        let removeProductIndex = await cart.products.findIndex(
            (p) => p.product.toString() === proId
        )
        let price = cart.products[removeProductIndex].price

        await carts.findOneAndUpdate({userId:userId},{"$inc":{totalPrice:-price}})

        res.redirect('/cart')
    } catch (error) {
        console.log(error)
    }
}



module.exports = {
    addToCart,
    getCartProducts,
    getCartCount,
    cartChange,
    removeProduct
}