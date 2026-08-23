import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(){
  const session=await getSession();
  if(!session || session.role!=="ADMIN") return NextResponse.json({error:"Forbidden"},{status:403});
  const orders=await prisma.order.findMany({include:{user:true,items:{include:{product:true}}},orderBy:{createdAt:"desc"}});
  return NextResponse.json(orders);
}
