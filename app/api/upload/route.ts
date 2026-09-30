import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX=25*1024*1024;
export async function POST(req:Request){
 const supabase=await createClient(); const {data:{user}}=await supabase.auth.getUser(); if(!user)return NextResponse.json({error:"Unauthorized"},{status:401});
 const form=await req.formData(); const file=form.get("file"); if(!(file instanceof File))return NextResponse.json({error:"Missing file."},{status:400});
 if(file.size>MAX)return NextResponse.json({error:"File too large."},{status:413});
 if(!["image/jpeg","image/png","image/webp","video/mp4","video/webm"].includes(file.type))return NextResponse.json({error:"Unsupported file type."},{status:415});
 const ext=(file.name.split(".").pop()||"bin").replace(/[^a-z0-9]/gi,"").toLowerCase();
 const path=`${user.id}/${crypto.randomUUID()}.${ext}`;
 const admin=createAdminClient(); const {error}=await admin.storage.from("community-media").upload(path,await file.arrayBuffer(),{contentType:file.type,upsert:false});
 if(error)return NextResponse.json({error:"Upload failed."},{status:500});
 return NextResponse.json({path});
}
