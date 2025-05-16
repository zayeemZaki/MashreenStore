const app = Vue.createApp({
  data() {
    return {
      products: [],
      categories: [],
      cart: [],
      searchTerm: "",
      selectedCategory: "All",
      trendingMode: false,
      isFilterPage: false,
      showCatMenu: false
    };
  },
  computed: {
    categoriesToShow() {
      return ["Rings", "Necklaces", "Earrings"];
    },
    filteredProducts() {
      if (this.trendingMode) return this.trendingProducts;
      let list = this.products;
      if (this.selectedCategory.includes("bestSeller")) {
        list = this.bestSellerProducts;
      } else if (this.selectedCategory !== "All") {
        list = list.filter(p => p.category === this.selectedCategory);
      }
      if (this.searchTerm.trim()) {
        const t = this.searchTerm.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(t));
      }
      return list;
    },
    trendingProducts() {
      return this.products.filter(p => p.trending);
    },
    bestSellerProducts() {
      return this.products.filter(p => p.bestSeller);
    },
    cartCount() {
      return this.cart.reduce((sum, i) => sum + i.quantity, 0);
    }
  },
  methods: {
    addToCart(product) {
      const ex = this.cart.find(c => c.id === product.id);
      if (ex) ex.quantity++;
      else this.cart.push({ id: product.id, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    goToCategoryPage(cat) {
      if (cat.includes("bestSeller")) {
        window.location.href = "index.html?filter=bestSeller";
      } else {
        window.location.href = `index.html?category=${encodeURIComponent(cat)}`;
      }
    },
    goToTrendingPage() {
      window.location.href = "index.html?trending=true";
    },
    goToProduct(id) {
      window.location.href = `product.html?id=${encodeURIComponent(id)}`;
    }
  },
  mounted() {
    const stored = localStorage.getItem("cart");
    if (stored) this.cart = JSON.parse(stored);

    fetch("data/products.json")
      .then(r => r.json())
      .then(data => {
        this.products = data;
        this.categories = Array.from(new Set(data.map(p => p.category))).sort();

        const params = new URLSearchParams(window.location.search);
        if (params.get("trending") === "true") {
          this.trendingMode = true;
          this.isFilterPage = true;
        }
        if (params.get("filter") === "bestSeller") {
          this.selectedCategory = "All";
          this.isFilterPage = true;
        }
        const cat = params.get("category");
        if (cat) {
          this.selectedCategory = cat;
          this.isFilterPage = true;
        }
      });
  }
});

app.mount("#app");
