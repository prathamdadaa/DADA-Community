"use client";
import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Signup(){
 const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const router=useRouter();
 async function submit(e:FormEvent){e.preventDefault();setError(""); if(password.length<8){setError("Use at least 8 characters.");return}
  const supabase=createClient(); const {error}=await supabase.auth.signUp({email,password,options:{data:{display_name:name.trim()}}});
  if(error){setError(error.message);return} router.push("/community");
 }
 return <main className="grid min-h-screen place-items-center p-5"><form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-7">
  <h1 className="text-3xl font-black">Join DADA</h1><p className="mt-2 text-slate-400">Your VI ID is created automatically.</p>
  <div className="mt-7 space-y-4"><input className="input" required maxLength={80} placeholder="Display name" value={name} onChange={e=>setName(e.target.value)}/><input className="input" type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/><input className="input" type="password" required minLength={8} placeholder="Password (8+ characters)" value={password} onChange={e=>setPassword(e.target.value)}/></div>
  {error&&<p className="mt-4 text-sm text-red-300">{error}</p>}<button className="btn btn-primary mt-6 w-full">Create account</button>
  <p className="mt-5 text-center text-sm text-slate-400">Already registered? <Link className="text-indigo-300" href="/login">Login</Link></p>
 </form></main>
}
