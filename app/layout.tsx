import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import Link from "next/link";

export const metadata = {
  title: { default: "NovaShop", template: "%s · NovaShop" },
  description: "Modern full-stack ecommerce experience built with Next.js, Prisma and TypeScript"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <footer className="footer">
          <div className="container footerInner">
            <Link href="/" className="logo">Nova<span>Shop</span></Link>
            <p>Personal project · Full-stack ecommerce demo</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
