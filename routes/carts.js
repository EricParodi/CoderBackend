// carts.js

const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const cartsFilePath = path.join(__dirname, '..', 'carritos.json');

const loadCarts = () => {
  try {
    const data = fs.readFileSync(cartsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('El archivo de carritos no existe. Creando uno nuevo.');
      fs.writeFileSync(cartsFilePath, '[]');
      return [];
    } else {
      console.error('Error al cargar carritos:', error);
      return [];
    }
  }
};

let carts = loadCarts();

router.post('/', (req, res) => {
  const newCart = req.body;
  
  newCart.id = Date.now().toString(); 
  newCart.products = []; 
  
  carts.push(newCart);

  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));

  res.status(201).json(newCart);
});

router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = carts.find(c => c.id === cartId);

  if (!cart) {
    res.status(404).send('Carrito no encontrado');
  } else {
    res.json(cart.products);
  }
});

router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  const cart = carts.find(c => c.id === cartId);

  if (!cart) {
    res.status(404).send('Carrito no encontrado');
    return;
  }

  const existingProduct = cart.products.find(p => p.product === productId);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.products.push({ product: productId, quantity });
  }

  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));

  res.status(201).send('Producto agregado al carrito correctamente');
});

router.delete('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  const cart = carts.find(c => c.id === cartId);

  if (!cart) {
    res.status(404).send('Carrito no encontrado');
    return;
  }

  cart.products = cart.products.filter(p => p.product !== productId);

  fs.writeFileSync(cartsFilePath, JSON.stringify(carts, null, 2));

  res.status(200).send('Producto eliminado del carrito correctamente');
});

module.exports = router;
