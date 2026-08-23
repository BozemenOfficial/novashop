import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.number().int().positive(),
    quantity: z.number().int().min(1).max(20)
  })).min(1).max(50)
});

export async function GET(){
  const session=await getSession();
  if(!session) return NextResponse.json({error:"Unauthorized"},{status:401});
  const orders=await prisma.order.findMany({where:{userId:session.userId},include:{items:true},orderBy:{createdAt:"desc"}});
  return NextResponse.json(orders);
}

export async function POST(req:Request){
  const session=await getSession();
  if(!session) return NextResponse.json({error:"Unauthorized"},{status:401});
  const parsed=orderSchema.safeParse(await req.json().catch(() => null));
  if(!parsed.success) return NextResponse.json({error:"Invalid cart data"},{status:400});

  const merged = new Map<number, number>();
  for (const item of parsed.data.items) {
    merged.set(item.productId, (merged.get(item.productId) ?? 0) + item.quantity);
  }
  const items = [...merged].map(([productId, quantity]) => ({productId, quantity}));
  if (items.some(item => item.quantity > 20)) {
    return NextResponse.json({error:"Maximum quantity is 20 per product"},{status:400});
  }

  const ids=items.map(i=>i.productId);
  const products=await prisma.product.findMany({where:{id:{in:ids}}});
  if(products.length!==ids.length) return NextResponse.json({error:"Product not found"},{status:400});

  const rows=items.map(i=>{
    const p=products.find(x=>x.id===i.productId)!;
    return {productId:p.id,quantity:i.quantity,price:p.price,stock:p.stock,name:p.name};
  });
  const unavailable = rows.find(item => item.quantity > item.stock);
  if (unavailable) return NextResponse.json({error:`Only ${unavailable.stock} × ${unavailable.name} left in stock`},{status:409});

  const total=rows.reduce((sum,item)=>sum+item.price*item.quantity,0);
  try {
    const order=await prisma.$transaction(async tx => {
      for (const row of rows) {
        const updated = await tx.product.updateMany({
          where: { id: row.productId, stock: { gte: row.quantity } },
          data: { stock: { decrement: row.quantity } }
        });
        if (updated.count !== 1) throw new Error("OUT_OF_STOCK");
      }
      return tx.order.create({data:{
        userId:session.userId,total,
        items:{create:rows.map(({productId,quantity,price})=>({productId,quantity,price}))}
      }});
    });

    return NextResponse.json({orderId:order.id,total},{status:201});
  } catch (error) {
    if (error instanceof Error && error.message === "OUT_OF_STOCK") {
      return NextResponse.json({error:"Stock changed. Please review your cart."},{status:409});
    }
    return NextResponse.json({error:"Unable to create order"},{status:500});
  }
}
