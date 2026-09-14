grant insert on public.inquiries to anon;

drop policy if exists "public can submit inquiries" on public.inquiries;
create policy "public can submit inquiries"
on public.inquiries
for insert
to anon
with check (
  source in ('inquire', 'contact')
  and status = 'new'
  and admin_notes is null
  and notified = false
);
