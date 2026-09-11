import { SiteImage } from "@/components/SiteImage";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Category } from "@/data/products";

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export const CollectionCard = ({ category, index = 0 }: CategoryCardProps) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group h-full overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl"
    >
      <Link to={`/products?category=${category.slug}`} className="block h-full">
        <div className="relative aspect-[4/5] min-h-[24rem] overflow-hidden md:min-h-[28rem] lg:min-h-[30rem]">
          <SiteImage
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover transition-transform [transition-duration:1.2s] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e3a2b]/95 via-[#0e3a2b]/45 to-[#0e3a2b]/10" />
          <div className="absolute inset-x-0 bottom-0 flex min-h-[13rem] flex-col justify-end gap-2 p-5 md:p-6 lg:p-7">
            <p className="eyebrow mb-1 text-accent">Product</p>
            <h3 className="font-heading text-3xl leading-none text-primary-foreground md:text-[2.1rem]">
              {category.name}
            </h3>
            <p className="max-w-xs text-sm leading-relaxed text-primary-foreground/90 md:text-[0.95rem]">
              {category.tagline}
            </p>
            <span className="mt-2 inline-flex text-xs font-semibold text-accent transition-colors group-hover:text-primary-foreground">
              Explore
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
