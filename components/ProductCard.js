import { useState } from 'react'

export default function ProductCard({product, onAdd}){
  const [variant, setVariant] = useState(product.variants[0])

  return (
    <div className="card">
      <img src={product.img} alt={product.name} />
      <h3>{product.name}</h3>
      <select className="sel" value={variant.label}
        onChange={e=>{
          const v = product.variants.find(v=>v.label===e.target.value)
          setVariant(v)
        }}>
        {product.variants.map(v=>(
          <option key={v.label} value={v.label}>{v.label} — ₹{v.price}</option>
        ))}
      </select>
      <div className="price">₹{variant.price}</div>
      <button className="btn primary" onClick={()=>onAdd(product, variant)}>Add to cart</button>
    </div>
  )
}
