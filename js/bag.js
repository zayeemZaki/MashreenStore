const bagApp = Vue.createApp({
  data() {
    return {
      products: [],
      cart: []
    }
  },
  computed: {
    cartItems() {
      return this.cart.map(item => {
        const p = this.products.find(x=>x.id===item.id) || {}
        return { id: item.id, name: p.name, price: p.price, quantity: item.quantity }
      })
    },
    total() {
      return this.cartItems.reduce((sum,i)=>sum + i.price*i.quantity, 0)
    }
  },
  methods: {
    loadCart() {
      this.cart = JSON.parse(localStorage.getItem('cart')||'[]')
    },
    saveCart() {
      localStorage.setItem('cart', JSON.stringify(this.cart))
    },
    increment(id) {
      const it = this.cart.find(i=>i.id===id)
      if(it){ it.quantity++; this.saveCart() }
    },
    decrement(id) {
      const it = this.cart.find(i=>i.id===id)
      if(!it) return
      if(it.quantity>1) it.quantity-- 
      else this.cart = this.cart.filter(i=>i.id!==id)
      this.saveCart()
    },
    remove(id) {
      this.cart = this.cart.filter(i=>i.id!==id)
      this.saveCart()
    },
    goToCheckout() {
      window.location.href = '/checkout.html'
    }
  },
  mounted() {
    fetch('data/products.json')
      .then(r=>r.json())
      .then(data=> this.products = data)
    this.loadCart()
  }
})

bagApp.mount('#app')
