import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

export default async function OrdersPage(){
  const session=await getSession();
  if(!session) redirect("/login");
  const orders=await prisma.order.findMany({where:{userId:session.userId},include:{items:{include:{product:true}}},orderBy:{createdAt:"desc"}});
  return <main className="container"><header className="pageIntro"><div className="kicker">ACCOUNT</div><h1>Order history</h1><p className="muted">All purchases linked to {session.email}.</p></header>
    {orders.length===0?<section className="card emptyState"><h2>No orders yet</h2><p>Your completed orders will appear here.</p><Link href="/#catalog" className="btn">Start shopping</Link></section>:<div className="adminGrid" style={{paddingBottom:100}}>
      {orders.map(o=><div className="card adminItem" key={o.id}>
        <div className="row"><div><strong>Order #{o.id}</strong><div className="orderDate">{o.createdAt.toLocaleDateString("en-GB",{day:"2-digit",month:"short",year:"numeric"})}</div></div><span className="badge statusBadge">{o.status}</span></div>
        <ul className="orderItems">{o.items.map(i=><li key={i.id}>{i.product.name} × {i.quantity}</li>)}</ul>
        <strong>Total: {formatPrice(o.total)}</strong>
      </div>)}
    </div>}
  </main>
}
