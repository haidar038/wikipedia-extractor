export interface WikiData {
    title: string;
    content: string;
    references: string[];
}

export const extractWikipediaContent = async (wikiUrl: string): Promise<WikiData> => {
    try {
        const urlObj = new URL(wikiUrl);
        // Handle mobile URLs or other variations if needed
        const hostname = urlObj.hostname.replace("m.wikipedia", "wikipedia");

        const pathParts = urlObj.pathname.split("/");
        const title = pathParts[pathParts.length - 1];

        // Fetch Content
        const apiUrl = `https://${hostname}/w/api.php?action=parse&page=${title}&format=json&origin=*&prop=text|links&redirects=1`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.info || "Article not found");
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(data.parse.text["*"], "text/html");

        // Advanced Cleaning
        const unwantedSelectors = [".mw-editsection", ".reference", "sup.reference", ".reflist", ".navbox", ".vertical-navbox", ".sisipan", ".metadata", "style", "script", ".infobox", ".sidebar", ".hatnote", ".ambox"];

        unwantedSelectors.forEach((selector) => {
            doc.querySelectorAll(selector).forEach((el) => el.remove());
        });

        let content = "";
        const paragraphs = doc.querySelectorAll("p");
        // Only take paragraphs that have substantial text (avoiding empty placeholders)
        paragraphs.forEach((p) => {
            const text = p.textContent?.trim() || "";
            if (text.length > 30) {
                content += text + "\n\n";
            }
        });

        if (!content) {
            throw new Error("Could not extract meaningful content from this article.");
        }

        // Fetch References (External Links)
        const apiRefUrl = `https://${hostname}/w/api.php?action=parse&page=${title}&format=json&origin=*&prop=externallinks`;
        const refResponse = await fetch(apiRefUrl);
        const refData = await refResponse.json();

        let references: string[] = [];
        if (refData.parse && refData.parse.externallinks) {
            // Filter references to avoid internal wiki links or irrelevants if needed
            references = refData.parse.externallinks.filter((link: string) => link.startsWith("http"));
            // Remove duplicates
            references = [...new Set(references)];
        }

        return {
            title: data.parse.title,
            content: content.trim(),
            references: references.slice(0, 30), // Limit to top 30 references
        };
    } catch (err: any) {
        throw new Error(err.message || "Failed to extract content");
    }
};
