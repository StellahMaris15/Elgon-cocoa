import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, Phone, Globe, Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminCard, AdminHeading, inputCls } from "./ui";

interface InquiryRow {
  id: string;
  name: string;
  company: string | null;
  country: string | null;
  email: string;
  phone: string | null;
  product_slugs: string[];
  volume: string | null;
  message: string | null;
  source: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

const STATUSES = ["new", "in_progress", "quoted", "closed", "spam"];

const AdminInquiries = () => {
  const qc = useQueryClient();

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", "inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as InquiryRow[];
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: Partial<InquiryRow> }) => {
      const { error } = await supabase.from("inquiries").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Inquiry updated");
      qc.invalidateQueries({ queryKey: ["admin", "inquiries"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <>
      <AdminHeading title="Inquiries" subtitle="Buyer requests submitted through the website." />

      {isLoading && <AdminCard><p className="text-muted-foreground text-sm">Loading...</p></AdminCard>}
      {!isLoading && rows.length === 0 && (
        <AdminCard><p className="text-muted-foreground text-sm">No inquiries yet.</p></AdminCard>
      )}

      <div className="space-y-4">
        {rows.map((r) => (
          <AdminCard key={r.id}>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="font-heading font-semibold text-lg text-primary">{r.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleString()} / via {r.source}
                </p>
              </div>
              <select
                className={`${inputCls} w-auto`}
                value={r.status}
                onChange={(e) => update.mutate({ id: r.id, patch: { status: e.target.value } })}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace("_", " ")}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 text-sm text-foreground/85 mb-4">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-accent" /> <a className="hover:text-primary" href={`mailto:${r.email}`}>{r.email}</a></p>
              {r.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-accent" /> {r.phone}</p>}
              {r.company && <p className="flex items-center gap-2"><Building2 className="w-4 h-4 text-accent" /> {r.company}</p>}
              {r.country && <p className="flex items-center gap-2"><Globe className="w-4 h-4 text-accent" /> {r.country}</p>}
            </div>

            {r.product_slugs.length > 0 && (
              <p className="text-sm text-foreground/85 mb-2"><span className="btn-label text-[10px] text-primary mr-2">Products</span>{r.product_slugs.join(", ")}</p>
            )}
            {r.volume && <p className="text-sm text-foreground/85 mb-2"><span className="btn-label text-[10px] text-primary mr-2">Volume</span>{r.volume}</p>}
            {r.message && <p className="text-sm text-foreground/85 whitespace-pre-line border-l-2 border-accent pl-4 my-4">{r.message}</p>}

            <textarea
              rows={2}
              placeholder="Internal notes..."
              defaultValue={r.admin_notes ?? ""}
              onBlur={(e) => {
                if (e.target.value !== (r.admin_notes ?? "")) {
                  update.mutate({ id: r.id, patch: { admin_notes: e.target.value } });
                }
              }}
              className={`${inputCls} h-auto py-3`}
            />
          </AdminCard>
        ))}
      </div>
    </>
  );
};

export default AdminInquiries;
