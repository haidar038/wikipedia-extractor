import { Link, Zap, AlignLeft, FileText, List } from "lucide-react";
import { motion } from "framer-motion";

interface InputSectionProps {
    url: string;
    setUrl: (url: string) => void;
    length: string;
    setLength: (length: string) => void;
    onSummarize: () => void;
    loading: boolean;
}

const lengthOptions = [
    { key: "short", label: "Short", icon: AlignLeft },
    { key: "medium", label: "Medium", icon: FileText },
    { key: "long", label: "Long", icon: List },
];

export function InputSection({ url, setUrl, length, setLength, onSummarize, loading }: InputSectionProps) {
    return (
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-3xl flex flex-col items-center text-center space-y-8 mb-12">
            {/* Heading */}
            <div className="space-y-4">
                <h1 className="text-foreground text-4xl sm:text-5xl font-black leading-tight tracking-tight">
                    Wiki<span className="text-[#13a4ec]">Snap</span>
                </h1>
                <p className="text-muted-foreground text-md sm:text-lg font-normal max-w-xl mx-auto">Paste a Wikipedia link below to get an instant, concise summary powered by AI.</p>
            </div>

            {/* Input Group */}
            <div className="w-full max-w-2xl bg-card p-2 rounded-lg shadow-lg border border-border flex flex-col sm:flex-row gap-2">
                <div className="relative grow">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Link className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://en.wikipedia.org/wiki/Artificial_intelligence"
                        className="block w-full pl-12 pr-4 py-4 text-base text-foreground bg-transparent border-none rounded-lg focus:ring-2 focus:ring-[#13a4ec]/20 focus:outline-none placeholder:text-muted-foreground/60 font-normal h-12"
                        onKeyDown={(e) => e.key === "Enter" && onSummarize()}
                    />
                </div>
                <button
                    onClick={onSummarize}
                    disabled={loading || !url}
                    className="btn-primary h-12 px-6 rounded-lg shadow-md flex items-center justify-center gap-2 sm:w-auto w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Zap size={20} />}
                    <span>{loading ? "Processing..." : "Summarize"}</span>
                </button>
            </div>

            {/* Configuration Chips */}
            <div className="flex flex-wrap justify-center gap-3">
                {lengthOptions.map(({ key, label, icon: Icon }) => (
                    <button key={key} onClick={() => setLength(key)} className={`chip ${length === key ? "active" : ""}`}>
                        <Icon size={18} />
                        <span>{label}</span>
                    </button>
                ))}
            </div>
        </motion.section>
    );
}
