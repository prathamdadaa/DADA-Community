"use client";
import { useEffect, useState } from "react";

type Item={id:string;title:string;body:string;type:string;created_at:string;profiles?:{display_name:string;vi_id:string}};
export default function ModerationPanel(){
 const [items,setItems]=useState<Item[]>([]); const [error,setError]=useState("");
 async function load(){const r=await fetch("/api/moderation");const d=await r.json();if(!r.ok){setError(d.error);return}setItems(d.items)}
 useEffect(()=>{load()},[]);
 async function act(id:string,status:"approved"|"flagged"|"rejected"){const r=await fetch("/api/moderation",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({contentId:id,status})});if(r.ok)setItems(x=>x.filter(i=>i.id!==id))}
 return <section className="mt-8 space-y-4">{error&&<p className="text-red-300">{error}</p>}{items.map(i=><article className="glass rounded-2xl p-5" key={i.id}><div className="text-xs text-slate-500">{i.type} · {i.profiles?.display_name} · {i.profiles?.vi_id}</div><h2 className="mt-2 text-xl font-bold">{i.title}</h2><p className="mt-2 whitespace-pre-wrap text-slate-300">{i.body}</p><div className="mt-5 flex flex-wrap gap-2"><button onClick={()=>act(i.id,"approved")} className="btn btn-primary">Approve</button><button onClick={()=>act(i.id,"flagged")} className="btn btn-secondary">Flag</button><button onClick={()=>act(i.id,"rejected")} className="btn btn-secondary">Reject</button></div></article>)}{!items.length&&!error&&<div className="glass rounded-2xl p-10 text-center text-slate-400">Queue is clear.</div>}</section>
}
