import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Save, Trash2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminCard, AdminHeading, Labeled, ghostBtn, inputCls, primaryBtn } from "./ui";

interface ProductRow {
  id: string;
  slug: string;
  category: string;
  name: string;
  tagline: string;
  short_description: string;
  description: string;
  origin: string;
  capacity: string;
  grades: string[];
  images: string[];
  featured: boolean;
  published: boolean;
  sort_order: number;
}

const empty: Omit<ProductRow, "id"> = {
  slug: "",
  category: "vanilla",
  name: "",
  tagline: "",
  short_description: "",
  description: "",
  origin: "",
  capacity: "",
  grades: [],
  images: [],
  featured: false,
  published: true,
  sort_order: 0,
};

const AdminProducts = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<ProductRow> | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", "products"],
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("sort_order");
      if (error) throw error;
      return data as unknown as ProductRow[];
    },
  });

  const save = useMutation({
    mutationFn: async (row: Partial<ProductRow>) => {
      const payload = { ...empty, ...row };
      if (!payload.name.trim() || !payload.slug.trim()) throw new Error("Name and slug are required.");
      const { id, ...values } = payload as ProductRow;
      const { error } = row.id
        ? await supabase.from("products").update(values).eq("id", row.id)
        : await supabase.from("products").insert(values);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product saved");
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["products", "public"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Product deleted");
      qc.invalidateQueries({ queryKey: ["admin", "products"] });
      qc.invalidateQueries({ queryKey: ["products", "public"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const set = (patch: Partial<ProductRow>) => setEditing((p) => ({ ...p, ...patch }));

  return (
    <>
      <AdminHeading
        title="Products"
        subtitle="Catalogue shown on the Products and product detail pages."
        action={
          <button className={primaryBtn} onClick={() => setEditing({ ...empty })}>
            <Plus className="w-4 h-4" /> New product
          </button>
        }
      />

      {editing && (
        <AdminCard className="mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-lg text-primary">
              {editing.id ? "Edit product" : "New product"}
            </h2>
            <button className={ghostBtn} onClick={() => setEditing(null)}><X className="w-3.5 h-3.5" /> Cancel</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Labeled label="Name">
              <input className={inputCls} value={editing.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
            </Labeled>
            <Labeled label="Slug" hint="Used in the page URL, e.g. cured-vanilla-beans">
              <input className={inputCls} value={editing.slug ?? ""} onChange={(e) => set({ slug: e.target.value })} />
            </Labeled>
            <Labeled label="Category">
              <select className={inputCls} value={editing.category ?? "vanilla"} onChange={(e) => set({ category: e.target.value })}>
                <option value="vanilla">Vanilla</option>
                <option value="coffee">Coffee</option>
                <option value="cocoa">Cocoa</option>
              </select>
            </Labeled>
            <Labeled label="Sort order">
              <input type="number" className={inputCls} value={editing.sort_order ?? 0} onChange={(e) => set({ sort_order: Number(e.target.value) })} />
            </Labeled>
            <Labeled label="Tagline">
              <input className={inputCls} value={editing.tagline ?? ""} onChange={(e) => set({ tagline: e.target.value })} />
            </Labeled>
            <Labeled label="Origin">
              <input className={inputCls} value={editing.origin ?? ""} onChange={(e) => set({ origin: e.target.value })} />
            </Labeled>
            <Labeled label="Capacity">
              <input className={inputCls} value={editing.capacity ?? ""} onChange={(e) => set({ capacity: e.target.value })} />
            </Labeled>
            <Labeled label="Grades" hint="Comma separated">
              <input className={inputCls} value={(editing.grades ?? []).join(", ")} onChange={(e) => set({ grades: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} />
            </Labeled>
            <div className="md:col-span-2">
              <Labeled label="Short description">
                <input className={inputCls} value={editing.short_description ?? ""} onChange={(e) => set({ short_description: e.target.value })} />
              </Labeled>
            </div>
            <div className="md:col-span-2">
              <Labeled label="Full description">
                <textarea rows={5} className={`${inputCls} h-auto py-3`} value={editing.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
              </Labeled>
            </div>
            <div className="md:col-span-2">
              <Labeled label="Image URLs" hint="One per line">
                <textarea rows={4} className={`${inputCls} h-auto py-3`} value={(editing.images ?? []).join("\n")} onChange={(e) => set({ images: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
              </Labeled>
            </div>
            <label className="flex items-center gap-3 text-sm text-foreground">
              <input type="checkbox" checked={Boolean(editing.published)} onChange={(e) => set({ published: e.target.checked })} /> Published
            </label>
            <label className="flex items-center gap-3 text-sm text-foreground">
              <input type="checkbox" checked={Boolean(editing.featured)} onChange={(e) => set({ featured: e.target.checked })} /> Featured on home page
            </label>
          </div>
          <button className={`${primaryBtn} mt-6`} disabled={save.isPending} onClick={() => save.mutate(editing)}>
            <Save className="w-4 h-4" /> Save product
          </button>
        </AdminCard>
      )}

      <AdminCard className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left">
            <tr className="btn-label text-[10px] text-primary">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={4} className="px-4 py-6 text-muted-foreground">Loading…</td></tr>}
            {!isLoading && rows.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-muted-foreground">No products yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground font-medium">{r.name}</td>
                <td className="px-4 py-3 text-foreground/70 capitalize">{r.category}</td>
                <td className="px-4 py-3 text-foreground/70">{r.published ? "Published" : "Draft"}{r.featured ? " · Featured" : ""}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button className={ghostBtn} onClick={() => setEditing(r)}>Edit</button>
                    <button
                      className={ghostBtn}
                      onClick={() => { if (confirm(`Delete “${r.name}”?`)) remove.mutate(r.id); }}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminCard>
    </>
  );
};

export default AdminProducts;
