// ProductManager.js

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
      console.error('Error al cargar productos:', error);
    }
  }

  saveProducts() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      fs.writeFileSync(this.filePath, data);
    } catch (error) {
      console.error('Error al guarda productos:', error);
    }
  }

  addProduct(newProduct) {
    this.products.push(newProduct);
    this.saveProducts();
  }

}

module.exports = ProductManager;
