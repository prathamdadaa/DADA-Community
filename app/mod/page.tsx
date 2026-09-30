import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import ModerationPanel from "@/components/moderation-panel";

export const dynamic="force-dynamic";
export default async function ModPage(){
 const profile=await getCurrentProfile(); if(!profile || !["moderator","admin"].includes(profile.role)) redirect("/mod/login");
 return <main className="min-h-screen p-5 md:p-8"><div className="mx-auto max-w-6xl"><h1 className="text-4xl font-black">Moderation queue</h1><p className="mt-2 text-slate-400">Review learning content before it appears publicly.</p><ModerationPanel/></div></main>
}
