const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
    this.products = [];
    this.loadProducts();
  }

  loadProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf8');
      this.products = JSON.parse(data);
    } catch (err) {
      console.error("Error al cargar los productos:", err);
    }
  }

  saveProducts() {
    try {
      const data = JSON.stringify(this.products, null, 2);
      fs.writeFileSync(this.path, data);
      console.log("Productos guardados correctamente.");
    } catch (err) {
      console.error("Error al guardar los productos:", err);
    }
  }

  addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    const existingProduct = this.products.find(p => p.code === product.code);
    if (existingProduct) {
      console.error("Ya existe un producto con el mismo código");
      return;
    }

    product.id = this.products.length > 0 ? this.products[this.products.length - 1].id + 1 : 1;
    this.products.push(product);
    console.log("Producto agregado con éxito");
    this.saveProducts();
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);
    if (!product) {
      console.error("Producto no encontrado");
      return "NOT FOUND";
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      console.error("Producto no encontrado");
      return;
    }

    this.products[index] = { ...this.products[index], ...updatedFields };
    console.log("Producto actualizado con éxito");
    this.saveProducts();
  }

  deleteProduct(id) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) {
      console.error("Producto no encontrado");
      return;
    }

    this.products.splice(index, 1);
    console.log("Producto eliminado con éxito");
    this.saveProducts();
  }
}

// Ejemplo de uso
const manager = new ProductManager('productos.json');

manager.addProduct({
  title: "Producto 1",
  description: "Descripción del producto 1",
  price: 10.99,
  thumbnail: "imagen1.jpg",
  code: "P1",
  stock: 100
});

manager.addProduct({
  title: "Producto 2",
  description: "Descripción del producto 2",
  price: 20.99,
  thumbnail: "imagen2.jpg",
  code: "P2",
  stock: 50
});

console.log(manager.getProducts());
manager.updateProduct(1, { price: 15.99 });
manager.deleteProduct(2);
