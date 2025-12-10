import React from "react";
import { Text } from "@/components/ui/text";
import type { TextStyle } from "react-native";

export function parseRichText(html?: string | null): React.ReactNode {
    if (!html) return null;

    let normalized = html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n\n")
        .replace(/&nbsp;/gi, " ");

    normalized = normalized.replace(/[\n\s]+$/g, "");

    normalized = normalized.replace(
        /(\S)(<strong>|<b>)/gi,
        "$1 $2"
    );

    const parts = normalized.split(/(<strong>|<\/strong>|<b>|<\/b>)/gi);
    let isBold = false;

    return (
        <Text className="text-center leading-snug">
            {parts.map((part, index) => {
                const tag = part.toLowerCase();

                if (tag === "<strong>" || tag === "<b>") {
                    isBold = true;
                    return null;
                }
                if (tag === "</strong>" || tag === "</b>") {
                    isBold = false;
                    return null;
                }

                const clean = part.replace(/<[^>]+>/g, "");

                const boldStyle: TextStyle | undefined = isBold
                    ? {
                        fontWeight: "900",
                        opacity: 0.85,
                    }
                    : undefined;

                return (
                    <Text
                        key={index}
                        className="text-2xl"
                        style={boldStyle}
                    >
                        {clean}
                    </Text>
                );
            })}
        </Text>
    );
}
