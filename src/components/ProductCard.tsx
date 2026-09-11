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
      className="group h-full overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-xl"
    >
      <Link to={`/products/${product.slug}`} className="block h-full">
        <div className="relative aspect-[4/5] min-h-[20rem] overflow-hidden bg-muted/40 sm:min-h-[24rem] md:min-h-[28rem] lg:min-h-[30rem]">
          <SiteImage
            src={images[0]} fallbackSrc={cropHero[product.category]}
            alt={product.name}
            className={cn(
              "h-full w-full object-cover brightness-110 contrast-110 saturate-125 transition-all [transition-duration:1s] ease-out",
              hasSecondImage ? "group-hover:opacity-0 group-hover:scale-105" : "group-hover:scale-105"
            )}
          />
          {hasSecondImage && (
            <SiteImage
              src={images[1]} fallbackSrc={cropHero[product.category]}
              alt={`${product.name}, alternate view`}
              className="absolute inset-0 h-full w-full scale-105 object-cover brightness-110 contrast-110 saturate-125 opacity-0 transition-all [transition-duration:1s] ease-out group-hover:scale-100 group-hover:opacity-100"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#062516]/18 via-transparent to-transparent" />

          {product.featured && (
            <span className="btn-label absolute right-4 top-4 rounded-full bg-accent px-3 py-1.5 text-[10px] text-accent-foreground shadow-lg">
              Featured
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 h-[28%]">
            <div className="flex h-full w-full min-w-0 flex-col justify-center rounded-b-[1.75rem] border-t border-white/25 bg-[#062516]/50 px-4 py-2 text-primary-foreground shadow-2xl shadow-black/20 backdrop-blur-md backdrop-saturate-150 sm:px-5 md:px-6 lg:px-7">
              <p className="eyebrow mb-0.5 text-[0.58rem] text-accent">{category?.name}</p>
              <h3 className="break-words font-heading text-[clamp(1.25rem,7vw,1.45rem)] leading-none text-primary-foreground drop-shadow-sm md:text-[1.6rem]">
                {product.name}
              </h3>
              <p className="mt-1 max-w-sm overflow-hidden text-[0.78rem] leading-snug text-primary-foreground/95 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2] md:text-[0.86rem]">
                {product.tagline}
              </p>
              <span className="mt-1.5 inline-flex text-[0.68rem] font-semibold text-accent transition-colors group-hover:text-primary-foreground">
                View Details
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
};
