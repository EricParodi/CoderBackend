// Cart.js

const fs = require('fs');

class Cart {
  constructor(filePath) {
    this.filePath = filePath;
    this.carts = [];
    this.loadCarts();
  }

  loadCarts() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      this.carts = JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('El archivo de carritos no existe, creando uno nuevo.');
        this.saveCarts();
      } else {
        console.error('Error al cargar carritos:', error);
      }
    }
  }

  saveCarts() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2), 'utf8');
  }

  getCarts() {
    return this.carts;
  }

  getCartById(cartId) {
    return this.carts.find(cart => cart.id === cartId) || 'NOT FOUND';
  }

  addCart(cart) {
    this.carts.push(cart);
    this.saveCarts();
  }

  deleteCart(cartId) {
    this.carts = this.carts.filter(cart => cart.id !== cartId);
    this.saveCarts();
  }
}

module.exports = Cart;
