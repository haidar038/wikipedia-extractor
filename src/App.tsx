import { useState } from "react";
import { Layout } from "./components/Layout";
import { InputSection } from "./components/wiki-extractor/InputSection";
import { SummaryDisplay } from "./components/wiki-extractor/SummaryDisplay";
import { ReferenceList } from "./components/wiki-extractor/ReferenceList";
import { extractWikipediaContent } from "./services/wikipedia";
import { summarizeWithGroq } from "./services/groq";
import { jsPDF } from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

interface ResultData {
    title: string;
    url: string;
    summary: string;
    references: string[];
    wordCount: number;
}

function App() {
    const [url, setUrl] = useState("");
    const [length, setLength] = useState("medium");
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ResultData | null>(null);
    const [error, setError] = useState("");

    const handleSummarize = async () => {
        setError("");
        setLoading(true);
        setResult(null);

        try {
            if (!url.includes("wikipedia.org")) {
                throw new Error("Please enter a valid Wikipedia URL.");
            }

            // Step 1: Extract Content
            const extracted = await extractWikipediaContent(url);

            // Step 2: Summarize
            const summaryText = await summarizeWithGroq(extracted.content, extracted.title, length);

            // Count words
            const wordCount = summaryText.split(/\s+/).filter(Boolean).length;

            setResult({
                title: extracted.title,
                url: url,
                summary: summaryText,
                references: extracted.references,
                wordCount,
            });
        } catch (err: any) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        if (!result) return;
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text(result.title, 20, 20);

        doc.setFontSize(12);
        const splitSummary = doc.splitTextToSize(result.summary, 170);
        doc.text(splitSummary, 20, 35);

        let yPos = 35 + splitSummary.length * 7 + 10;

        doc.setFontSize(14);
        doc.text("References", 20, yPos);
        yPos += 10;

        doc.setFontSize(10);
        doc.setTextColor(100);
        result.references.slice(0, 20).forEach((ref, i) => {
            if (yPos > 280) {
                doc.addPage();
                yPos = 20;
            }
            const refText = `${i + 1}. ${ref}`;
            doc.text(refText, 20, yPos);
            yPos += 7;
        });

        doc.save(`${result.title.replace(/\s+/g, "_")}.pdf`);
    };

    const downloadDOCX = async () => {
        if (!result) return;

        const doc = new Document({
            sections: [
                {
                    properties: {},
                    children: [
                        new Paragraph({
                            text: result.title,
                            heading: HeadingLevel.TITLE,
                        }),
                        new Paragraph({ text: "" }), // Spacer
                        new Paragraph({
                            children: [new TextRun(result.summary)],
                        }),
                        new Paragraph({ text: "" }), // Spacer
                        new Paragraph({
                            text: "References",
                            heading: HeadingLevel.HEADING_2,
                        }),
                        ...result.references.map(
                            (ref) =>
                                new Paragraph({
                                    text: ref,
                                    bullet: { level: 0 },
                                }),
                        ),
                    ],
                },
            ],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `${result.title.replace(/\s+/g, "_")}.docx`);
    };

    return (
        <Layout>
            <InputSection url={url} setUrl={setUrl} length={length} setLength={setLength} onSummarize={handleSummarize} loading={loading} />

            {error && <div className="w-full max-w-3xl p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl text-center mb-8">{error}</div>}

            {result && (
                <div className="w-full max-w-3xl">
                    <SummaryDisplay title={result.title} url={result.url} summary={result.summary} wordCount={result.wordCount} onDownloadPDF={downloadPDF} onDownloadDOCX={downloadDOCX} />
                    <ReferenceList references={result.references} />
                </div>
            )}
        </Layout>
    );
}

export default App;
