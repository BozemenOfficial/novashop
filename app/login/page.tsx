"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const router=useRouter();

  async function submit(e:React.FormEvent){
    e.preventDefault();
    const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
    const d=await r.json();
    if(!r.ok){setError(d.error||"Error");return}
    router.push("/");
    router.refresh();
  }

  return <main className="container"><form className="card form" onSubmit={submit}>
    <div className="kicker">MEMBER ACCESS</div><h1>Welcome back</h1><p className="muted">Sign in to place orders and view your purchase history.</p>
    <label className="formLabel" htmlFor="email">Email address</label><input id="email" className="input" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
    <label className="formLabel" htmlFor="password">Password</label><input id="password" className="input" type="password" placeholder="Your password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required/>
    <button className="btn">Sign in</button>
    {error&&<p className="error">{error}</p>}
    <p className="muted">No account? <Link className="formLink" href="/register">Create one</Link></p>
  </form></main>
}
