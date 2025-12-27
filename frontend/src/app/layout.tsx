import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import { Header } from "@/components/layout/header";

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
          {/* Header/Navbar will go here in the next step */}
          <Header />

          <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row gap-6 px-4 pt-20">
            {/* Left Sidebar: Navigation & Tags */}
            <aside className="hidden md:block w-64 sticky top-20 h-fit">
              <div className="community-card space-y-4">
                <nav className="flex flex-col gap-2 font-medium">
                  <a href="/" className="hover:bg-gray-100 dark:hover:bg-zinc-800 p-2 rounded">Home</a>
                  <a href="/popular" className="hover:bg-gray-100 dark:hover:bg-zinc-800 p-2 rounded">Popular</a>
                </nav>
              </div>
            </aside>

            {/* Main Content: The Feed */}
            <main className="flex-1 min-w-0">
              {children}
            </main>

            {/* Right Sidebar: Community Stats & Auth CTA */}
            <aside className="hidden lg:block w-80 sticky top-20 h-fit">
              <div className="community-card">
                <h2 className="font-bold text-sm uppercase text-gray-500 mb-2">About Community</h2>
                <p className="text-sm mb-4">Welcome to Snipted! Share your code and build your reputation stars.</p>
                {/* We will add the Reputation display here later */}
              </div>
            </aside>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}