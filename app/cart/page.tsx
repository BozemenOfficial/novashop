"use client";
import { useEffect,useMemo,useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

type Item={id:number;name:string;price:number;quantity:number};

export default function CartPage(){
  const [cart,setCart]=useState<Item[]>([]);
  const [msg,setMsg]=useState("");
  const router=useRouter();
  useEffect(()=>{
    try {
      const parsed=JSON.parse(localStorage.getItem("novashop-cart")??"[]");
      setCart(Array.isArray(parsed)?parsed:[]);
    } catch { setCart([]); }
  },[]);
  const total=useMemo(()=>cart.reduce((s,i)=>s+i.price*i.quantity,0),[cart]);

  function save(next:Item[]){
    setCart(next);
    localStorage.setItem("novashop-cart",JSON.stringify(next));
    window.dispatchEvent(new Event("novashop-cart-updated"));
  }

  function change(id:number,delta:number){
    save(cart.map(i=>i.id===id?{...i,quantity:Math.min(20,Math.max(1,i.quantity+delta))}:i));
  }

  function remove(id:number){ save(cart.filter(i=>i.id!==id)); }

  async function order(){
    const r=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({items:cart.map(i=>({productId:i.id,quantity:i.quantity}))})});
    const d=await r.json();
    if(r.status===401){router.push("/login");return}
    if(!r.ok){setMsg(d.error||"Error");return}
    localStorage.removeItem("novashop-cart"); setCart([]); window.dispatchEvent(new Event("novashop-cart-updated")); setMsg(`Order #${d.orderId} created`);
  }

  return <main className="container">
    <header className="pageIntro"><div className="kicker">YOUR SELECTION</div><h1>Shopping cart</h1><p className="muted">Review quantities before placing your order.</p></header>
    {cart.length===0 ? <section className="card emptyState"><h2>Your cart is empty</h2><p>Browse the collection and add something you like.</p><Link className="btn" href="/#catalog">Explore products</Link>{msg&&<p className="success">{msg}</p>}</section> :
    <section className="cartLayout">
      <div className="card cartList">{cart.map(i=><div className="cartItem" key={i.id}>
        <div className="row"><div><strong>{i.name}</strong><div className="cartItemMeta">{formatPrice(i.price)} each</div></div><strong>{formatPrice(i.price*i.quantity)}</strong></div>
        <div className="row" style={{marginTop:14}}><div className="quantity"><button onClick={()=>change(i.id,-1)} aria-label={`Decrease ${i.name}`}>−</button><span>{i.quantity}</span><button onClick={()=>change(i.id,1)} aria-label={`Increase ${i.name}`}>+</button></div><button className="removeButton" onClick={()=>remove(i.id)}>Remove</button></div>
      </div>)}</div>
      <aside className="card summaryCard"><h2>Summary</h2><div className="summaryRow"><span>Products</span><span>{cart.reduce((sum,item)=>sum+item.quantity,0)}</span></div><div className="summaryRow"><span>Delivery</span><span>Calculated later</span></div><div className="summaryRow summaryTotal"><strong>Total</strong><strong>{formatPrice(total)}</strong></div><button className="btn" onClick={order}>Create order</button>{msg&&<p className="error">{msg}</p>}</aside>
    </section>}
  </main>
}
