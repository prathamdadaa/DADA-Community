"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CreateContentForm(){
 const [type,setType]=useState<"post"|"reel"|"story">("post"); const [title,setTitle]=useState(""); const [body,setBody]=useState(""); const [error,setError]=useState(""); const [busy,setBusy]=useState(false); const router=useRouter();
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError("");
  const res=await fetch("/api/content",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type,title,body})});
  const data=await res.json(); if(!res.ok){setError(data.error||"Could not publish.");setBusy(false);return} router.push("/community"); router.refresh();
 }
 return <form onSubmit={submit} className="glass rounded-3xl p-7"><h1 className="text-3xl font-black">Share knowledge</h1><p className="mt-2 text-sm text-slate-400">Only educational or informative content is allowed.</p>
 <div className="mt-6 grid grid-cols-3 gap-2">{(["post","reel","story"] as const).map(x=><button type="button" key={x} onClick={()=>setType(x)} className={`btn ${type===x?"btn-primary":"btn-secondary"}`}>{x}</button>)}</div>
 <input className="input mt-5" required maxLength={140} placeholder="Title / topic" value={title} onChange={e=>setTitle(e.target.value)}/>
 <textarea className="input mt-4 min-h-52" required maxLength={10000} placeholder="Explain something useful..." value={body} onChange={e=>setBody(e.target.value)}/>
 {error&&<p className="mt-3 text-sm text-red-300">{error}</p>}<button disabled={busy} className="btn btn-primary mt-5 w-full">{busy?"Submitting…":"Submit for moderation"}</button>
 </form>
}
