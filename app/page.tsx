import Link from "next/link";
import { BookOpen, ShieldCheck, Sparkles, Users } from "lucide-react";

export default function Landing() {
  return (
    <main className="min-h-screen px-5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-10">
        <nav className="flex items-center justify-between">
          <div className="text-xl font-black tracking-tight">DADA<span className="text-indigo-400">.</span></div>
          <div className="flex gap-2">
            <Link className="btn btn-secondary" href="/login">Login</Link>
            <Link className="btn btn-primary" href="/signup">Join community</Link>
          </div>
        </nav>
        <section className="glass glow rounded-3xl p-8 md:p-16">
          <p className="mb-4 inline-flex rounded-full border border-indigo-400/20 bg-indigo-400/10 px-3 py-1 text-sm text-indigo-200">
            Built for learning, sharing and growing
          </p>
          <h1 className="max-w-4xl text-5xl font-black leading-tight md:text-7xl">
            Knowledge feels better when a community builds it together.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            DADA Community is an educational space for tutorials, study notes, learning reels and short-lived study updates.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn btn-primary" href="/signup">Create your VI ID</Link>
            <Link className="btn btn-secondary" href="/community">Explore community</Link>
          </div>
        </section>
        <section className="grid gap-4 md:grid-cols-4">
          {[
            [BookOpen, "Learning first", "Every submission is intended for informative or educational use."],
            [Users, "Real identities", "Every member receives a unique Virtual ID for attribution."],
            [ShieldCheck, "Moderated", "Community content goes through clear moderation states."],
            [Sparkles, "Human UI", "Dark glass surfaces, restrained motion and purposeful hierarchy."]
          ].map(([Icon, title, text]) => (
            <div className="glass rounded-2xl p-5" key={title as string}>
              <Icon className="mb-4 text-indigo-300" />
              <h2 className="font-bold">{title as string}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">{text as string}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
