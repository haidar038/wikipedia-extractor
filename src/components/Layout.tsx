import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { Button } from "./ui/button";

import { faGithub } from "@fortawesome/free-brands-svg-icons";

interface LayoutProps {
    children: React.ReactNode;
}

import SEO from "./SEO";

export function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <SEO />
            <header className="w-full border-b border-border bg-card sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2.5">
                        <img src="/logo/WikiSnap.svg" alt="WikiSnap" className="w-9 h-auto" />
                        <h2 className="text-foreground text-lg font-bold tracking-tight">
                            Wiki<span className="text-[#13a4ec]">Snap</span>
                        </h2>
                    </motion.div>
                    <a href="https://github.com/haidar038/wikipedia-extractor" target="_blank">
                        <Button variant={"secondary"} size={"icon"} className="hover:bg-[#13a4ec] hover:text-white cursor-pointer">
                            <FontAwesomeIcon icon={faGithub} size="xl" />
                        </Button>
                    </a>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">{children}</main>

            <footer className="py-8 text-center text-muted-foreground text-sm">
                <p>© {new Date().getFullYear()} WikiSnap. Designed for knowledge.</p>
            </footer>
        </div>
    );
}
