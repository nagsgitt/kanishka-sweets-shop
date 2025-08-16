import {useEffect, useState} from 'react'
import axios from 'axios'
import productsData from '../data/products.json'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import Cart from '../components/Cart'

export default function Home(){
  const [items, setItems] = useState([])

  function addToCart(product, variant){
    setItems(prev => {
      const key = product.id + '|' + variant.label
      const found = prev.find(i => i.key === key)
      if(found){
        return prev.map(i => i.key===key ? {...i, qty: i.qty+1} : i)
      }
      return [...prev, {key, id:product.id, name:product.name, variant, qty:1}]
    })
  }
  function removeFromCart(key){
    setItems(prev => prev.filter(i => i.key !== key))
  }

  async function handleCheckout(total){
    const amount = total * 100 // paise
    try{
      const res = await axios.post('/api/create-order', { amount })
      const order = res.data
      if(order?.id){
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || '',
          amount,
          currency: 'INR',
          name: 'Kanishka - The Pure Ghee',
          description: 'Order payment',
          order_id: order.id,
          handler: function (response) {
            alert('Payment successful! ID: ' + response.razorpay_payment_id)
          },
          theme: { color: '#b71c1c' }
        }
        const rzp = new window.Razorpay(options)
        rzp.open()
      } else {
        alert('Order creation failed')
      }
    }catch(e){
      console.error(e)
      alert('Checkout failed')
    }
  }

  return (
    <div className="container">
      <header>
        <div className="brand">
          <h1>Kanishka</h1>
          <div className="tag">The Pure Ghee & Cold Press Savory — Hyderabad</div>
        </div>
        <Navbar cartCount={items.reduce((s,i)=>s+i.qty,0)} />
      </header>

      <div className="grid">
        <main>
          <section className="products">
            {productsData.map(p => (
              <ProductCard key={p.id} product={p} onAdd={addToCart} />
            ))}
          </section>
        </main>
        <aside>
          <Cart items={items} onCheckout={handleCheckout} onRemove={removeFromCart} />
        </aside>
      </div>

      <Footer />
      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </div>
  )
}
