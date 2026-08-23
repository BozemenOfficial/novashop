import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/format";

export default async function AdminPage(){
  const session=await getSession();
  if(!session) redirect("/login");
  if(session.role!=="ADMIN") redirect("/");
  const [orders,products,users]=await Promise.all([
    prisma.order.findMany({include:{user:true,items:{include:{product:true}}},orderBy:{createdAt:"desc"}}),
    prisma.product.findMany({orderBy:{createdAt:"desc"}}),
    prisma.user.findMany({orderBy:{createdAt:"desc"}})
  ]);

  return <main className="container">
    <header className="pageIntro"><div className="kicker">ADMIN PANEL</div><h1>Store overview</h1><p className="muted">Live operational data from the NovaShop database.</p></header>
    <div className="grid metricGrid">
      <div className="card metric"><strong>{orders.length}</strong><p className="muted">Total orders</p></div>
      <div className="card metric"><strong>{products.length}</strong><p className="muted">Products</p></div>
      <div className="card metric"><strong>{users.length}</strong><p className="muted">Registered users</p></div>
      <div className="card metric"><strong>{formatPrice(orders.reduce((sum,order)=>sum+order.total,0))}</strong><p className="muted">Gross value</p></div>
    </div>
    <h2>Recent orders</h2>
    {orders.length===0?<div className="card emptyState"><p>No orders have been placed yet.</p></div>:<div className="adminGrid" style={{paddingBottom:100}}>{orders.map(o=><div className="card adminItem" key={o.id}>
      <div className="row"><div><strong>#{o.id} · {o.user.email}</strong><div className="orderDate">{o.createdAt.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</div></div><span className="badge statusBadge">{o.status}</span></div>
      <ul className="orderItems">{o.items.map(i=><li key={i.id}>{i.product.name} × {i.quantity}</li>)}</ul>
      <strong>Total: {formatPrice(o.total)}</strong>
    </div>)}</div>}
  </main>
}
