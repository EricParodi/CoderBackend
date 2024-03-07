// app.js

const express = require('express');
const exphbs = require('express-handlebars');
const http = require('http');
const socketio = require('socket.io');
const ProductManager = require('./productManager');
const cartsRouter = require('./routes/carts');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const port = 8080;

const productsFilePath = 'productos.json';
const productManager = new ProductManager(productsFilePath);

app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(express.static('public'));

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

    io.emit('productAdded', product); 

    res.status(201).send('Producto agregado correctamente');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.emit('products', productManager.getProducts());

  socket.on('createProduct', async (product) => {
    try {
      await productManager.addProduct(product);
      io.emit('productAdded', product); 
    } catch (error) {
      console.error(error);
    }
  });

  socket.on('deleteProduct', async (productId) => {
    try {
      await productManager.deleteProduct(productId);
      io.emit('productDeleted', productId); 
    } catch (error) {
      console.error(error);
    }
  });
});

server.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
