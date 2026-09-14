import { SiteImage } from "@/components/SiteImage";
import { motion } from "framer-motion";
import { Layout } from "@/components/Layout";
import { PageHero } from "@/components/PageHero";
import { pageHeroImages } from "@/data/cropImages";
import { siteVideos } from "@/data/videos";
import { HeroVideoBand } from "@/components/HeroVideoBand";
import { useLeadership, usePartners, type LeadershipMemberRow, type PartnerLogoRow } from "@/hooks/useCatalog";
import { useMediaUrl } from "@/lib/media";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

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

const leaderInitials = (leader: LeadershipMemberRow) =>
  leader.initials || leader.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const LeadershipPortrait = ({ leader }: { leader: LeadershipMemberRow }) => {
  const image = useMediaUrl(leader.image_url);

  if (image) {
    return (
      <div className="relative overflow-hidden rounded-xl bg-muted/40">
        <div className="absolute inset-x-8 top-0 z-10 h-1 bg-accent" />
        <SiteImage
          src={image}
          alt={`${leader.name}, ${leader.title}`}
          className="h-72 w-full object-cover object-center"
        />
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-tertiary/55 p-4 shadow-[inset_8px_8px_18px_hsl(var(--clay-shadow-outer)/0.16),inset_-8px_-8px_18px_hsl(0_0%_100%/0.86)]">
      <div className="absolute inset-x-8 top-0 h-1 bg-accent" />
      <div className="flex min-h-72 items-end justify-between gap-4">
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
    <span className="flex w-36 shrink-0 flex-col items-center gap-3 md:w-40">
      <span className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-primary/10 bg-white p-1 shadow-[10px_10px_24px_hsl(var(--clay-shadow-outer)/0.18),-10px_-10px_24px_hsl(0_0%_100%/0.96)] md:h-32 md:w-32">
      {logo ? (
        <SiteImage
          src={logo}
          alt={`${partner.name} logo`}
            className="h-full w-full rounded-full object-cover"
        />
      ) : (
          <span className="flex h-full w-full items-center justify-center rounded-full bg-tertiary text-center font-heading text-base font-bold leading-tight text-primary">
            {partner.name.slice(0, 2).toUpperCase()}
        </span>
      )}
      </span>
      <span className="max-w-full truncate text-center text-xs font-semibold text-primary/80">
        {partner.name}
      </span>
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

const uniquePartnerLogos = (partners: PartnerLogoRow[]) =>
  partners.filter((partner, index, list) => {
    const key = `${partner.name.trim().toLowerCase()}|${partner.logo_url ?? ""}`;
    return list.findIndex((item) => `${item.name.trim().toLowerCase()}|${item.logo_url ?? ""}` === key) === index;
  });

const About = () => {
  const { data: leadership } = useLeadership();
  const { data: partners } = usePartners();
  const leadershipSettings = leadership?.settings;
  const leadershipMembers = leadership?.members ?? [];
  const partnerSettings = partners?.settings;
  const partnerLogos = uniquePartnerLogos(partners?.logos ?? []);
  const marqueePartners = partnerLogos;

  return (
  <Layout>
    <PageHero
      eyebrow="From Our Farms to the World"
      title="Women driven"
      titleAccent="communities"
      subtitle="Elgon Vanilla, Coffee & Cocoa Growers' Cooperative Society [EVCCGCS] was formed by women farmers seeking better organic practices, fair marketing, and stronger livelihoods across the Elgon region."
      image={pageHeroImages.about}
      imageAlt="Hands sorting cured vanilla beans"
      mediaVariant="clearImage"
    />

    {/* Vision / Mission / Philosophy */}
      <section className="container-full grid gap-6 py-16 md:grid-cols-3">
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
          className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6"
        >
          <h2 className="mb-2 font-heading text-xl font-semibold text-primary">{v.title}</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">{v.body}</p>
        </motion.div>
      ))}
    </section>

    {/* Story */}
    <section className="bg-muted/40">
      <div className="container-full py-24 grid gap-16 lg:grid-cols-2 items-center">
        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl shadow-sm lg:aspect-[4/3]">
          <SiteImage
            src={pageHeroImages.harvested}
            alt="Harvested coffee ready for processing"
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
    <section className="container-full py-16">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary">
          What we stand for
        </h2>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Sustainability", body: "Commitment to environmentally responsible farming practices." },
          { title: "Quality", body: "Unwavering dedication to high-grade cocoa, coffee, and vanilla." },
          { title: "Community Development", body: "Uplifting local communities through employment, training and sustainability." },
        ].map((v, i) => (
          <div key={i} className="flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm hover-lift">
            <h3 className="font-heading text-lg font-semibold text-primary mb-2">{v.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">{v.body}</p>
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
      <section className="overflow-hidden bg-white py-16 md:py-20">
        <div className="container-full">
          <div className="mx-auto mb-10 max-w-4xl text-center">
            <h2 className="font-heading text-4xl font-bold leading-tight text-primary md:text-5xl">
              {partnerSettings?.headline ?? "Working with trusted partners."}
            </h2>
          </div>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent md:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent md:w-28" />
          <div className="overflow-hidden py-4">
            <div
              className={
                partnerLogos.length > 1
                  ? "mx-auto flex w-max animate-partner-drift items-center justify-center gap-8"
                  : "mx-auto flex justify-center"
              }
            >
              {marqueePartners.map((partner, index) => (
                <div
                  key={`${partner.id}-${index}`}
                  className={partnerLogos.length === 1 ? "animate-float" : ""}
                >
                  <PartnerLogoItem partner={partner} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )}

    {/* Leadership */}
    {leadershipMembers.length > 0 && (
    <section className="bg-[#f7f8f5]">
      <div className="container-full py-24">
        <div className="mx-auto mb-10 max-w-4xl text-center">
          <h2 className="font-heading text-4xl font-bold leading-tight text-primary md:text-5xl">
            {leadershipSettings?.headline ?? "Guided by experience."}
          </h2>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
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
                    <p className="btn-label mt-1 text-accent">
                      {leader.title}
                    </p>
                  </div>
                </div>

                <Link
                  to={`/about/leadership/${leader.id}`}
                  className="neo-button mt-auto flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-primary"
                  aria-label={`View ${leader.name} profile`}
                >
                  View Profile
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>

        
      </div>
    </section>
    )}

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
