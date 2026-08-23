"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const router=useRouter();

  async function submit(e:React.FormEvent){
    e.preventDefault();
    const r=await fetch("/api/auth/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email,password})});
    const d=await r.json();
    if(!r.ok){setError(d.error||"Error");return}
    router.push("/");
    router.refresh();
  }

  return <main className="container"><form className="card form" onSubmit={submit}>
    <div className="kicker">JOIN NOVASHOP</div><h1>Create account</h1><p className="muted">Save your orders and enjoy a faster checkout.</p>
    <label className="formLabel" htmlFor="name">Name</label><input id="name" className="input" placeholder="Your name" autoComplete="name" minLength={2} maxLength={60} value={name} onChange={e=>setName(e.target.value)} required/>
    <label className="formLabel" htmlFor="email">Email address</label><input id="email" className="input" type="email" placeholder="you@example.com" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
    <label className="formLabel" htmlFor="password">Password</label><input id="password" className="input" type="password" placeholder="At least 8 characters" autoComplete="new-password" minLength={8} maxLength={128} value={password} onChange={e=>setPassword(e.target.value)} required/>
    <button className="btn">Create account</button>
    {error&&<p className="error">{error}</p>}
    <p className="muted">Already registered? <Link className="formLink" href="/login">Sign in</Link></p>
  </form></main>
}
