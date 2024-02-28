// products.js

const express = require('express');
const fs = require('fs');
const router = express.Router();

const productsFilePath = 'productos.json';

let products = [];

const saveProducts = () => {
  try {
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2), 'utf8');
    console.log('Productos guardados correctamente en productos.json');
  } catch (error) {
    console.error('Error al guardar productos:', error);
  }
};


const loadProducts = () => {
  try {
    const data = fs.readFileSync(productsFilePath, 'utf8');
    products = JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar productos:', error);
    products = [];
  }
};

loadProducts();

router.get('/', (req, res) => {
  const { limit } = req.query;
  let productsToReturn = products;
  
  if (limit) {
    productsToReturn = products.slice(0, Number(limit));
  }
  
  res.json({ products: productsToReturn });
});

router.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  const product = products.find(p => p.id === productId);

  if (!product) {
    res.status(404).send('Producto no encontrado');
  } else {
    res.json(product);
  }
});

router.post('/', (req, res) => {
  const newProduct = req.body;
  
  if (!newProduct.title || !newProduct.description || !newProduct.code || !newProduct.price || !newProduct.stock || !newProduct.category) {
    res.status(400).send('Todos los campos son obligatorios');
    return;
  }

  newProduct.id = Date.now().toString(); 
  newProduct.status = true; 
  products.push(newProduct);
  saveProducts();

  res.status(201).send('Producto agregado correctamente');
});

module.exports = router;
