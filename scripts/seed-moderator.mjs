/*
  Creates/updates the moderator account using the Supabase Admin API.
  Run:
    MODERATOR_EMAIL=moderator@example.com MODERATOR_PASSWORD='change-me' node scripts/seed-moderator.mjs

  Never commit real credentials. The requested example password "yug999" should
  only be used locally if you explicitly choose it; change it before production.
*/
import { createClient } from "@supabase/supabase-js";

const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const service=process.env.SUPABASE_SERVICE_ROLE_KEY;
const email=process.env.MODERATOR_EMAIL;
const password=process.env.MODERATOR_PASSWORD;
if(!url||!service||!email||!password) throw new Error("Missing moderator seed environment variables.");

const admin=createClient(url,service,{auth:{autoRefreshToken:false,persistSession:false}});
const {data:list,error:listError}=await admin.auth.admin.listUsers({perPage:1000});
if(listError) throw listError;
let user=list.users.find(u=>u.email?.toLowerCase()===email.toLowerCase());
if(!user){
  const r=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{display_name:process.env.MODERATOR_DISPLAY_NAME||"DADA Moderator"}});
  if(r.error) throw r.error; user=r.data.user;
}else{
  const r=await admin.auth.admin.updateUserById(user.id,{password,email_confirm:true});
  if(r.error) throw r.error;
}
const {error}=await admin.from("profiles").update({role:"moderator",display_name:process.env.MODERATOR_DISPLAY_NAME||"DADA Moderator"}).eq("id",user.id);
if(error) throw error;
console.log(`Moderator ready: ${email}`);
