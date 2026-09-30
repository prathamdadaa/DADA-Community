import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
 let response=NextResponse.next({request});
 const supabase=createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,{
  cookies:{getAll(){return request.cookies.getAll()},setAll(cookiesToSet){cookiesToSet.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});cookiesToSet.forEach(({name,value,options})=>response.cookies.set(name,value,options))}}
 });
 const {data:{user}}=await supabase.auth.getUser();
 const path=request.nextUrl.pathname;
 if(path.startsWith("/mod") && !path.startsWith("/mod/login") && !user) return NextResponse.redirect(new URL("/mod/login",request.url));
 if(["/community","/create"].includes(path) && !user) return NextResponse.redirect(new URL("/login",request.url));
 response.headers.set("Cache-Control","private, no-store");
 return response;
}
export const config={matcher:["/community","/create","/mod/:path*","/api/:path*"]};
