const preloaders: Array<{ match: (path: string) => boolean; load: () => Promise<unknown> }> = [
  { match: (path) => path === "/about" || path.startsWith("/about/leadership/"), load: () => import("@/pages/About") },
  { match: (path) => path === "/products", load: () => import("@/pages/Products") },
  { match: (path) => path.startsWith("/products/"), load: () => import("@/pages/ProductDetail") },
  { match: (path) => path === "/farmers", load: () => import("@/pages/Farmers") },
  { match: (path) => path.startsWith("/farmers/"), load: () => import("@/pages/FarmerDetail") },
  { match: (path) => path === "/contact", load: () => import("@/pages/Contact") },
  { match: (path) => path.startsWith("/inquire"), load: () => import("@/pages/Inquire") },
  { match: (path) => path === "/auth", load: () => import("@/pages/Auth") },
];

const preloaded = new Set<string>();

export const preloadRoute = (path: string) => {
  if (!path || preloaded.has(path)) return;
  const route = preloaders.find((item) => item.match(path));
  if (!route) return;
  preloaded.add(path);
  void route.load();
};
