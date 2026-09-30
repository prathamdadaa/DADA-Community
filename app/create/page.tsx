import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import CreateContentForm from "@/components/create-content-form";

export default async function CreatePage(){
 const user=await getCurrentUser(); if(!user) redirect("/login");
 return <main className="min-h-screen p-5 md:p-10"><div className="mx-auto max-w-2xl"><CreateContentForm/></div></main>
}
