import type { Metadata } from "next";
import Header from "@/components/header";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://iamxr.space"),
  title: { default: "Xr-Space", template: "%s | Xr-Space" },
  description: "Xr-Space — XR 的个人网站与博客。",
  openGraph: {
    title: "Xr-Space",
    description: "XR 的个人网站与博客。构建产品、探索技术、分享想法。",
    url: "https://iamxr.space",
    siteName: "Xr-Space",
    locale: "zh_CN",
    type: "website",
  },
  twitter: { card: "summary", title: "Xr-Space", description: "XR 的个人网站与博客。" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (dark) document.documentElement.classList.add('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <link rel="alternate" type="application/rss+xml" title="XR 博客 RSS" href="/blog/rss.xml" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="flex flex-col h-dvh bg-white text-gray-900 antialiased transition-colors duration-200 dark:bg-black dark:text-gray-100">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
