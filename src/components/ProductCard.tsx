import { cropHero, productImages } from "@/data/cropImages";
import { SiteImage } from "@/components/SiteImage";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Product, categories } from "@/data/products";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const category = categories.find((c) => c.id === product.category);
  const images = productImages(product.images, product.category);
  const hasSecondImage = images.length > 1;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group h-full overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl"
    >
      <Link to={`/products/${product.slug}`} className="flex h-full flex-col">
        <div className="relative overflow-hidden bg-muted/40 aspect-[4/5]">
          <SiteImage
            src={images[0]} fallbackSrc={cropHero[product.category]}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-all [transition-duration:1s] ease-out",
              hasSecondImage ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
            )}
          />
          {hasSecondImage && (
            <SiteImage
              src={images[1]} fallbackSrc={cropHero[product.category]}
              alt={`${product.name}, alternate view`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 transition-all [transition-duration:1s] ease-out group-hover:opacity-100 group-hover:scale-100"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {category && (
            <span className="absolute top-4 left-4 px-3 py-1.5 btn-label text-[10px] bg-primary text-primary-foreground rounded-full">
              {category.name}
            </span>
          )}

          {product.featured && (
            <span className="absolute top-4 right-4 px-3 py-1.5 btn-label text-[10px] bg-accent text-accent-foreground rounded-full">
              Featured
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col space-y-2 p-5 md:p-6">
          <p className="eyebrow">{category?.name}</p>
          <h3 className="min-h-[3.25rem] font-heading text-xl text-foreground transition-colors duration-300 group-hover:text-primary leading-snug">
            {product.name}
          </h3>
          <p className="min-h-[3rem] text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {product.tagline}
          </p>
          <div className="mt-auto flex items-center pt-4 btn-label text-xs text-primary group-hover:text-accent transition-colors">
            View Details
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
