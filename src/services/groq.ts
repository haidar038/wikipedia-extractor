export const summarizeWithGroq = async (content: string, title: string, selectedLength: string) => {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
        throw new Error("API Key is missing. Please check your .env file.");
    }

    const lengthInstructions: Record<string, string> = {
        short: "summarize this into a very concise paragraph (approx. 3-5 sentences).",
        medium: "summarize this into a detailed paragraph (approx. 150-250 words).",
        long: "summarize this into a comprehensive paragraph (approx. 300-500 words) covering key details.",
    };

    const instruction = lengthInstructions[selectedLength] || lengthInstructions.medium;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `You are an expert summarizer. Your task is to extract the key information from the user-provided Wikipedia article text and write a single, flowing, well-structured paragraph in the SAME LANGUAGE as the article. 
                        
                        Rules:
                        1. NO citation numbers (e.g., [1], [2]).
                        2. NO inline citations.
                        3. Start directly with the summary, do not say "Here is a summary".
                        4. Keep it factual and neutral.
                        5. ${instruction}`,
                    },
                    {
                        role: "user",
                        content: `Title: ${title}\n\nContent:\n${content.substring(0, 15000)}`,
                        // Truncate to avoid context limit if article is massive, though Llama 3 70b has large context (8k/128k depending on var, safe to limit for speed/cost)
                    },
                ],
                temperature: 0.5,
                max_tokens: selectedLength === "short" ? 300 : selectedLength === "medium" ? 600 : 1000,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Groq API request failed");
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (err: any) {
        throw new Error("AI Summarization failed: " + err.message);
    }
};
