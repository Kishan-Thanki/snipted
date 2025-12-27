import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Header } from "@/components/layout/header";
import Link from "next/link";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Snipted | Community Code Snippets",
  description: "Share and discover high-quality code snippets.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <Header />
          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row gap-6 px-4 pt-20">
            
            {/* Left Sidebar */}
            <aside className="hidden md:block w-64 sticky top-20 h-fit">
              <div className="community-card space-y-4">
                <nav className="flex flex-col gap-2 font-medium">
                  <Link href="/" className="hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2 rounded transition-colors">
                    Home
                  </Link>
                  <Link href="/popular" className="hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2 rounded transition-colors">
                    Popular
                  </Link>
                  <hr className="border-zinc-100 dark:border-zinc-800 my-2" />
                  <Link href="/create" className="bg-[var(--color-primary)] text-white text-center p-2 rounded-full text-sm font-bold hover:brightness-110 transition-all shadow-sm">
                    + Create Snippet
                  </Link>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {children}
            </main>

            {/* Right Sidebar */}
            <aside className="hidden lg:block w-80 sticky top-20 h-fit">
              <div className="community-card">
                <h2 className="font-bold text-sm uppercase text-gray-500 mb-2 tracking-wide">About Community</h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  Welcome to Snipted! A place to share elegant solutions, discover helper functions, and build your developer reputation.
                </p>
              </div>
            </aside>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}