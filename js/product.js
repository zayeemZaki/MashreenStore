const productApp = Vue.createApp({
  data() {
    return {
      product: null,
      selectedVariant: null,
      cart: []
    };
  },
  computed: {
    images() {
      return this.selectedVariant ? this.selectedVariant.images : [];
    },
    cartCount() {
      return this.cart.reduce((sum,i) => sum + i.quantity, 0);
    }

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
      const ex = this.cart.find(i => i.id === this.product.id);
      if (ex) ex.quantity++;
      else this.cart.push({ id: this.product.id, quantity: 1 });
      this.saveCart();
      alert("Added to your bag!");
    },
    selectVariant(v) {
      this.selectedVariant = v;
    },
    fetchProduct() {
      const params = new URLSearchParams(window.location.search);
      const id = Number(params.get("id"));
      fetch("data/products.json")
        .then(r => r.json())
        .then(data => {
          this.product = data.find(p => p.id === id);
          this.selectedVariant = this.product.variants[0];
        });
    }
  },
  mounted() {
    this.loadCart();
    this.fetchProduct();
  }
});

productApp.mount("#app");
