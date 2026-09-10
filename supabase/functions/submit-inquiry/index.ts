import { createClient } from 'npm:@supabase/supabase-js@2';
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { z } from 'npm:zod@3.23.8';

const BodySchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(100),
  company: z.string().trim().max(150).optional().or(z.literal('')),
  country: z.string().trim().max(100).optional().or(z.literal('')),
  email: z.string().trim().email('Please enter a valid email address').max(255),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
  productSlugs: z.array(z.string().trim().max(80)).max(20).default([]),
  volume: z.string().trim().max(120).optional().or(z.literal('')),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  source: z.enum(['inquire', 'contact']).default('inquire'),
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  const parsed = BodySchema.safeParse(raw);
  if (!parsed.success) {
    return json(
      {
        error: 'Please correct the highlighted fields and try again.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      400,
    );
  }
  const input = parsed.data;

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: inquiry, error: insertError } = await supabase
    .from('inquiries')
    .insert({
      name: input.name,
      company: input.company || null,
      country: input.country || null,
      email: input.email,
      phone: input.phone || null,
      product_slugs: input.productSlugs,
      volume: input.volume || null,
      message: input.message || null,
      source: input.source,
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('inquiry insert failed:', insertError.message);
    return json({ error: 'We could not save your inquiry. Please try again shortly.' }, 500);
  }

  const { data: settings } = await supabase
    .from('inquiry_settings')
    .select('*')
    .eq('id', true)
    .maybeSingle();

  const recipients: string[] = settings?.notification_emails ?? [];
  const summary = [
    `Name: ${input.name}`,
    input.company ? `Company: ${input.company}` : null,
    input.country ? `Country: ${input.country}` : null,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : null,
    input.productSlugs.length ? `Products: ${input.productSlugs.join(', ')}` : null,
    input.volume ? `Volume: ${input.volume}` : null,
    input.message ? `Message: ${input.message}` : null,
  ]
    .filter(Boolean)
    .join('\n');

  // Email dispatch is best-effort: a delivery problem must never lose the inquiry.
  let notified = false;
  const send = async (templateName: string, recipientEmail: string, templateData: Record<string, unknown>) => {
    const { error } = await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName,
        recipientEmail,
        idempotencyKey: `${templateName}-${inquiry.id}`,
        templateData,
      },
    });
    if (error) throw error;
  };

  try {
    for (const to of recipients) {
      await send('inquiry-notification', to, { summary, inquiryId: inquiry.id, name: input.name });
      notified = true;
    }
    if (settings?.auto_reply_enabled !== false) {
      await send('inquiry-confirmation', input.email, {
        name: input.name,
        subject: settings?.auto_reply_subject ?? 'We received your inquiry',
        body: settings?.auto_reply_body ?? '',
      });
    }
  } catch (e) {
    console.error('inquiry email dispatch skipped/failed:', e instanceof Error ? e.message : String(e));
  }

  if (notified) {
    await supabase.from('inquiries').update({ notified: true }).eq('id', inquiry.id);
  }

  return json({
    success: true,
    id: inquiry.id,
    message: 'Thank you — your inquiry has reached our export team.',
  });
});
