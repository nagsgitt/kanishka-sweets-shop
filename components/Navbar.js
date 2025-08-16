export default function Navbar({cartCount}){
  return (
    <nav className="nav">
      <strong>Cart:</strong> {cartCount} items
    </nav>
  )
}
