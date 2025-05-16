const productApp = Vue.createApp({
  data() {
    return {
      product: null,
      selectedVariant: null,
      cart: []
    };
  },
  computed: {
    // For the image gallery (even though we only show the first one here)
    images() {
      return this.selectedVariant ? this.selectedVariant.images : [];
    },
    // Total number of items in the bag (for the badge)
    cartCount() {
      return this.cart.reduce((sum, i) => sum + i.quantity, 0);
    }
  },
  methods: {
    // Goes back in history (if you were using a Back button)
    goBack() {
      history.back();
    },

    // Load the cart array from localStorage
    loadCart() {
      this.cart = JSON.parse(localStorage.getItem("cart") || "[]");
    },

    // Persist the cart array back to localStorage
    saveCart() {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    // Add current product + variant (color) to the bag
    addToBag() {
      // Look for an existing line with same product ID AND color
      const existing = this.cart.find(
        i => i.id === this.product.id && i.color === this.selectedVariant.color
      );

      if (existing) {
        // Simply bump its quantity
        existing.quantity++;
      } else {
        // New line item: include id, chosen color, and start at 1
        this.cart.push({
          id: this.product.id,
          color: this.selectedVariant.color,
          quantity: 1
        });
      }

      // Save and notify
      this.saveCart();
      alert("Added to your bag!");
    },

    // Switch the displayed variant (and thus the image)
    selectVariant(v) {
      this.selectedVariant = v;
    },

    // Fetch the JSON, find the product by ?id=, and set initial variant
    fetchProduct() {
      const params = new URLSearchParams(window.location.search);
      const id = Number(params.get("id"));

      fetch("data/products.json")
        .then(r => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then(data => {
          this.product = data.find(p => p.id === id);
          // default to the first variant
          this.selectedVariant = this.product.variants[0];
        })
        .catch(err => {
          console.error("Could not load product data:", err);
        });
    }
  },
  mounted() {
    // On load, restore the bag and then load the product
    this.loadCart();
    this.fetchProduct();
  }
});

productApp.mount("#app");
