// app.js

const express = require('express');
const ProductManager = require('./productManager');
const cartsRouter = require('./routes/carts');

const app = express();
const port = 8080;

const productsFilePath = 'productos.json';

const productManager = new ProductManager(productsFilePath);

app.use(express.json());

app.use('/api/carts', cartsRouter);

app.get('/api/products', async (req, res) => {
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

app.get('/api/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid);
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

app.post('/api/products', async (req, res) => {
  try {
    const product = req.body;
    await productManager.addProduct(product);
    res.status(201).send('Producto agregado correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
