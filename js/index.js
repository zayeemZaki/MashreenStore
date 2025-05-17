const app = Vue.createApp({
  data() {
    return {
      products: [],
      categories: [],
      cart: [],
      searchTerm: "",
      selectedCategory: "All",
      trendingMode: false,
      bestSellerMode: false,
      isFilterPage: false,
      showCatMenu: false,
      sortType: null
    };
  },
  computed: {
    filteredProducts() {
      let list = this.products;
      if (this.selectedCategory !== "All") {
        list = list.filter(p => p.category === this.selectedCategory);
      }
      if (this.trendingMode) {
        list = list.filter(p => p.trending);
      }
      if (this.bestSellerMode) {
        list = list.filter(p => p.bestSeller);
      }
      if (this.searchTerm.trim()) {
        const t = this.searchTerm.toLowerCase();
        list = list.filter(p => p.name.toLowerCase().includes(t));
      }
      if (this.sortType === "priceAsc") {
        list = [...list].sort((a, b) => a.price - b.price);
      }
      if (this.sortType === "priceDesc") {
        list = [...list].sort((a, b) => b.price - a.price);
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
    addToCart(p) {
      const ex = this.cart.find(x => x.id === p.id);
      if (ex) ex.quantity++;
      else this.cart.push({ id: p.id, quantity: 1 });
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },
    goToCategoryPage(cat) {
      const params = new URLSearchParams();
      if (cat && cat !== "All") params.set("category", cat);
      window.location.href = `index.html?${params.toString()}`;
    },
    goToTrendingPage() {
      const params = new URLSearchParams();
      if (this.selectedCategory !== "All") params.set("category", this.selectedCategory);
      params.set("trending", "true");
      window.location.href = `index.html?${params.toString()}`;
    },
    goToBestSellerPage() {
      const params = new URLSearchParams();
      if (this.selectedCategory !== "All") params.set("category", this.selectedCategory);
      params.set("filter", "bestSeller");
      window.location.href = `index.html?${params.toString()}`;
    },
    goToProduct(id) {
      window.location.href = `product.html?id=${id}`;
    },
    sortByPriceAsc() {
      this.sortType = "priceAsc";
    },
    sortByPriceDesc() {
      this.sortType = "priceDesc";
    }
  },
  mounted() {
    const c = localStorage.getItem("cart");
    if (c) this.cart = JSON.parse(c);

    fetch("data/products.json")
      .then(r => r.json())
      .then(data => {
        this.products = data;
        this.categories = Array.from(new Set(data.map(p => p.category))).sort();

        const p = new URLSearchParams(location.search);
        const cat = p.get("category");
        const trending = p.get("trending");
        const filter = p.get("filter");

        if (cat) {
          this.selectedCategory = cat;
          this.isFilterPage = true;
        }
        if (trending === "true") {
          this.trendingMode = true;
          this.isFilterPage = true;
        }
        if (filter === "bestSeller") {
          this.bestSellerMode = true;
          this.isFilterPage = true;
        }
      });
  }
});

app.mount("#app");
