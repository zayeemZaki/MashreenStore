const checkoutApp = Vue.createApp({
    data() {
      return {
        products: [],
        cart: [],
        customer: { name:'', email:'', address:'', phone:'' },
        paymentURL: ''
      }
    },
    computed: {
      total() {
        return this.cart.reduce((sum, item) => {
          const p = this.products.find(x=>x.id===item.id) || {}
          return sum + (p.price||0)*item.quantity
        }, 0)
      }
    },
    methods: {
      loadCart() {
        this.cart = JSON.parse(localStorage.getItem('cart')||'[]')
      },
      generateQRCode() {
        const qr = document.getElementById('qrcode')
        qr.innerHTML = ''
        if(this.total<=0) return
        this.paymentURL = 
          `upi://pay?pa=your-upi-id@bank&pn=MashreensShop&am=${this.total}&cu=INR`
        new QRCode(qr, { text:this.paymentURL, width:200, height:200 })
      },
      submitOrder() {
        alert(`Thanks ${this.customer.name}! You’ll get a confirmation at ${this.customer.email}.`)
        localStorage.removeItem('cart')
        window.location.href = 'index.html'
      }
    },
    mounted() {
      fetch('data/products.json')
        .then(r=>r.json())
        .then(data=>{
          this.products = data
          this.loadCart()
          this.generateQRCode()
        })
    }
  })
  
  checkoutApp.mount('#app')
  