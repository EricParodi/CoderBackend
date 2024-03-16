// products.js

const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');

const productsFilePath = 'productos.json';
const productManager = new ProductManager(productsFilePath);

router.get('/', async (req, res) => {
  try {
    const { limit } = req.query;
    let products = await productManager.getProducts();

    if (limit) {
      products = products.slice(0, Number(limit));
    }

    res.json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);

    if (product === 'NOT FOUND') {
      res.status(404).send('Producto no encontrado');
    } else {
      res.json(product);
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    
    if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
      res.status(400).send('Todos los campos son obligatorios');
      return;
    }

    await productManager.addProduct(newProduct);
    res.status(201).send('Producto agregado correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

module.exports = router;
