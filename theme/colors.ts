// colors.ts
export const COLORS = {
    primaryColor: "#EFBA3C",
    secondaryColor: "#7C3AED",
    secondaryColorLight: "#A78BFA",

    light: {
        background: "#FAFAFA",
        backgroundHeader: "#FAFAFA",

        // Textos
        textPrimary: "#1F2933",
        textSecondary: "#6B7280",
        textMuted: "#9CA3AF",

        // Acentos
        accent: "#7C3AED",
        accentSoft: "#A78BFA",

        // Estrutura
        shadowColor: "#000",
        border: "#E5E5E5",

        // Cartões
        cardBackground: "#EDEDED",
        cardSurface: "#F5F5F5",

        // Quick Duel – fundo principal
        backgroundQuickDuel: "#EFBA3C",

        // Modal
        modalBackground: "#FFFFFF",
        modalButtonCancel: "#6B7280",
        modalButtonExit: "#DC2626",

        // Efeitos
        glow: "#ffff0066",
        lightningFill: "#7C4BD8",

        success: "#4CAF50",
        error: "#EF4444",
    },

    dark: {
        background: "#020015",
        backgroundHeader: "#020015",

        // Textos
        textPrimary: "#F9FAFF",
        textSecondary: "#D1D5E8",
        textMuted: "#9CA3AF",

        // Acentos
        accent: "#5c2faa",
        accentSoft: "#7C3AED",

        // Estrutura
        shadowColor: "#000",
        border: "#272742",

        // Cartões
        cardBackground: "#1A1A2E",
        cardSurface: "#151522",

        // Quick Duel – fundo principal (um dourado mais fechado)
        backgroundQuickDuel: "#020015",

        // Modal
        modalBackground: "#1C1C2A",
        modalButtonCancel: "#4B5563",
        modalButtonExit: "#B91C1C",

        // Efeitos
        glow: "#ffff44aa",
        lightningFill: "#9E7BEF",

        success: "#22c55e",
        error: "#f87171",
    },
} as const;
