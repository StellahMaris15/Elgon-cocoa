import { SiteImage } from "@/components/SiteImage";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { pageHeroImages } from "@/data/cropImages";
import { siteVideos } from "@/data/videos";
import { HeroVideoBand } from "@/components/HeroVideoBand";
import { useLeadership, usePartners, type LeadershipMemberRow, type PartnerLogoRow } from "@/hooks/useCatalog";
import { useMediaUrl } from "@/lib/media";
import { ArrowRight, Mail, Phone, Sprout } from "lucide-react";

const OBJECTIVES = [
  "Promote organic farming of vanilla, coffee and cocoa.",
  "Promote value addition in line with Uganda's national strategy.",
  "Support women and smallholder farmers through collective marketing.",
  "Train farmers on farm sustainability and best agricultural practices.",
  "Maintain the highest quality of vanilla, coffee and cocoa.",
  "Export quality vanilla, coffee and cocoa to the world.",
  "Advocate for value-addition facilities in the region.",
  "Create profit sharing partnerships on behalf of the farmers.",
];

const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

const whatsappHref = (phone: string) => {
  const trimmed = phone.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
};

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12.04 2a9.9 9.9 0 0 0-8.53 14.94L2.2 21.8l4.97-1.3A9.95 9.95 0 1 0 12.04 2Zm0 1.72a8.23 8.23 0 1 1-4.17 15.33l-.3-.18-2.95.78.79-2.88-.2-.31A8.23 8.23 0 0 1 12.04 3.72Zm-3.5 4.1c-.18 0-.46.07-.7.34-.24.26-.92.9-.92 2.2 0 1.3.95 2.56 1.08 2.74.13.18 1.84 2.95 4.55 4.02 2.25.89 2.72.72 3.21.67.49-.04 1.58-.65 1.8-1.27.22-.62.22-1.16.16-1.27-.07-.11-.24-.18-.51-.31-.27-.13-1.58-.78-1.83-.87-.25-.09-.42-.13-.6.13-.18.27-.69.87-.84 1.05-.16.18-.31.2-.58.07-.27-.13-1.12-.41-2.13-1.31-.79-.7-1.32-1.57-1.47-1.83-.16-.27-.02-.41.12-.54.12-.12.27-.31.4-.47.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.47-.07-.13-.6-1.44-.82-1.97-.22-.52-.44-.45-.6-.45h-.53Z" />
  </svg>
);

const leaderInitials = (leader: LeadershipMemberRow) =>
  leader.initials || leader.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const LeadershipPortrait = ({ leader }: { leader: LeadershipMemberRow }) => {
  const image = useMediaUrl(leader.image_url);

  if (image) {
    return (
      <SiteImage
        src={image}
        alt={`${leader.name}, ${leader.title}`}
        className="h-44 w-full rounded-xl object-cover"
      />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-tertiary/55 p-4 shadow-[inset_8px_8px_18px_hsl(var(--clay-shadow-outer)/0.16),inset_-8px_-8px_18px_hsl(0_0%_100%/0.86)]">
      <div className="absolute inset-x-8 top-0 h-1 bg-accent" />
      <div className="flex min-h-44 items-end justify-between gap-4">
        <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white text-3xl font-bold text-primary shadow-[10px_10px_22px_hsl(var(--clay-shadow-outer)/0.22),-10px_-10px_22px_hsl(0_0%_100%/0.92)]">
          {leaderInitials(leader)}
        </div>
        <div className="max-w-[11rem] pb-3 text-right">
          <p className="text-[11px] font-semibold uppercase leading-relaxed text-primary/55">
            Elgon cooperative leadership
          </p>
        </div>
      </div>
    </div>
  );
};

const PartnerLogoItem = ({ partner }: { partner: PartnerLogoRow }) => {
  const logo = useMediaUrl(partner.logo_url);
  const content = (
    <span className="neo-inset flex h-24 w-48 shrink-0 items-center justify-center px-6 py-4 md:w-56">
      {logo ? (
        <SiteImage
          src={logo}
          alt={`${partner.name} logo`}
          className="max-h-14 w-full object-contain"
        />
      ) : (
        <span className="text-center font-heading text-lg font-bold leading-tight text-primary">
          {partner.name}
        </span>
      )}
    </span>
  );

  if (partner.website_url) {
    return (
      <a href={partner.website_url} target="_blank" rel="noreferrer" aria-label={partner.name}>
        {content}
      </a>
    );
  }

  return content;
};

const About = () => {
  const { data: leadership } = useLeadership();
  const { data: partners } = usePartners();
  const leadershipSettings = leadership?.settings;
  const leadershipMembers = leadership?.members ?? [];
  const partnerSettings = partners?.settings;
  const partnerLogos = partners?.logos ?? [];
  const marqueePartners = partnerLogos.length > 0 ? [...partnerLogos, ...partnerLogos] : [];

  return (
  <Layout>
    <PageHero
      eyebrow="From Our Farms to the World"
      title="13 years building"
      titleAccent="self reliant communities"
      subtitle="Elgon Vanilla, Coffee & Cocoa Growers' Cooperative Society [EVCCGCS] was formed by women farmers seeking better organic practices, fair marketing, and stronger livelihoods across the Elgon region."
      image={pageHeroImages.about}
      imageAlt="Hands sorting cured vanilla beans"
      mediaVariant="clearImage"
    />

    {/* Vision / Mission / Philosophy */}
      <section className="container-full py-24 grid gap-12 md:grid-cols-3">
      {[
        { title: "Vision", body: "Building farmers with sustainable farming skills, cohesive, self reliant communities." },
        { title: "Mission", body: "To contribute to the betterment of agro-business Ugandan communities." },
        { title: "Philosophy", body: "Inclusive programs addressing the needs of women and youth all along the vanilla, coffee and cocoa supply chain." },
      ].map((v, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex h-full flex-col rounded-2xl border border-border bg-card p-7 shadow-sm"
        >
          <h2 className="min-h-[2rem] font-heading font-semibold text-2xl text-primary mb-3">{v.title}</h2>
          <p className="text-muted-foreground leading-relaxed">{v.body}</p>
        </motion.div>
      ))}
    </section>

    {/* Story */}
    <section className="bg-muted/40">
      <div className="container-full py-24 grid gap-16 lg:grid-cols-2 items-center">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-sm">
          <SiteImage
            src={"/src/assets/harvested.jpg"}
            alt="Cured vanilla beans bundled on natural linen"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="font-heading font-bold text-4xl text-primary mb-6 leading-tight">
            One of the leading agro-industrial actors in the Elgon region.
          </h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Our know-how builds on 13 years of providing customers with high-quality
              commodities and value addition. We operate in the districts of Sironko,
              Bulambuli, Mbale City, Mbale, Manafwa, Bududa and Kapchorwa.
            </p>
            <p>
              We support women who are vulnerable, including those violated
              domestically, reconciling them with their spouses on the farm and
              improving livelihoods through small-scale business.
            </p>
            <p>
              Our strength lies in the skills of our workers, the diversity of our
              teams, and a deep understanding of the regions in which we operate and
              supply to countries worldwide.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Core values */}
    <section className="container-full py-24">
      <div className="max-w-2xl mb-12">
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary">
          What we stand for
        </h2>
      </div>
      <div className="grid gap-8 md:grid-cols-3">
        {[
          { title: "Sustainability", body: "Commitment to environmentally responsible farming practices." },
          { title: "Quality", body: "Unwavering dedication to high-grade cocoa, coffee, and vanilla." },
          { title: "Community Development", body: "Uplifting local communities through employment, training and sustainable practice." },
        ].map((v, i) => (
          <div key={i} className="flex h-full flex-col p-8 bg-card border border-border rounded-2xl shadow-sm hover-lift">
            <h3 className="min-h-[3rem] font-heading font-semibold text-xl text-primary mb-3">{v.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{v.body}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Objectives */}
    <section className="bg-white text-primary">
      <div className="container-full py-24">
        <div className="mx-auto mb-12 max-w-4xl text-center">
          <h2 className="font-heading font-bold text-4xl md:text-5xl leading-tight text-primary">
            What we set out to achieve.
          </h2>
        </div>
        <div className="grid max-w-6xl gap-6 md:grid-cols-2 mx-auto">
          {OBJECTIVES.map((o, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex h-full gap-4 rounded-2xl border border-primary/20 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="btn-label text-accent text-sm shrink-0">{String(i + 1).padStart(2, "0")}</span>
              <p className="text-muted-foreground leading-relaxed">{o}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {partnerLogos.length > 0 && (
      <section className="overflow-hidden bg-muted/40 py-20">
        <div className="container-full">
          <div className="mb-10 max-w-3xl">
            <p className="eyebrow mb-3">{partnerSettings?.eyebrow ?? "Partners"}</p>
            <h2 className="font-heading text-4xl font-bold leading-tight text-primary md:text-5xl">
              {partnerSettings?.headline ?? "Working with trusted partners."}
            </h2>
            {partnerSettings?.body && (
              <p className="mt-4 max-w-2xl text-muted-foreground leading-relaxed">
                {partnerSettings.body}
              </p>
            )}
          </div>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-muted/40 to-transparent md:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-muted/40 to-transparent md:w-28" />
          <div className="marquee">
            <div className="marquee-content gap-5 py-4 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]">
              {marqueePartners.map((partner, index) => (
                <PartnerLogoItem key={`${partner.id}-${index}`} partner={partner} />
              ))}
            </div>
          </div>
        </div>
      </section>
    )}

    {/* Leadership */}
    <section className="bg-[#f7f8f5]">
      <div className="container-full py-24">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="eyebrow mb-3">{leadershipSettings?.eyebrow ?? "Leadership"}</p>
            <h2 className="font-heading text-4xl font-bold leading-tight text-primary md:text-5xl">
              {leadershipSettings?.headline ?? "Guided by experience."}
            </h2>
          </div>
          <div className="neo-inset max-w-xl p-5">
            <div className="flex gap-4">
              <span className="neo-chip flex h-11 w-11 shrink-0 items-center justify-center text-primary">
                <Sprout className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="btn-label text-primary">{leadershipSettings?.structure_label ?? "Leadership structure"}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {leadershipSettings?.structure_body}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {leadershipMembers.map((leader, index) => (
            <motion.article
              key={leader.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: index * 0.08 }}
              className="neo-surface clay-interactive flex h-full flex-col overflow-hidden p-5"
            >
              <LeadershipPortrait leader={leader} />

              <div className="flex flex-1 flex-col pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-2xl font-bold leading-tight text-primary">
                      {leader.name}
                    </h3>
                    <p className="btn-label mt-1 text-xs text-accent">{leader.title}</p>
                  </div>
                  {leader.whatsapp_number && (
                    <a
                      href={whatsappHref(leader.whatsapp_number)}
                      aria-label={`${leader.name} WhatsApp number`}
                      className="neo-button flex h-10 w-10 shrink-0 items-center justify-center text-primary"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <WhatsAppIcon className="h-5 w-5" />
                    </a>
                  )}
                </div>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {leader.quote}
                </p>

                <a
                  href={leader.profile_url || "#contact"}
                  className="neo-button btn-label mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-primary"
                  target={leader.profile_url?.startsWith("http") ? "_blank" : undefined}
                  rel={leader.profile_url?.startsWith("http") ? "noreferrer" : undefined}
                >
                  View Profile
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm md:grid-cols-2">
          <a href={telHref(leadershipSettings?.primary_phone ?? "+256 782 528 476")} className="neo-inset flex items-center gap-3 p-4 text-sm font-semibold text-primary">
            <Phone className="h-4 w-4 text-accent" aria-hidden="true" />
            {leadershipSettings?.primary_phone ?? "+256 782 528 476"}
          </a>
          <a href={telHref(leadershipSettings?.secondary_phone ?? "+256 706 613 980")} className="neo-inset flex items-center gap-3 p-4 text-sm font-semibold text-primary">
            <Mail className="h-4 w-4 text-accent" aria-hidden="true" />
            {leadershipSettings?.secondary_phone ?? "+256 706 613 980"}
          </a>
        </div>
      </div>
    </section>

    <HeroVideoBand
      src={siteVideos.sourcing}
      poster={pageHeroImages.about}
      label="Elgon cooperative sourcing and farming footage"
      className="-mb-24 md:min-h-[calc(76svh+6rem)]"
      overlayClassName="bg-none"
    />
  </Layout>
  );
};

export default About;
