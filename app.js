// app.js
const express = require('express');
const ProductManager = require('./productManager');

const app = express();
const port = 3000;

const productManager = new ProductManager('productos.json');

app.use(express.json());

app.get('/products', async (req, res) => {
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

app.get('/products/:pid', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
