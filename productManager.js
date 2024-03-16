// productManager.js

const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.filePath = filePath;
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.products = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('El archivo no existe, creando uno nuevo.');
        this.saveProducts();
      } else {
        console.error('Error al cargar productos:', error);
      }
    }
  }

  saveProducts() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2), 'utf8');
  }

  getProducts() {
    return this.products;
  }

  getProductById(productId) {
    return this.products.find(product => product.id === productId) || 'NOT FOUND';
  }

  addProduct(product) {
    this.products.push(product);
    this.saveProducts();
  }

  deleteProduct(productId) {
    this.products = this.products.filter(product => product.id !== productId);
    this.saveProducts();
  }
}

module.exports = ProductManager;
