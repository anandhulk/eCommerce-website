const mongoose=require('mongoose')

const cartSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'users'
    },
    products: [{
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'products'
        },
        count: {
          type: Number,
          required: true,
          default: 1
        }
      }]
})


module.exports=mongoose.model('carts',cartSchema)