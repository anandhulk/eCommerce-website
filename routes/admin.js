var express = require('express');
const { addProduct, allProduct, deleteProduct, editProductGet, editProductPost } = require('../controllers/products')
var router = express.Router();
const Product=require('../models/products')

router.get('/', async (req, res) => {
  try {
    let all_products = await allProduct()
    res.render('admin/all-products', { admin: true, all_products })
  } catch (error) {
    res.send(error)
  }
});

router.get('/add-products', (req, res) => {
  res.render('admin/add-products', { admin: true })
})

router.post('/add-products', addProduct);

router.get('/delete-product/:id', deleteProduct);

router.get('/edit-product/:id',editProductGet);

router.post('/edit-product/:id',editProductPost);

module.exports = router;
