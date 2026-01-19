import path from "path";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    // Core React runtime
                    "vendor-react": ["react", "react-dom"],

                    // Document generation libraries (large)
                    "vendor-pdf": ["jspdf"],
                    "vendor-docx": ["docx", "file-saver"],

                    // Animation library
                    "vendor-motion": ["framer-motion"],

                    // Charts library
                    "vendor-charts": ["recharts"],

                    // Radix UI components (grouped together)
                    "vendor-radix": [
                        "@radix-ui/react-accordion",
                        "@radix-ui/react-alert-dialog",
                        "@radix-ui/react-dialog",
                        "@radix-ui/react-dropdown-menu",
                        "@radix-ui/react-popover",
                        "@radix-ui/react-select",
                        "@radix-ui/react-tabs",
                        "@radix-ui/react-tooltip",
                        "@radix-ui/react-scroll-area",
                        "@radix-ui/react-separator",
                        "@radix-ui/react-slot",
                        "@radix-ui/react-label",
                        "@radix-ui/react-progress",
                        "@radix-ui/react-switch",
                        "@radix-ui/react-checkbox",
                        "@radix-ui/react-radio-group",
                        "@radix-ui/react-toggle",
                        "@radix-ui/react-toggle-group",
                        "@radix-ui/react-slider",
                        "@radix-ui/react-aspect-ratio",
                        "@radix-ui/react-avatar",
                        "@radix-ui/react-collapsible",
                        "@radix-ui/react-context-menu",
                        "@radix-ui/react-hover-card",
                        "@radix-ui/react-menubar",
                        "@radix-ui/react-navigation-menu",
                    ],

                    // Utility libraries
                    "vendor-utils": ["clsx", "tailwind-merge", "class-variance-authority", "date-fns", "zod"],
                },
            },
        },
    },
});
