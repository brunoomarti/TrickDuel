import { useColorScheme } from "react-native";
import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
} from "@/components/ui/form-control";
import { Input, InputField } from "@/components/ui/input";

type GameInputProps = {
    label: string;
    placeholder?: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    autoCapitalize?: "none" | "sentences" | "words" | "characters"; // 👈 novo
};

export function GameInput({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    autoCapitalize, // 👈 recebe caso a caso
}: GameInputProps) {
    const scheme = useColorScheme();
    const isDark = scheme === "dark";

    const labelClasses = isDark
        ? "text-purple-200 text-sm font-semibold tracking-wide"
        : "text-purple-700 text-sm font-semibold tracking-wide";

    const inputClasses = isDark
        ? "h-14 border-2 border-purple-500/70 bg-black/30 rounded-2xl px-3"
        : "h-14 border-2 border-purple-400/70 bg-white rounded-2xl px-3";

    const inputTextClasses = isDark
        ? "text-white text-lg"
        : "text-purple-950 text-lg";

    const placeholderColor = isDark ? "#C2C2C2" : "#9CA3AF";

    return (
        <FormControl className="w-full space-y-2">
            <FormControlLabel>
                <FormControlLabelText className={labelClasses}>
                    {label.toUpperCase()}
                </FormControlLabelText>
            </FormControlLabel>

            <Input className={inputClasses}>
                <InputField
                    placeholder={placeholder}
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={secureTextEntry}
                    placeholderTextColor={placeholderColor}
                    className={inputTextClasses}
                    autoCapitalize={autoCapitalize}
                    autoCorrect={false}
                />
            </Input>
        </FormControl>
    );
}
