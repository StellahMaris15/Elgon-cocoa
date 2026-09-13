import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, Save, Trash2, Upload, X } from "lucide-react";
import { SiteImage } from "@/components/SiteImage";
import { hasSupabaseConfig, supabase } from "@/integrations/supabase/client";
import { uploadFarmerMedia, useMediaUrl } from "@/lib/media";
import { AdminCard, Labeled, ghostBtn, inputCls, primaryBtn } from "./ui";
import type { LeadershipMemberRow, LeadershipSettingsRow, PartnerLogoRow, PartnerSettingsRow } from "@/hooks/useCatalog";

type SettingsSection = "inquiries" | "partners" | "leadership";

interface InquirySettings {
  notification_emails: string[];
  auto_reply_enabled: boolean;
  auto_reply_subject: string;
  auto_reply_body: string;
}

const defaultInquirySettings: InquirySettings = {
  notification_emails: [],
  auto_reply_enabled: true,
  auto_reply_subject: "We received your inquiry",
  auto_reply_body:
    "Thank you for contacting Elgon Vanilla, Coffee & Cocoa Growers' Cooperative Society. Our export team will respond within two business days.",
};

const defaultLeadershipSettings: LeadershipSettingsRow = {
  eyebrow: "Leadership",
  headline: "Guided by experience.",
  structure_label: "Leadership structure",
  structure_body:
    "Reviewed by the cooperative's Board of Members, with executive oversight across strategy, finance, and operations.",
  primary_phone: "+256 782 528 476",
  secondary_phone: "+256 706 613 980",
};

const defaultPartnerSettings: PartnerSettingsRow = {
  eyebrow: "Partners",
  headline: "Working with trusted partners.",
  body: "",
};

const emptyLeader: Omit<LeadershipMemberRow, "id"> = {
  name: "",
  title: "",
  quote: "",
  initials: "",
  image_url: "",
  whatsapp_number: "",
  profile_url: "",
  published: true,
  sort_order: 0,
};

const emptyPartnerLogo: Omit<PartnerLogoRow, "id"> = {
  name: "",
  logo_url: "",
  website_url: "",
  published: true,
  sort_order: 0,
};

const cleanText = (value?: string | null) => {
  const trimmed = value?.trim() ?? "";
  return trimmed || null;
};

const initialsFor = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const normalizeLeaderPayload = (row: Partial<LeadershipMemberRow>) => {
  const payload = { ...emptyLeader, ...row };
  const name = payload.name?.trim() ?? "";
  if (!name) throw new Error("Leader name is required.");

  return {
    name,
    title: payload.title?.trim() ?? "",
    quote: payload.quote?.trim() ?? "",
    initials: (payload.initials?.trim() || initialsFor(name)).slice(0, 4),
    image_url: cleanText(payload.image_url),
    whatsapp_number: cleanText(payload.whatsapp_number),
    profile_url: cleanText(payload.profile_url),
    published: Boolean(payload.published),
    sort_order: Number.isFinite(Number(payload.sort_order)) ? Number(payload.sort_order) : 0,
  };
};

const normalizePartnerPayload = (row: Partial<PartnerLogoRow>) => {
  const payload = { ...emptyPartnerLogo, ...row };
  const name = payload.name?.trim() ?? "";
  if (!name) throw new Error("Partner name is required.");

  return {
    name,
    logo_url: cleanText(payload.logo_url),
    website_url: cleanText(payload.website_url),
    published: Boolean(payload.published),
    sort_order: Number.isFinite(Number(payload.sort_order)) ? Number(payload.sort_order) : 0,
  };
};

const ImageField = ({
  value,
  onChange,
  label,
  folder = "leadership",
}: {
  value?: string | null;
  onChange: (path: string) => void;
  label: string;
  folder?: string;
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
    <div className="rounded-sm border border-border p-4 md:col-span-2">
      <span className="btn-label mb-2 block text-[11px] text-primary">{label}</span>
      <div className="flex gap-4">
        <div className="grid h-24 w-32 shrink-0 place-items-center overflow-hidden rounded-sm bg-muted">
          {preview ? (
            <SiteImage src={preview} alt="Leader preview" className="h-full w-full object-cover" />
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
          <div className="flex flex-wrap items-center gap-2">
            <label className={`${ghostBtn} cursor-pointer`}>
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
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
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PartnerLogoPreview = ({ logo }: { logo: PartnerLogoRow }) => {
  const preview = useMediaUrl(logo.logo_url);

  return (
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-20 shrink-0 place-items-center overflow-hidden rounded-sm bg-muted">
        {preview ? (
          <SiteImage src={preview} alt={`${logo.name} logo`} className="max-h-10 w-full object-contain" />
        ) : (
          <span className="text-[10px] text-muted-foreground">No logo</span>
        )}
      </div>
      <div>
        <div className="font-medium text-foreground">{logo.name}</div>
        <div className="text-xs text-muted-foreground">{logo.website_url || "No website"}</div>
      </div>
    </div>
  );
};

const FormPanel = ({
  title,
  eyebrow,
  children,
  action,
  onClose,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
  action: React.ReactNode;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-3 backdrop-blur-sm md:p-6">
    <button className="absolute inset-0 cursor-default" aria-label="Close form" onClick={onClose} />
    <section className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-primary/10 bg-[#f8faf6] shadow-[0_28px_80px_hsl(var(--clay-shadow-outer)/0.28)]">
      <div className="flex items-center justify-between gap-4 border-b border-primary/10 bg-white/90 px-5 py-4 md:px-7">
        <div>
          <p className="eyebrow mb-1">{eyebrow}</p>
          <h2 className="font-heading text-2xl font-bold leading-tight text-primary">{title}</h2>
        </div>
        <button className={ghostBtn} onClick={onClose}>
          <X className="h-3.5 w-3.5" /> Close
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-6 md:px-7">
        <div className="rounded-3xl border border-primary/10 bg-white p-5 shadow-[0_18px_45px_hsl(var(--clay-shadow-outer)/0.10)] md:p-6">
          {children}
        </div>
      </div>
      <div className="flex justify-end border-t border-primary/10 bg-white/90 px-5 py-4 md:px-7">
        {action}
      </div>
    </section>
  </div>
);

const sectionTitle: Record<SettingsSection, string> = {
  inquiries: "Inquiry Settings",
  partners: "Partners Settings",
  leadership: "Leadership Settings",
};

const AdminSettings = ({ section = "inquiries" }: { section?: SettingsSection }) => {
  const qc = useQueryClient();
  const [inquiryForm, setInquiryForm] = useState<InquirySettings>(defaultInquirySettings);
  const [leadershipForm, setLeadershipForm] = useState<LeadershipSettingsRow>(defaultLeadershipSettings);
  const [partnerForm, setPartnerForm] = useState<PartnerSettingsRow>(defaultPartnerSettings);
  const [editingLeader, setEditingLeader] = useState<Partial<LeadershipMemberRow> | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partial<PartnerLogoRow> | null>(null);

  const { data: inquiryData } = useQuery({
    queryKey: ["admin", "inquiry-settings"],
    enabled: hasSupabaseConfig,
    queryFn: async () => {
      const { data, error } = await supabase.from("inquiry_settings").select("*").eq("id", true).maybeSingle();
      if (error) throw error;
      return data as unknown as InquirySettings | null;
    },
  });

  const { data: leadershipData } = useQuery({
    queryKey: ["admin", "leadership-settings"],
    enabled: hasSupabaseConfig,
    queryFn: async () => {
      const { data, error } = await supabase.from("leadership_settings").select("*").eq("id", true).maybeSingle();
      if (error) throw error;
      return data as unknown as LeadershipSettingsRow | null;
    },
  });

  const { data: leaders = [], isLoading: leadersLoading } = useQuery({
    queryKey: ["admin", "leadership-members"],
    enabled: hasSupabaseConfig,
    queryFn: async () => {
      const { data, error } = await supabase.from("leadership_members").select("*").order("sort_order");
      if (error) throw error;
      return data as unknown as LeadershipMemberRow[];
    },
  });

  const { data: partnerData } = useQuery({
    queryKey: ["admin", "partner-settings"],
    enabled: hasSupabaseConfig,
    queryFn: async () => {
      const { data, error } = await supabase.from("partner_settings").select("*").eq("id", true).maybeSingle();
      if (error) throw error;
      return data as unknown as PartnerSettingsRow | null;
    },
  });

  const { data: partnerLogos = [], isLoading: partnersLoading } = useQuery({
    queryKey: ["admin", "partner-logos"],
    enabled: hasSupabaseConfig,
    queryFn: async () => {
      const { data, error } = await supabase.from("partner_logos").select("*").order("sort_order");
      if (error) throw error;
      return data as unknown as PartnerLogoRow[];
    },
  });

  useEffect(() => {
    if (inquiryData) setInquiryForm(inquiryData);
  }, [inquiryData]);

  useEffect(() => {
    if (leadershipData) setLeadershipForm(leadershipData);
  }, [leadershipData]);

  useEffect(() => {
    if (partnerData) setPartnerForm(partnerData);
  }, [partnerData]);

  const invalidateLeadership = () => {
    qc.invalidateQueries({ queryKey: ["admin", "leadership-settings"] });
    qc.invalidateQueries({ queryKey: ["admin", "leadership-members"] });
    qc.invalidateQueries({ queryKey: ["leadership", "public"] });
  };

  const invalidatePartners = () => {
    qc.invalidateQueries({ queryKey: ["admin", "partner-settings"] });
    qc.invalidateQueries({ queryKey: ["admin", "partner-logos"] });
    qc.invalidateQueries({ queryKey: ["partners", "public"] });
  };

  const saveInquiry = useMutation({
    mutationFn: async (values: InquirySettings) => {
      if (!hasSupabaseConfig) throw new Error("Supabase is not configured for this frontend.");
      const invalid = values.notification_emails.filter((e) => !/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(e));
      if (invalid.length) throw new Error(`Not a valid email address: ${invalid.join(", ")}`);
      const { error } = await supabase.from("inquiry_settings").upsert({ id: true, ...values });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Inquiry settings saved");
      qc.invalidateQueries({ queryKey: ["admin", "inquiry-settings"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveLeadershipSettings = useMutation({
    mutationFn: async (values: LeadershipSettingsRow) => {
      if (!hasSupabaseConfig) throw new Error("Supabase is not configured for this frontend.");
      const { error } = await supabase.from("leadership_settings").upsert({ id: true, ...values });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Leadership section saved");
      invalidateLeadership();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const savePartnerSettings = useMutation({
    mutationFn: async (values: PartnerSettingsRow) => {
      if (!hasSupabaseConfig) throw new Error("Supabase is not configured for this frontend.");
      const { error } = await supabase.from("partner_settings").upsert({ id: true, ...values });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Partner section saved");
      invalidatePartners();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveLeader = useMutation({
    mutationFn: async (row: Partial<LeadershipMemberRow>) => {
      if (!hasSupabaseConfig) throw new Error("Supabase is not configured for this frontend.");
      const values = normalizeLeaderPayload(row);
      const { error } = row.id
        ? await supabase.from("leadership_members").update(values).eq("id", row.id)
        : await supabase.from("leadership_members").insert(values);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Leadership member saved");
      setEditingLeader(null);
      invalidateLeadership();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removeLeader = useMutation({
    mutationFn: async (id: string) => {
      if (!hasSupabaseConfig) throw new Error("Supabase is not configured for this frontend.");
      const { error } = await supabase.from("leadership_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Leadership member deleted");
      invalidateLeadership();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const savePartner = useMutation({
    mutationFn: async (row: Partial<PartnerLogoRow>) => {
      if (!hasSupabaseConfig) throw new Error("Supabase is not configured for this frontend.");
      const values = normalizePartnerPayload(row);
      const { error } = row.id
        ? await supabase.from("partner_logos").update(values).eq("id", row.id)
        : await supabase.from("partner_logos").insert(values);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Partner logo saved");
      setEditingPartner(null);
      invalidatePartners();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const removePartner = useMutation({
    mutationFn: async (id: string) => {
      if (!hasSupabaseConfig) throw new Error("Supabase is not configured for this frontend.");
      const { error } = await supabase.from("partner_logos").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Partner logo deleted");
      invalidatePartners();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleLeader = useMutation({
    mutationFn: async (row: LeadershipMemberRow) => {
      if (!hasSupabaseConfig) throw new Error("Supabase is not configured for this frontend.");
      const { error } = await supabase.from("leadership_members").update({ published: !row.published }).eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: invalidateLeadership,
    onError: (e: Error) => toast.error(e.message),
  });

  const togglePartner = useMutation({
    mutationFn: async (row: PartnerLogoRow) => {
      if (!hasSupabaseConfig) throw new Error("Supabase is not configured for this frontend.");
      const { error } = await supabase.from("partner_logos").update({ published: !row.published }).eq("id", row.id);
      if (error) throw error;
    },
    onSuccess: invalidatePartners,
    onError: (e: Error) => toast.error(e.message),
  });

  const setLeader = (patch: Partial<LeadershipMemberRow>) => setEditingLeader((current) => ({ ...current, ...patch }));
  const setPartner = (patch: Partial<PartnerLogoRow>) => setEditingPartner((current) => ({ ...current, ...patch }));

  return (
    <>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold leading-tight text-primary md:text-4xl">
          {sectionTitle[section]}
        </h1>
      </div>

      {!hasSupabaseConfig && (
        <AdminCard className="mb-6 border-destructive/40 bg-destructive/5">
          <p className="font-medium text-destructive">Supabase is not configured.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY to .env, then restart the dev server.
          </p>
        </AdminCard>
      )}

      <div className="grid gap-6">
        {section === "inquiries" && (
        <AdminCard id="inquiries" className="max-w-3xl scroll-mt-24 space-y-5">
          <div>
            <p className="eyebrow mb-1">Messages</p>
            <h2 className="font-heading text-lg font-semibold text-primary">Inquiry settings</h2>
            <p className="mt-1 text-sm text-muted-foreground">Control who gets notified and what buyers receive after submitting forms.</p>
          </div>
          <Labeled label="Notification recipients" hint="One email address per line - each gets a copy of every new inquiry.">
            <textarea
              rows={3}
              className={`${inputCls} h-auto py-3`}
              value={inquiryForm.notification_emails.join("\n")}
              onChange={(e) =>
                setInquiryForm({
                  ...inquiryForm,
                  notification_emails: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                })
              }
            />
          </Labeled>

          <label className="flex items-center gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              checked={inquiryForm.auto_reply_enabled}
              onChange={(e) => setInquiryForm({ ...inquiryForm, auto_reply_enabled: e.target.checked })}
            />
            Send an automatic confirmation to the buyer
          </label>

          <Labeled label="Confirmation subject">
            <input
              className={inputCls}
              value={inquiryForm.auto_reply_subject}
              onChange={(e) => setInquiryForm({ ...inquiryForm, auto_reply_subject: e.target.value })}
            />
          </Labeled>

          <Labeled label="Confirmation message">
            <textarea
              rows={5}
              className={`${inputCls} h-auto py-3`}
              value={inquiryForm.auto_reply_body}
              onChange={(e) => setInquiryForm({ ...inquiryForm, auto_reply_body: e.target.value })}
            />
          </Labeled>

          <button className={primaryBtn} disabled={saveInquiry.isPending || !hasSupabaseConfig} onClick={() => saveInquiry.mutate(inquiryForm)}>
            <Save className="h-4 w-4" /> Save inquiry settings
          </button>
        </AdminCard>
        )}

        {section === "partners" && (
        <>
        <AdminCard id="partners" className="max-w-5xl scroll-mt-24 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="font-heading text-lg font-semibold text-primary">Partner logos</h2>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">Add organizations shown in the automatically scrolling partner strip.</p>
            </div>
            <button className={primaryBtn} onClick={() => setEditingPartner({ ...emptyPartnerLogo, sort_order: partnerLogos.length })}>
              <Plus className="h-4 w-4" /> New partner
            </button>
          </div>

          <div className="max-w-xl">
            <Labeled label="Headline">
              <input className={inputCls} value={partnerForm.headline} onChange={(e) => setPartnerForm({ ...partnerForm, headline: e.target.value })} />
            </Labeled>
          </div>

          <button
            className={primaryBtn}
            disabled={savePartnerSettings.isPending || !hasSupabaseConfig}
            onClick={() => savePartnerSettings.mutate({ ...partnerForm, eyebrow: "Partners", body: "" })}
          >
            <Save className="h-4 w-4" /> Save partner section
          </button>
        </AdminCard>

        {editingPartner && (
          <FormPanel
            eyebrow="Partner entry"
            title={editingPartner.id ? "Edit partner logo" : "New partner logo"}
            onClose={() => setEditingPartner(null)}
            action={
              <button className={primaryBtn} disabled={savePartner.isPending || !hasSupabaseConfig} onClick={() => savePartner.mutate(editingPartner)}>
                <Save className="h-4 w-4" /> Save partner logo
              </button>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Labeled label="Partner name">
                <input className={inputCls} value={editingPartner.name ?? ""} onChange={(e) => setPartner({ name: e.target.value })} />
              </Labeled>
              <Labeled label="Sort order">
                <input type="number" className={inputCls} value={editingPartner.sort_order ?? 0} onChange={(e) => setPartner({ sort_order: Number(e.target.value) })} />
              </Labeled>
              <Labeled label="Website URL">
                <input className={inputCls} value={editingPartner.website_url ?? ""} onChange={(e) => setPartner({ website_url: e.target.value })} />
              </Labeled>
              <label className="flex items-center gap-3 pt-7 text-sm text-foreground">
                <input type="checkbox" checked={Boolean(editingPartner.published)} onChange={(e) => setPartner({ published: e.target.checked })} /> Published
              </label>
              <ImageField label="Partner logo" folder="partners" value={editingPartner.logo_url} onChange={(value) => setPartner({ logo_url: value })} />
            </div>
          </FormPanel>
        )}

        <AdminCard className="max-w-5xl overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left">
              <tr className="btn-label text-[10px] text-primary">
                <th className="px-4 py-3">Partner</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {partnersLoading && <tr><td colSpan={4} className="px-4 py-6 text-muted-foreground">Loading...</td></tr>}
              {!partnersLoading && partnerLogos.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-muted-foreground">No partner logos yet.</td></tr>}
              {partnerLogos.map((partner) => (
                <tr key={partner.id} className="border-t border-border">
                  <td className="px-4 py-3"><PartnerLogoPreview logo={partner} /></td>
                  <td className="px-4 py-3 text-foreground/70">{partner.sort_order}</td>
                  <td className="px-4 py-3 text-foreground/70">{partner.published ? "Published" : "Draft"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className={ghostBtn} onClick={() => togglePartner.mutate(partner)}>
                        {partner.published ? "Unpublish" : "Publish"}
                      </button>
                      <button className={ghostBtn} onClick={() => setEditingPartner(partner)}>Edit</button>
                      <button className={ghostBtn} onClick={() => { if (confirm(`Delete "${partner.name}"?`)) removePartner.mutate(partner.id); }}>
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
        </>
        )}

        {section === "leadership" && (
        <>
        <AdminCard id="leadership" className="max-w-4xl scroll-mt-24 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-lg font-semibold text-primary">Leadership section</h2>
              <p className="mt-1 text-sm text-muted-foreground">Manage the people shown in Leadership.</p>
            </div>
            <button className={primaryBtn} onClick={() => setEditingLeader({ ...emptyLeader, sort_order: leaders.length })}>
              <Plus className="h-4 w-4" /> New leader
            </button>
          </div>

          <div className="max-w-xl">
            <Labeled label="Headline">
              <input className={inputCls} value={leadershipForm.headline} onChange={(e) => setLeadershipForm({ ...leadershipForm, headline: e.target.value })} />
            </Labeled>
          </div>

          <button
            className={primaryBtn}
            disabled={saveLeadershipSettings.isPending || !hasSupabaseConfig}
            onClick={() => saveLeadershipSettings.mutate({
              ...leadershipForm,
              eyebrow: defaultLeadershipSettings.eyebrow,
              structure_label: defaultLeadershipSettings.structure_label,
              structure_body: defaultLeadershipSettings.structure_body,
              primary_phone: defaultLeadershipSettings.primary_phone,
              secondary_phone: defaultLeadershipSettings.secondary_phone,
            })}
          >
            <Save className="h-4 w-4" /> Save leadership section
          </button>
        </AdminCard>

        {editingLeader && (
          <FormPanel
            eyebrow="Leadership profile"
            title={editingLeader.id ? "Edit leadership member" : "New leadership member"}
            onClose={() => setEditingLeader(null)}
            action={
              <button className={primaryBtn} disabled={saveLeader.isPending || !hasSupabaseConfig} onClick={() => saveLeader.mutate(editingLeader)}>
                <Save className="h-4 w-4" /> Save leadership member
              </button>
            }
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Labeled label="Name">
                <input className={inputCls} value={editingLeader.name ?? ""} onChange={(e) => setLeader({ name: e.target.value })} />
              </Labeled>
              <Labeled label="Title">
                <input className={inputCls} value={editingLeader.title ?? ""} onChange={(e) => setLeader({ title: e.target.value })} />
              </Labeled>
              <Labeled label="Initials" hint="Auto-generated from name if left blank.">
                <input className={inputCls} value={editingLeader.initials ?? ""} onChange={(e) => setLeader({ initials: e.target.value })} />
              </Labeled>
              <Labeled label="Sort order">
                <input type="number" className={inputCls} value={editingLeader.sort_order ?? 0} onChange={(e) => setLeader({ sort_order: Number(e.target.value) })} />
              </Labeled>
              <Labeled label="Whatsapp Number">
                <input className={inputCls} value={editingLeader.whatsapp_number ?? ""} onChange={(e) => setLeader({ whatsapp_number: e.target.value })} />
              </Labeled>
              <Labeled label="Profile URL">
                <input className={inputCls} value={editingLeader.profile_url ?? ""} onChange={(e) => setLeader({ profile_url: e.target.value })} />
              </Labeled>
              <div className="md:col-span-2">
                <Labeled label="Quote">
                  <textarea rows={3} className={`${inputCls} h-auto py-3`} value={editingLeader.quote ?? ""} onChange={(e) => setLeader({ quote: e.target.value })} />
                </Labeled>
              </div>
              <ImageField label="Leader photo" folder="leadership" value={editingLeader.image_url} onChange={(value) => setLeader({ image_url: value })} />
              <label className="flex items-center gap-3 text-sm text-foreground">
                <input type="checkbox" checked={Boolean(editingLeader.published)} onChange={(e) => setLeader({ published: e.target.checked })} /> Published
              </label>
            </div>
          </FormPanel>
        )}

        <AdminCard className="max-w-5xl overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/60 text-left">
              <tr className="btn-label text-[10px] text-primary">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leadersLoading && <tr><td colSpan={4} className="px-4 py-6 text-muted-foreground">Loading...</td></tr>}
              {!leadersLoading && leaders.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-muted-foreground">No leadership members yet.</td></tr>}
              {leaders.map((leader) => (
                <tr key={leader.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{leader.name}</div>
                    <div className="text-xs text-muted-foreground">{leader.initials}</div>
                  </td>
                  <td className="px-4 py-3 text-foreground/70">{leader.title || "Not set"}</td>
                  <td className="px-4 py-3 text-foreground/70">{leader.published ? "Published" : "Draft"}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button className={ghostBtn} onClick={() => toggleLeader.mutate(leader)}>
                        {leader.published ? "Unpublish" : "Publish"}
                      </button>
                      <button className={ghostBtn} onClick={() => setEditingLeader(leader)}>Edit</button>
                      <button className={ghostBtn} onClick={() => { if (confirm(`Delete "${leader.name}"?`)) removeLeader.mutate(leader.id); }}>
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
        </>
        )}
      </div>
    </>
  );
};

export default AdminSettings;
