import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { rateLimit } from "@/lib/rate-limit";
import { postSchema, sanitizeText } from "@/lib/security";

export async function POST(req: Request) {
 try {
  const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser();
  if(!user) return NextResponse.json({error:"Unauthorized"},{status:401});
  if(!(await rateLimit(`content:${user.id}`,10,60))) return NextResponse.json({error:"Too many submissions. Try again shortly."},{status:429});
  const json=await req.json(); const parsed=postSchema.safeParse(json);
  if(!parsed.success) return NextResponse.json({error:"Invalid submission."},{status:400});
  const values=parsed.data;
  const {data,error}=await supabase.from("content").insert({
    author_id:user.id,type:values.type,title:sanitizeText(values.title),body:sanitizeText(values.body),media_path:values.mediaPath??null,status:"pending"
  }).select("id").single();
  if(error) return NextResponse.json({error:"Could not save content."},{status:400});
  return NextResponse.json({id:data.id},{status:201});
 } catch { return NextResponse.json({error:"Bad request."},{status:400}); }
}
