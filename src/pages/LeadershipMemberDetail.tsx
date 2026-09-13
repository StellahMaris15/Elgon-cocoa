import { SiteImage } from "@/components/SiteImage";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";
import { useLeadershipMember, type LeadershipMemberRow } from "@/hooks/useCatalog";
import { useMediaUrl } from "@/lib/media";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const initialsFor = (leader: LeadershipMemberRow) =>
  leader.initials || leader.name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

const whatsappHref = (phone: string) => {
  const trimmed = phone.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : "#";
};

const LeadershipProfileMedia = ({ leader }: { leader: LeadershipMemberRow }) => {
  const image = useMediaUrl(leader.image_url);

  if (image) {
    return (
      <SiteImage
        src={image}
        alt={`${leader.name}, ${leader.title}`}
        className="h-auto max-h-[72vh] w-full rounded-3xl object-contain shadow-[0_18px_45px_hsl(var(--clay-shadow-outer)/0.14)]"
        loading="eager"
      />
    );
  }

  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-tertiary/55 p-6 shadow-[inset_10px_10px_24px_hsl(var(--clay-shadow-outer)/0.16),inset_-10px_-10px_24px_hsl(0_0%_100%/0.90)]">
      <div className="absolute inset-x-10 top-0 h-1.5 bg-accent" />
      <div className="flex h-full items-center justify-center">
        <div className="grid h-36 w-36 place-items-center rounded-full bg-white font-heading text-5xl font-bold text-primary shadow-[12px_12px_28px_hsl(var(--clay-shadow-outer)/0.22),-12px_-12px_28px_hsl(0_0%_100%/0.95)]">
          {initialsFor(leader)}
        </div>
      </div>
    </div>
  );
};

const LeadershipMemberDetail = () => {
  const { id } = useParams();
  const { data: leader, isLoading } = useLeadershipMember(id);

  if (isLoading) {
    return (
      <Layout>
        <div className="container-full py-32">
          <div className="h-80 animate-pulse rounded-3xl bg-muted/50" />
        </div>
      </Layout>
    );
  }

  if (!leader) {
    return (
      <Layout>
        <section className="container-full py-32 text-center">
          <h1 className="font-heading text-3xl font-bold text-primary">Leadership profile not found</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            This profile may have been unpublished or removed by the cooperative office.
          </p>
          <Link to="/about" className="btn-label mt-8 inline-flex items-center gap-2 text-primary hover:text-accent">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to About
          </Link>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <Seo
        title={`${leader.name} | Elgon Cooperative Leadership`}
        description={(leader.quote || `${leader.name}, ${leader.title}.`).slice(0, 155)}
        path={`/about/leadership/${leader.id}`}
      />

      <section className="container-full pt-12">
        <Link to="/about" className="btn-label inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to About
        </Link>
      </section>

      <section className="container-full grid items-start gap-10 pb-20 pt-8 lg:grid-cols-[420px_1fr] lg:gap-14">
        <LeadershipProfileMedia leader={leader} />

        <div className="neo-surface p-7 md:p-9">
          <p className="eyebrow mb-3">Leadership profile</p>
          <h1 className="font-heading text-4xl font-bold leading-tight text-primary md:text-5xl">
            {leader.name}
          </h1>
          {leader.title && (
            <p className="btn-label mt-3 text-accent">{leader.title}</p>
          )}

          {leader.quote && (
            <div className="mt-8 whitespace-pre-line border-t border-primary/10 pt-6 text-base leading-relaxed text-foreground md:text-lg">
              {leader.quote}
            </div>
          )}

          {leader.whatsapp_number && (
            <div className="mt-8 border-t border-primary/10 pt-6">
              <a
                href={whatsappHref(leader.whatsapp_number)}
                target="_blank"
                rel="noreferrer"
                className="btn-label inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs text-primary-foreground transition-colors hover:bg-secondary"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default LeadershipMemberDetail;
