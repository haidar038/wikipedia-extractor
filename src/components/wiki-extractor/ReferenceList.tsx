import { useState } from "react";
import { Quote, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

interface ReferenceListProps {
    references: string[];
}

export function ReferenceList({ references }: ReferenceListProps) {
    const [isCopied, setIsCopied] = useState(false);

    if (references.length === 0) return null;

    const handleCopyReferences = () => {
        const text = references.map((ref, i) => `${i + 1}. ${ref}`).join("\n");
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mt-8 px-4">
            <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold text-foreground uppercase tracking-wider opacity-60">Source References</h4>
                <button onClick={handleCopyReferences} className="action-btn text-xs" title="Copy all references">
                    {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    <span>{isCopied ? "Copied!" : "Copy"}</span>
                </button>
            </div>
            <ul className="space-y-3">
                {references.slice(0, 10).map((ref, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm group">
                        <Quote size={18} className="text-muted-foreground mt-0.5 shrink-0 group-hover:text-[#13a4ec] transition-colors" />
                        <a href={ref} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#13a4ec] transition-colors underline decoration-dotted underline-offset-4 break-all">
                            {ref}
                        </a>
                    </li>
                ))}
            </ul>
            {references.length > 10 && <p className="text-xs text-muted-foreground mt-4">+ {references.length - 10} more references</p>}
        </motion.div>
    );
}
