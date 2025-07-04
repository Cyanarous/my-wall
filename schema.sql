-- Create the posts table
create table posts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid,
  body text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  image_url text
);

-- Enable realtime for the posts table
alter table posts replica identity full;

-- Enable Row Level Security (RLS)
alter table posts enable row level security;

-- Create a policy that allows all operations
create policy "Allow public access"
  on posts
  for all
  using (true)
  with check (true);

-- Storage policies
-- Allow public access to the storage bucket for uploads
create policy "Allow uploads to wall-images 1x" on storage.objects for insert
  with check (bucket_id = 'wall-images');

-- Allow public access to the storage bucket for viewing
create policy "Allow viewing wall-images 1x" on storage.objects for select
  using (bucket_id = 'wall-images');

-- Allow public updates to the storage bucket
create policy "Allow updates to wall-images 1x" on storage.objects for update
  with check (bucket_id = 'wall-images');

-- Allow public deletes from the storage bucket
create policy "Allow deletes from wall-images 1x" on storage.objects for delete
  using (bucket_id = 'wall-images'); 