/* js/product.js */
const productApp = Vue.createApp({
  data() {
    return {
      product: null,
      cart: []
    };
  },
  methods: {
    goBack() {
      history.back();
    },
    loadCart() {
      this.cart = JSON.parse(localStorage.getItem("cart") || "[]");
    },
    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    addToBag() {
      const existing = this.cart.find(i => i.id === this.product.id);
      if (existing) existing.quantity++;
      else this.cart.push({ id: this.product.id, quantity: 1 });
      this.saveCart();
      alert("Added to your bag!");
    },
    fetchProduct() {
      const params = new URLSearchParams(window.location.search);
      const id = parseInt(params.get("id"));
      if (!id) return;
      fetch("data/products.json")
        .then(r => r.json())
        .then(data => {
          this.product = data.find(p => p.id === id) || null;
        })
        .catch(err => console.error("Failed to load product data:", err));
    }
  },
  mounted() {
    this.loadCart();
    this.fetchProduct();
  }
});

productApp.mount("#app");
