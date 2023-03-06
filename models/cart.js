const mongoose=require('mongoose')

const cartSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    },
    products:[{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'products'
    }]
})


module.exports=mongoose.model('carts',cartSchema)