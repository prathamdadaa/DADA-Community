import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { moderationSchema } from "@/lib/security";
import { rateLimit } from "@/lib/rate-limit";

async function moderator(){
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user)return null;
 const {data:p}=await supabase.from("profiles").select("role").eq("id",user.id).single();
 return p && ["moderator","admin"].includes(p.role) ? {supabase,user} : null;
}
export async function GET(){
 const ctx=await moderator(); if(!ctx)return NextResponse.json({error:"Forbidden"},{status:403});
 const {data,error}=await ctx.supabase.from("content").select("id,title,body,type,created_at,profiles(display_name,vi_id)").eq("status","pending").order("created_at",{ascending:true}).limit(100);
 if(error)return NextResponse.json({error:"Could not load queue."},{status:500});
 return NextResponse.json({items:data??[]});
}
export async function PATCH(req:Request){
 const ctx=await moderator(); if(!ctx)return NextResponse.json({error:"Forbidden"},{status:403});
 if(!(await rateLimit(`mod:${ctx.user.id}`,60,60)))return NextResponse.json({error:"Rate limited."},{status:429});
 const parsed=moderationSchema.safeParse(await req.json()); if(!parsed.success)return NextResponse.json({error:"Invalid moderation request."},{status:400});
 const v=parsed.data;
 const {error}=await ctx.supabase.from("content").update({status:v.status,moderated_by:ctx.user.id,moderation_reason:v.reason??null,moderated_at:new Date().toISOString()}).eq("id",v.contentId);
 if(error)return NextResponse.json({error:"Update failed."},{status:400});
 await ctx.supabase.from("moderation_log").insert({content_id:v.contentId,moderator_id:ctx.user.id,action:v.status,reason:v.reason??null});
 return NextResponse.json({ok:true});
}
