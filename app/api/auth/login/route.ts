import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signSession } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email().transform(value => value.toLowerCase()),
  password: z.string().min(1).max(128)
});

export async function POST(req:Request){
  const body = schema.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({error:"Invalid email or password"},{status:400});
  const {email,password}=body.data;
  const user=await prisma.user.findUnique({where:{email}});
  if(!user || !(await bcrypt.compare(password,user.password))) return NextResponse.json({error:"Wrong email or password"},{status:401});

  const token=signSession({userId:user.id,email:user.email,role:user.role});
  const res=NextResponse.json({ok:true});
  res.cookies.set("session",token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:60*60*24*7});
  return res;
}
