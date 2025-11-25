import { Text } from "@/components/ui/text";
import { Box } from "@/components/ui/box";
import { useColorScheme } from "react-native";

export function GameLogo() {
    const scheme = useColorScheme();
    const isDark = scheme === "dark";

    const mainClasses = isDark
        ? "text-4xl font-extrabold text-white tracking-wide"
        : "text-4xl font-extrabold text-purple-900 tracking-wide";

    const accentClasses = isDark ? "text-purple-400" : "text-purple-600";

    return (
        <Box className="items-center">
            <Text className={mainClasses}>
                Trick
                <Text className={accentClasses}>Duel</Text>
            </Text>
        </Box>
    );
}