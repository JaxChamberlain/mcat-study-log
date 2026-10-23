-- Run once in Supabase: SQL Editor → New query → paste this → Run.
-- One table holds everything the tracker saves. Row-level security means each
-- signed-in person can only ever read or change their own rows.

create table if not exists public.mcat_docs (
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  coll       text not null,            -- "sessions", "exams" or "meta"
  id         text not null,
  data       jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, coll, id)
);

alter table public.mcat_docs enable row level security;

create policy "Read own rows"   on public.mcat_docs for select using (auth.uid() = user_id);
create policy "Insert own rows" on public.mcat_docs for insert with check (auth.uid() = user_id);
create policy "Update own rows" on public.mcat_docs for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Delete own rows" on public.mcat_docs for delete using (auth.uid() = user_id);
