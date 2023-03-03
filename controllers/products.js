const products=require('../models/products')

//function is used to retrieve objects from db as mongoose objects and convert to plain js objects

async function getObjects(query) {
  const docs = await products.find(query).lean();
  const objects = docs.map(doc => ({...doc}));
  return objects;
}

const addProduct=async(req,res)=>{
    const image=req.files.image;
    const newProduct=new products(req.body)
    try {
      const pro= await newProduct.save()
      const id=pro._id.valueOf(); //stripping out the id of newly created producted
      const filename=id+'.jpg';
      const result =await  image.mv('./public/product-images/' + filename)
      res.redirect('/admin')
    } catch (err) {
      console.log(err)
      res.send(err)
    }
  }

  const allProduct=async()=>{
      try {
        let all_products = await getObjects({})
        return all_products;
      } catch (error) {
        console.log(error);
      }
  }

  module.exports={
    addProduct,
    allProduct
  }