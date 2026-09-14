import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Seo } from "@/components/Seo";

const NotFound = () => (
  <Layout>
    <Seo
      title="Page Not Found | Elgon Cooperative"
      description="The page could not be found. Return to Elgon Cooperative to explore Ugandan vanilla, coffee and cocoa."
      path="/404"
      noindex
    />
    <section className="container-full py-32 md:py-40 text-center">
      <p className="eyebrow mb-4">404</p>
      <h1 className="font-heading font-bold text-5xl md:text-7xl text-primary mb-6">Page not found</h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-10">
        The page you're looking for isn't here. Head back to the homepage to keep exploring.
      </p>
      <Link
        to="/"
        className="btn-label text-xs inline-flex items-center bg-primary text-primary-foreground px-8 py-4 rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors"
      >
        Back to Home
      </Link>
    </section>
  </Layout>
);

export default NotFound;
