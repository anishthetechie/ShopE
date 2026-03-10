import { useState } from "react"

const products = [
{
id:1,
name:"Wireless Headphones",
price:129.99,
image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e"
},
{
id:2,
name:"Smart Watch",
price:89.99,
image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30"
},
{
id:3,
name:"Bluetooth Speaker",
price:49.99,
image:"https://images.unsplash.com/photo-1589003077984-894e133dabab"
}
]

export default function App(){

const [user,setUser]=useState(null)
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [cart,setCart]=useState([])

function login(e){

e.preventDefault()

if(email && password){

setUser(email)

}

}

function addToCart(product){

setCart(prev=>{

const exists=prev.find(p=>p.id===product.id)

if(exists){

return prev.map(p=>p.id===product.id ? {...p,qty:p.qty+1}:p)

}

return [...prev,{...product,qty:1}]

})

}

if(!user){

return(

<div className="login">

<h1>ShopClone Login</h1>

<form onSubmit={login}>

<input
placeholder="email"
value={email}
onChange={e=>setEmail(e.target.value)}
/>

<input
placeholder="password"
type="password"
value={password}
onChange={e=>setPassword(e.target.value)}
/>

<button>Login</button>

</form>

</div>

)

}

return(

<div>

<header>

<h1>ShopClone</h1>

<div>Cart: {cart.reduce((a,b)=>a+b.qty,0)}</div>

</header>

<div className="products">

{products.map(p=>(

<div className="card" key={p.id}>

<img src={p.image}/>

<h3>{p.name}</h3>

<p>${p.price}</p>

<button onClick={()=>addToCart(p)}>Add to Cart</button>

</div>

))}

</div>

</div>

)

}