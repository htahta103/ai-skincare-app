-- Create storage bucket for scan images if it doesn't exist
insert into storage.buckets (id, name, public)
values ('scan-images', 'scan-images', true)
on conflict (id) do nothing;

-- Set up RLS policies for scan-images bucket
create policy "Users can upload their own scan images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'scan-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can view their own scan images"
on storage.objects for select
to authenticated
using (
  bucket_id = 'scan-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Public can view scan images"
on storage.objects for select
to public
using (bucket_id = 'scan-images');
