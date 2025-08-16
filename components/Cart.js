export default function Cart({items, onCheckout, onRemove}){
  const total = items.reduce((s,i)=> s + i.variant.price * i.qty, 0)
  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {items.length===0 && <p>No items yet</p>}
      {items.map((it)=> (
        <div key={it.key} className="cart-row">
          <div>
            <div>{it.name} <small>({it.variant.label})</small></div>
            <small>₹{it.variant.price} × {it.qty}</small>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <div>₹{it.variant.price * it.qty}</div>
            <button className="btn" onClick={()=>onRemove(it.key)}>✕</button>
          </div>
        </div>
      ))}
      <div style={{fontWeight:700, marginTop:10}}>Total: ₹{total}</div>
      <button className="btn primary" style={{marginTop:12}} disabled={!items.length} onClick={()=>onCheckout(total)}>
        Checkout
      </button>
    </div>
  )
}
