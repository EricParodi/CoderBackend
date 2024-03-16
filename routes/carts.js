// carts.js

const express = require('express');
const router = express.Router();
const Cart = require('../Cart');

let carts = [];

router.post('/', (req, res) => {
  const newCart = new Cart();
  carts.push(newCart);
  res.status(201).json(newCart);
});
router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = carts.find(cart => cart.id === cartId);
  if (!cart) {
    res.status(404).send('Carrito no encontrado');
  } else {
    res.json(cart);
  }
});


router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  const cart = carts.find(cart => cart.id === cartId);
  if (!cart) {
    res.status(404).send('Carrito no encontrado');
    return;
  }

});

router.delete('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  const cart = carts.find(cart => cart.id === cartId);
  if (!cart) {
    res.status(404).send('Carrito no encontrado');
    return;
  }

});

module.exports = router;
