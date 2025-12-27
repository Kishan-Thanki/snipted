"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="flex flex-col items-center justify-center pt-32 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl"
        >
          <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
            Your code vault, <br />
            <span className="text-blue-600">refined.</span>
          </h1>
          <p className="text-zinc-500 text-lg mb-10">
            A minimalist sanctuary for developers to store and organize snippets.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="px-8 py-4 bg-foreground text-background rounded-2xl font-bold shadow-lg">
              Get Started
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}