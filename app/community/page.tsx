import Link from "next/link";
import { BookOpen, Plus, Shield } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function Community(){
 const supabase=await createClient();
 const {data:{user}}=await supabase.auth.getUser();
 const {data:posts}=await supabase.from("content").select("id,title,body,type,created_at,profiles(display_name,vi_id)").eq("status","approved").order("created_at",{ascending:false}).limit(30);
 return <main className="min-h-screen p-4 md:p-8"><div className="mx-auto max-w-6xl">
  <header className="mb-7 flex flex-wrap items-center justify-between gap-4"><div><Link href="/" className="text-xl font-black">DADA.</Link><h1 className="mt-3 text-4xl font-black">Community</h1></div><div className="flex gap-2">{user?<Link className="btn btn-primary" href="/create"><Plus size={18}/> Share</Link>:<Link className="btn btn-primary" href="/login">Login</Link>}</div></header>
  <div className="glass mb-6 rounded-2xl border-indigo-400/20 p-4"><div className="flex gap-3"><Shield className="shrink-0 text-indigo-300"/><div><b>Learning-only community.</b><p className="text-sm text-slate-400">Uploads must be informative, educational, or study-related. Content may be moderated.</p></div></div></div>
  <div className="mb-5 flex gap-2 rounded-xl bg-white/[.03] p-1"><span className="rounded-lg bg-white/[.08] px-4 py-2 text-sm font-semibold">Posts</span><span className="px-4 py-2 text-sm text-slate-500">Reels</span><span className="px-4 py-2 text-sm text-slate-500">Stories</span></div>
  <section className="grid gap-4 md:grid-cols-2">{(posts??[]).map((p:any)=><article className="glass rounded-2xl p-5" key={p.id}><div className="mb-3 flex items-center justify-between text-xs text-slate-500"><span>{p.type.toUpperCase()}</span><span>{p.profiles?.display_name??"Member"} · {p.profiles?.vi_id}</span></div><h2 className="text-xl font-bold">{p.title}</h2><p className="mt-3 whitespace-pre-wrap leading-7 text-slate-300">{p.body}</p></article>)}</section>
  {!posts?.length&&<div className="glass rounded-2xl p-10 text-center text-slate-400"><BookOpen className="mx-auto mb-3"/><p>No approved learning posts yet.</p></div>}
 </div></main>
}
