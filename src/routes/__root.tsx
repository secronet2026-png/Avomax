import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 text-white">
      <div className="max-w-md text-center">
        <div className="text-[11px] uppercase tracking-[0.3em] text-accent">Lost in transit</div>
        <h1 className="mt-3 font-display text-7xl">404</h1>
        <h2 className="mt-3 font-display text-2xl">This page hasn't checked in.</h2>
        <p className="mt-3 text-sm text-white/65">
          The page you're looking for doesn't exist or has moved. Let's get you back on the journey.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="rounded-full bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-medium text-white hover:scale-[1.03] transition-transform">
            Return Home
          </Link>
          <a
            href="https://wa.me/263780078824?text=Hello%20AVOMAX%2C%20I%20landed%20on%20a%20404%20and%20need%20help."
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-medium hover:bg-white/10 transition"
          >
            WhatsApp Inquiry
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AVOMAX Global Consultancy — International Opportunity Starts Here" },
      { name: "description", content: "Premium global consultancy for study abroad admissions, medical tourism, visa support, accommodation, flights and airport pickup." },
      { property: "og:title", content: "AVOMAX Global Consultancy" },
      { property: "og:description", content: "Unlock global opportunities without limits — study, medical and travel concierge." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "AVOMAX Global Consultancy" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AVOMAX Global Consultancy" },
      { name: "twitter:description", content: "Study abroad, medical tourism and travel concierge — from Harare to the world." },
      // Placeholder — paste real verification code from Google Search Console
      // { name: "google-site-verification", content: "REPLACE_WITH_VERIFICATION_CODE" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": ["Organization", "EducationalOrganization", "LocalBusiness"],
              name: "AVOMAX Global Consultancy Pvt Ltd",
              url: "/",
              email: "avomaxadmission@gmail.com",
              telephone: ["+263780078824", "+263782457669", "+917011978890", "+918580781871"],
              address: {
                "@type": "PostalAddress",
                streetAddress: "53 Samora Machel Avenue, Karigamombe Center, 11th Floor",
                addressLocality: "Harare",
                addressCountry: "ZW",
              },
              sameAs: ["https://www.instagram.com/avomax_global_consultancy"],
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SiteHeader />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <SiteFooter />
      <WhatsAppFab />
    </QueryClientProvider>
  );
}
