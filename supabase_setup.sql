-- ═══════════════════════════════════════════════
-- StudyShare: Friends & Direct Messages Tables
-- Run this in your Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- 1. PROFILES table (exposes user metadata publicly)
create table if not exists profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text,
    full_name text,
    avatar_url text,
    updated_at timestamptz default now()
);

-- Auto-create/update profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
    insert into public.profiles (id, username, full_name)
    values (
        new.id,
        new.raw_user_meta_data->>'username',
        new.raw_user_meta_data->>'full_name'
    )
    on conflict (id) do update
        set username  = excluded.username,
            full_name = excluded.full_name;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert or update on auth.users
    for each row execute procedure public.handle_new_user();

-- enable RLS
alter table profiles enable row level security;
create policy "Profiles are public" on profiles for select using (true);
create policy "Users update own profile" on profiles for update using (auth.uid() = id);
create policy "Insert own profile" on profiles for insert with check (auth.uid() = id);

-- 2. FRIENDSHIPS table
-- NOTE: status defaults to 'pending' — receiver must accept
create table if not exists friendships (
    id uuid default gen_random_uuid() primary key,
    requester_id uuid references auth.users(id) on delete cascade not null,
    receiver_id  uuid references auth.users(id) on delete cascade not null,
    status text default 'pending' check (status in ('pending','accepted','rejected')),
    created_at timestamptz default now(),
    unique(requester_id, receiver_id)
);

alter table friendships enable row level security;
create policy "Users see own friendships" on friendships for select
    using (auth.uid() = requester_id or auth.uid() = receiver_id);
create policy "Users create friendships" on friendships for insert
    with check (auth.uid() = requester_id);
create policy "Users update own friendships" on friendships for update
    using (auth.uid() = requester_id or auth.uid() = receiver_id);
create policy "Users delete own friendships" on friendships for delete
    using (auth.uid() = requester_id or auth.uid() = receiver_id);

-- 3. DIRECT_MESSAGES table
create table if not exists direct_messages (
    id uuid default gen_random_uuid() primary key,
    sender_id    uuid references auth.users(id) on delete cascade not null,
    receiver_id  uuid references auth.users(id) on delete cascade not null,
    sender_name  text,
    receiver_name text,
    text         text not null,
    file_url     text,           -- URL of shared file (PDF, image, etc.)
    file_name    text,           -- Original filename for display
    created_at   timestamptz default now()
);

alter table direct_messages enable row level security;
create policy "Users see own DMs" on direct_messages for select
    using (auth.uid() = sender_id or auth.uid() = receiver_id);
create policy "Users send DMs" on direct_messages for insert
    with check (auth.uid() = sender_id);

-- If you already have the direct_messages table, run these ALTER statements instead:
-- alter table direct_messages add column if not exists file_url text;
-- alter table direct_messages add column if not exists file_name text;

-- 4. (Optional) Add uploader_name to materials for social feed display
-- alter table materials add column if not exists uploader_name text;

-- Enable Realtime on these tables in Supabase dashboard:
-- Database > Replication > Enable for: direct_messages, friendships, materials
