import { SiteImage } from "@/components/SiteImage";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
      className="group overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl"
    >
      <Link to={`/products?category=${category.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden">
          <SiteImage
            src={category.image}
            alt={category.name}
            className="w-full h-full object-cover transition-transform [transition-duration:1.2s] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/35 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="eyebrow text-accent mb-2">Product</p>
            <h3 className="font-heading text-3xl text-primary-foreground mb-2">
              {category.name}
            </h3>
            <p className="text-sm text-primary-foreground/80 max-w-xs mb-4">
              {category.tagline}
            </p>
            <span className="inline-flex items-center gap-2 btn-label text-xs text-accent">
              Explore <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
