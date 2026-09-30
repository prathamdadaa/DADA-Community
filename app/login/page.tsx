"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState("");
  const router=useRouter();
  async function submit(e:FormEvent){e.preventDefault();setError("");
    const {error}=await createClient().auth.signInWithPassword({email,password});
    if(error){setError(error.message);return} router.push("/community"); router.refresh();
  }
  return <main className="grid min-h-screen place-items-center p-5"><form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-7">
    <h1 className="text-3xl font-black">Welcome back</h1><p className="mt-2 text-slate-400">Sign in to DADA Community.</p>
    <div className="mt-7 space-y-4"><input className="input" type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><input className="input" type="password" required placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/></div>
    {error&&<p className="mt-4 text-sm text-red-300">{error}</p>}<button className="btn btn-primary mt-6 w-full">Login</button>
    <p className="mt-5 text-center text-sm text-slate-400">New here? <Link className="text-indigo-300" href="/signup">Create account</Link></p>
  </form></main>
}
