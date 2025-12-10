export function htmlToPlainText(html?: string | null): string {
    if (!html) return "";

    return (
        html
            .replace(/<br\s*\/?>/gi, "\n")
            .replace(/<\/p>/gi, "\n\n")
            .replace(/<[^>]+>/g, "")
            .replace(/\s+/g, " ")
            .trim()
    );
}
