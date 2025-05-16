const bagApp = Vue.createApp({
  data() {
    return {
      products: [],
      cart: []
    };
  },
  computed: {
    cartItems() {
      return this.cart.map(item => {
        const p = this.products.find(x => x.id === item.id) || {};
        return {
          id:       item.id,
          color:    item.color,
          name:     p.name,
          price:    p.price,
          quantity: item.quantity
        };
      });
    },
    total() {
      return this.cartItems.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0);
    }
  },
  methods: {
    loadCart() {
      this.cart = JSON.parse(localStorage.getItem("cart") || "[]");
    },
    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    increment(id, color) {
      const it = this.cart.find(i => i.id === id && i.color === color);
      if (it) {
        it.quantity++;
        this.saveCart();
      }
    },
    decrement(id, color) {
      const it = this.cart.find(i => i.id === id && i.color === color);
      if (!it) return;
      if (it.quantity > 1) {
        it.quantity--;
      } else {
        this.cart = this.cart.filter(i => !(i.id === id && i.color === color));
      }
      this.saveCart();
    },
    remove(id, color) {
      this.cart = this.cart.filter(i => !(i.id === id && i.color === color));
      this.saveCart();
    },
    goToCheckout() {
      window.location.href = "/checkout.html";
    }
  },
  mounted() {
    // **Fetch from the same `data/products.json` file** so the lookups succeed
    fetch("data/products.json")
      .then(r => r.json())
      .then(data => {
        this.products = data;
      })
      .catch(err => {
        console.error("Failed to load product data in bag.js:", err);
      });

    this.loadCart();
  }
});

bagApp.mount("#app");
