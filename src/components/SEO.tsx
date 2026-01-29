import { Helmet } from "react-helmet-async";

interface SEOProps {
    title?: string;
    description?: string;
    name?: string;
    type?: string;
    url?: string;
    image?: string;
}

export default function SEO({
    title,
    description,
    name = "WikiSnap",
    type = "website",
    url = "https://wikisnap.vercel.app", // Replace with actual domain if different
    image = "/logo/WikiSnap.svg",
}: SEOProps) {
    const siteTitle = title ? `${title} | ${name}` : name;
    const metaDescription = description || "Extract and format Wikipedia content effortlessly with WikiSnap.";

    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={metaDescription} />

            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />

            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={siteTitle} />
            <meta name="twitter:description" content={metaDescription} />
            {/* <meta name="twitter:image" content={image} /> */}
        </Helmet>
    );
}
