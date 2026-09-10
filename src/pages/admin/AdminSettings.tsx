import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminCard, AdminHeading, Labeled, inputCls, primaryBtn } from "./ui";

interface Settings {
  notification_emails: string[];
  auto_reply_enabled: boolean;
  auto_reply_subject: string;
  auto_reply_body: string;
}

const AdminSettings = () => {
  const qc = useQueryClient();
  const [form, setForm] = useState<Settings | null>(null);

  const { data } = useQuery({
    queryKey: ["admin", "inquiry-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("inquiry_settings").select("*").eq("id", true).maybeSingle();
      if (error) throw error;
      return data as unknown as Settings | null;
    },
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async (values: Settings) => {
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

  if (!form) return <AdminCard><p className="text-sm text-muted-foreground">Loading…</p></AdminCard>;

  return (
    <>
      <AdminHeading title="Inquiry settings" subtitle="Who gets notified, and what buyers receive back." />
      <AdminCard className="max-w-2xl space-y-5">
        <Labeled label="Notification recipients" hint="One email address per line — each gets a copy of every new inquiry.">
          <textarea
            rows={3}
            className={`${inputCls} h-auto py-3`}
            value={form.notification_emails.join("\n")}
            onChange={(e) => setForm({ ...form, notification_emails: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
          />
        </Labeled>

        <label className="flex items-center gap-3 text-sm text-foreground">
          <input
            type="checkbox"
            checked={form.auto_reply_enabled}
            onChange={(e) => setForm({ ...form, auto_reply_enabled: e.target.checked })}
          />
          Send an automatic confirmation to the buyer
        </label>

        <Labeled label="Confirmation subject">
          <input className={inputCls} value={form.auto_reply_subject} onChange={(e) => setForm({ ...form, auto_reply_subject: e.target.value })} />
        </Labeled>

        <Labeled label="Confirmation message">
          <textarea rows={5} className={`${inputCls} h-auto py-3`} value={form.auto_reply_body} onChange={(e) => setForm({ ...form, auto_reply_body: e.target.value })} />
        </Labeled>

        <button className={primaryBtn} disabled={save.isPending} onClick={() => save.mutate(form)}>
          <Save className="w-4 h-4" /> Save settings
        </button>
      </AdminCard>
    </>
  );
};

export default AdminSettings;
