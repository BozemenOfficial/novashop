import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { Prisma } from "@prisma/client";

const schema=z.object({
  name:z.string().trim().min(2).max(60),
  email:z.string().trim().email().transform(value => value.toLowerCase()),
  password:z.string().min(8).max(128)
});

export async function POST(req:Request){
  const body=schema.safeParse(await req.json().catch(() => null));
  if(!body.success) return NextResponse.json({error:"Invalid data"},{status:400});

  const exists=await prisma.user.findUnique({where:{email:body.data.email}});
  if(exists) return NextResponse.json({error:"Email already registered"},{status:409});

  const password=await bcrypt.hash(body.data.password,10);
  let user;
  try {
    user=await prisma.user.create({data:{...body.data,password}});
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({error:"Email already registered"},{status:409});
    }
    return NextResponse.json({error:"Unable to create account"},{status:500});
  }
  const token=signSession({userId:user.id,email:user.email,role:user.role});

  const res=NextResponse.json({ok:true});
  res.cookies.set("session",token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:60*60*24*7});
  return res;
}
