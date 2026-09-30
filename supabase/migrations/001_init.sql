create extension if not exists pgcrypto;

create type public.user_role as enum ('member','moderator','admin');
create type public.content_type as enum ('post','reel','story');
create type public.content_status as enum ('pending','approved','flagged','rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  vi_id text not null unique,
  role public.user_role not null default 'member',
  created_at timestamptz not null default now()
);

create table public.content (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  type public.content_type not null,
  title text not null check (char_length(title) between 3 and 140),
  body text not null check (char_length(body) between 3 and 10000),
  media_path text,
  status public.content_status not null default 'pending',
  moderated_by uuid references public.profiles(id),
  moderation_reason text,
  moderated_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.moderation_log (
  id bigint generated always as identity primary key,
  content_id uuid not null references public.content(id) on delete cascade,
  moderator_id uuid not null references public.profiles(id),
  action public.content_status not null,
  reason text,
  created_at timestamptz not null default now()
);

create table public.rate_limits (
  key text not null,
  window_start timestamptz not null,
  count integer not null default 0,
  primary key(key, window_start)
);

-- VI-XXXXXX generator with cryptographically strong random bytes.
create or replace function public.generate_vi_id()
returns text language plpgsql volatile as $$
declare candidate text;
begin
  loop
    candidate := 'VI-' || upper(substr(encode(gen_random_bytes(4),'hex'),1,6));
    exit when not exists(select 1 from public.profiles where vi_id=candidate);
  end loop;
  return candidate;
end;
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
begin
  insert into public.profiles(id,display_name,vi_id)
  values(new.id,coalesce(nullif(trim(new.raw_user_meta_data->>'display_name'),''),'DADA Member'),public.generate_vi_id());
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Story expiry is represented by expires_at and filtered by the application.
create or replace function public.set_story_expiry()
returns trigger language plpgsql as $$
begin
  if new.type='story' and new.expires_at is null then
    new.expires_at := now() + interval '24 hours';
  end if;
  return new;
end;
$$;
create trigger content_story_expiry before insert on public.content
for each row execute procedure public.set_story_expiry();

create or replace function public.consume_rate_limit(p_key text,p_window_start timestamptz,p_limit integer)
returns boolean language plpgsql security definer set search_path=public as $$
declare n integer;
begin
  insert into public.rate_limits(key,window_start,count) values(p_key,p_window_start,1)
  on conflict(key,window_start) do update set count=rate_limits.count+1
  returning count into n;
  return n <= p_limit;
end;
$$;

alter table public.profiles enable row level security;
alter table public.content enable row level security;
alter table public.moderation_log enable row level security;
alter table public.rate_limits enable row level security;

create or replace function public.is_mod()
returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from public.profiles where id=auth.uid() and role in ('moderator','admin'));
$$;

create policy "profiles readable" on public.profiles for select to authenticated using (true);
create policy "profiles self update" on public.profiles for update to authenticated using (id=auth.uid()) with check (id=auth.uid());

create policy "approved content readable" on public.content for select to authenticated
using (status='approved' or author_id=auth.uid() or public.is_mod());
create policy "members create content" on public.content for insert to authenticated
with check (author_id=auth.uid());
create policy "authors update own pending content" on public.content for update to authenticated
using (author_id=auth.uid() and status='pending')
with check (author_id=auth.uid() and status='pending');
create policy "moderators manage content" on public.content for update to authenticated
using (public.is_mod()) with check (public.is_mod());

create policy "mods read logs" on public.moderation_log for select to authenticated using (public.is_mod());
create policy "mods create logs" on public.moderation_log for insert to authenticated with check (public.is_mod());

-- Storage: private bucket. API route uploads with the service role after authenticating the caller.
insert into storage.buckets(id,name,public) values('community-media','community-media',false)
on conflict(id) do nothing;

create policy "members read own media" on storage.objects for select to authenticated
using (bucket_id='community-media' and (storage.foldername(name))[1]=auth.uid()::text);
create policy "members delete own media" on storage.objects for delete to authenticated
using (bucket_id='community-media' and (storage.foldername(name))[1]=auth.uid()::text);

-- Prevent arbitrary direct browser uploads; uploads go through /api/upload after auth checks.
revoke insert on storage.objects from authenticated, anon;

-- Basic cleanup helper; schedule with Supabase Cron if desired.
create or replace function public.cleanup_rate_limits()
returns void language sql security definer set search_path=public as $$
  delete from public.rate_limits where window_start < now() - interval '2 hours';
$$;
