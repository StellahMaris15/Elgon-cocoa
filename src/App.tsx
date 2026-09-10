import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Farmers = lazy(() => import("./pages/Farmers"));
const FarmerDetail = lazy(() => import("./pages/FarmerDetail"));
const Contact = lazy(() => import("./pages/Contact"));
const Inquire = lazy(() => import("./pages/Inquire"));
const Auth = lazy(() => import("./pages/Auth"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminOverview = lazy(() => import("./pages/admin/AdminOverview"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts"));
const AdminFarmers = lazy(() => import("./pages/admin/AdminFarmers"));
const AdminInquiries = lazy(() => import("./pages/admin/AdminInquiries"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 60_000, refetchOnWindowFocus: false } },
});

const RouteFallback = () => (
  <div className="min-h-[60vh] grid place-items-center" role="status" aria-live="polite">
    <span className="btn-label text-[11px] text-muted-foreground">Loading…</span>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/farmers" element={<Farmers />} />
              <Route path="/farmers/:slug" element={<FarmerDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/inquire" element={<Inquire />} />
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminOverview />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="farmers" element={<AdminFarmers />} />
                <Route path="inquiries" element={<AdminInquiries />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
