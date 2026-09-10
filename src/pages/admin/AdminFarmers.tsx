import { SiteImage } from "@/components/SiteImage";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Save, Trash2, X, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminCard, AdminHeading, Labeled, ghostBtn, inputCls, primaryBtn } from "./ui";
import { uploadFarmerMedia, useMediaUrl } from "@/lib/media";
import type { FarmerRow } from "@/hooks/useCatalog";

const CROPS = ["vanilla", "coffee", "cocoa"] as const;

const empty: Omit<FarmerRow, "id"> = {
  slug: "",
  name: "",
  role: "",
  district: "",
  story: "",
  photo_url: "",
  crops: [],
  email: "",
  phone: "",
  whatsapp: "",
  backdrop_vanilla: "",
  backdrop_coffee: "",
  backdrop_cocoa: "",
  published: true,
  sort_order: 0,
};

const slugify = (v: string) =>
  v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Upload + preview control for a single image field. */
const ImageField = ({
  label,
  hint,
  value,
  folder,
  onChange,
}: {
  label: string;
  hint?: string;
  value?: string | null;
  folder: string;
  onChange: (path: string) => void;
}) => {
  const [busy, setBusy] = useState(false);
  const preview = useMediaUrl(value);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file.");
    if (file.size > 8 * 1024 * 1024) return toast.error("Image must be under 8 MB.");
    setBusy(true);
    try {
      const path = await uploadFarmerMedia(file, folder);
      onChange(path);
      toast.success(`${label} uploaded`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-sm border border-border p-4">
      <span className="btn-label text-[11px] text-primary block mb-2">{label}</span>
      <div className="flex gap-4">
        <div className="w-28 h-20 shrink-0 rounded-sm overflow-hidden bg-muted grid place-items-center">
          {preview ? (
            <SiteImage src={preview} alt={`${label} preview`} className="w-full h-full object-cover" />
          ) : (
            <span className="text-[10px] text-muted-foreground">No image</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            className={inputCls}
            placeholder="Image URL or uploaded path"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <label className={`${ghostBtn} cursor-pointer`}>
              {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              {value ? "Replace" : "Upload"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={busy}
                onChange={(e) => handleFile(e.target.files?.[0])}
              />
            </label>
            {value && (
              <button type="button" className={ghostBtn} onClick={() => onChange("")}>
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
      </div>
    </div>
  );
};

const AdminFarmers = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<FarmerRow> | null>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin", "farmers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("farmers").select("*").order("sort_order");
      if (error) throw error;
      return data as unknown as FarmerRow[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "farmers"] });
    qc.invalidateQueries({ queryKey: ["farmers", "public"] });
    qc.invalidateQueries({ queryKey: ["farmer"] });
  };

  const save = useMutation({
    mutationFn: async (row: Partial<FarmerRow>) => {
      const payload = { ...empty, ...row };
      if (!payload.name.trim()) throw new Error("Name is required.");
      const slug = slugify(payload.slug || payload.name) || `farmer-${Date.now()}`;
      const { id, ...values } = { ...payload, slug } as FarmerRow;
      const { error } = row.id
        ? await supabase.from("farmers").update(values).eq("id", row.id)
        : await supabase.from("farmers").insert(values);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Farmer profile saved");
      setEditing(null);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("farmers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Farmer profile deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const togglePublished = useMutation({
    mutationFn: async (row: FarmerRow) => {
      const { error } = await supabase.from("farmers").update({ published: !row.published }).eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: (e: Error) => toast.error(e.message),
  });

  const set = (patch: Partial<FarmerRow>) => setEditing((p) => ({ ...p, ...patch }));

  const toggleCrop = (crop: string) => {
    const current = editing?.crops ?? [];
    set({ crops: current.includes(crop) ? current.filter((c) => c !== crop) : [...current, crop] });
  };

  return (
    <>
      <AdminHeading
        title="Farmers"
        subtitle="Profiles, contact links and 3D crop backdrops shown on the public Farmers pages."
        action={
          <button className={primaryBtn} onClick={() => setEditing({ ...empty })}>
            <Plus className="w-4 h-4" /> New profile
          </button>
        }
      />

      {editing && (
        <AdminCard className="mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading font-semibold text-lg text-primary">
              {editing.id ? "Edit farmer" : "New farmer"}
            </h2>
            <button className={ghostBtn} onClick={() => setEditing(null)}><X className="w-3.5 h-3.5" /> Cancel</button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Labeled label="Name">
              <input className={inputCls} value={editing.name ?? ""} onChange={(e) => set({ name: e.target.value })} />
            </Labeled>
            <Labeled label="Profile link" hint="Auto-generated from the name if left blank">
              <input className={inputCls} value={editing.slug ?? ""} onChange={(e) => set({ slug: e.target.value })} />
            </Labeled>
            <Labeled label="Role">
              <input className={inputCls} value={editing.role ?? ""} onChange={(e) => set({ role: e.target.value })} />
            </Labeled>
            <Labeled label="District">
              <input className={inputCls} value={editing.district ?? ""} onChange={(e) => set({ district: e.target.value })} />
            </Labeled>
            <Labeled label="Email">
              <input className={inputCls} value={editing.email ?? ""} onChange={(e) => set({ email: e.target.value })} />
            </Labeled>
            <Labeled label="Phone">
              <input className={inputCls} value={editing.phone ?? ""} onChange={(e) => set({ phone: e.target.value })} />
            </Labeled>
            <Labeled label="WhatsApp number or link">
              <input className={inputCls} value={editing.whatsapp ?? ""} onChange={(e) => set({ whatsapp: e.target.value })} />
            </Labeled>
            <Labeled label="Sort order">
              <input type="number" className={inputCls} value={editing.sort_order ?? 0} onChange={(e) => set({ sort_order: Number(e.target.value) })} />
            </Labeled>

            <div className="md:col-span-2">
              <span className="btn-label text-[11px] text-primary block mb-2">Crops grown</span>
              <div className="flex flex-wrap gap-2">
                {CROPS.map((c) => {
                  const on = (editing.crops ?? []).includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCrop(c)}
                      className={`btn-label text-[11px] px-4 py-2 rounded-sm border capitalize transition-colors ${
                        on ? "bg-primary text-primary-foreground border-primary" : "border-border text-foreground hover:border-primary"
                      }`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="md:col-span-2">
              <Labeled label="Story">
                <textarea rows={4} className={`${inputCls} h-auto py-3`} value={editing.story ?? ""} onChange={(e) => set({ story: e.target.value })} />
              </Labeled>
            </div>

            <div className="md:col-span-2 grid gap-4">
              <ImageField
                label="Profile photo"
                value={editing.photo_url}
                folder="photos"
                onChange={(v) => set({ photo_url: v })}
              />
              <ImageField
                label="Vanilla 3D backdrop"
                hint="Used behind the vanilla 3D model on this farmer's page"
                value={editing.backdrop_vanilla}
                folder="backdrops"
                onChange={(v) => set({ backdrop_vanilla: v })}
              />
              <ImageField
                label="Coffee 3D backdrop"
                hint="Used behind the coffee 3D model on this farmer's page"
                value={editing.backdrop_coffee}
                folder="backdrops"
                onChange={(v) => set({ backdrop_coffee: v })}
              />
              <ImageField
                label="Cocoa 3D backdrop"
                hint="Used behind the cocoa 3D model on this farmer's page"
                value={editing.backdrop_cocoa}
                folder="backdrops"
                onChange={(v) => set({ backdrop_cocoa: v })}
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-foreground">
              <input type="checkbox" checked={Boolean(editing.published)} onChange={(e) => set({ published: e.target.checked })} /> Published
            </label>
          </div>

          <button className={`${primaryBtn} mt-6`} disabled={save.isPending} onClick={() => save.mutate(editing)}>
            <Save className="w-4 h-4" /> Save profile
          </button>
        </AdminCard>
      )}

      <AdminCard className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left">
            <tr className="btn-label text-[10px] text-primary">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">District</th>
              <th className="px-4 py-3">Crops</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td colSpan={6} className="px-4 py-6 text-muted-foreground">Loading…</td></tr>}
            {!isLoading && rows.length === 0 && <tr><td colSpan={6} className="px-4 py-6 text-muted-foreground">No farmer profiles yet.</td></tr>}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="px-4 py-3 text-foreground font-medium">{r.name}</td>
                <td className="px-4 py-3 text-foreground/70">{r.role}</td>
                <td className="px-4 py-3 text-foreground/70">{r.district}</td>
                <td className="px-4 py-3 text-foreground/70 capitalize">{(r.crops ?? []).join(", ") || "—"}</td>
                <td className="px-4 py-3 text-foreground/70">{r.published ? "Published" : "Draft"}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button className={ghostBtn} onClick={() => togglePublished.mutate(r)}>
                      {r.published ? "Unpublish" : "Publish"}
                    </button>
                    <button className={ghostBtn} onClick={() => setEditing(r)}>Edit</button>
                    <button className={ghostBtn} onClick={() => { if (confirm(`Delete “${r.name}”?`)) remove.mutate(r.id); }}>
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

export default AdminFarmers;
