import React from "react";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface LayoutProps {
    children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <header className="w-full border-b border-border bg-card sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-[#13a4ec] flex items-center justify-center">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        <h2 className="text-foreground text-lg font-bold tracking-tight">WikiSummarizer AI</h2>
                    </motion.div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">{children}</main>

            <footer className="py-8 text-center text-muted-foreground text-sm">
                <p>© {new Date().getFullYear()} WikiSummarizer AI. Designed for knowledge.</p>
            </footer>
        </div>
    );
}
