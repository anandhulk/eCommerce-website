const products = require('../models/products')
const fs=require('fs')
//function is used to retrieve objects from db as mongoose objects and convert to plain js objects

async function getObjects(query) {
  const docs = await products.find(query).lean();
  const objects = docs.map(doc => ({ ...doc }));
  return objects;
}

const addProduct = async (req, res) => {
  const image = req.files.image;
  const newProduct = new products(req.body)
  try {
    const pro = await newProduct.save()
    const id = pro._id.valueOf(); //stripping out the id of newly created producted
    const filename = id + '.jpg';
    const result = await image.mv('./public/product-images/' + filename)
    res.redirect('/admin')
  } catch (err) {
    console.log(err)
    res.send(err)
  }
}

const allProduct = async () => {
  try {
    let all_products = await getObjects({})
    return all_products;
  } catch (error) {
    console.log(error);
  }
}

const deleteProduct = async (req, res) => {
  try {
    // fs.unlinkSync('C:/Users/user/Desktop/E-Commerce/myapp/public/product-images/'+req.params.id+'.jpg')
    await products.findByIdAndDelete(req.params.id)
    res.redirect('/admin')
  } catch (error) {
    res.send(error)
  }
}

const editProductGet=async(req,res)=>{
  try {
    let pro=await getObjects({_id:req.params.id})
    res.render('admin/edit-product',{admin:true,pro})
  } catch (error) {
    res.send(error)
  }
}

const editProductPost=async(req,res)=>{
  try {
    console.log(req.body)
    await products.findByIdAndUpdate(req.params.id,req.body)
    if(req.files){
      let image=req.files.image;
      await image.mv('./public/product-images/' + req.params.id+'.jpg')
    }
    res.redirect('/admin')
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}


module.exports = {
  addProduct,
  allProduct,
  deleteProduct,
  editProductGet,
  editProductPost
}