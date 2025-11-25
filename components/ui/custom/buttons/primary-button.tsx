// @/components/ui/custom/buttons/primary-button.tsx
import React from "react";
import {
    StyleSheet,
    ActivityIndicator,
    StyleProp,
    ViewStyle,
} from "react-native";
import { Button, ButtonText } from "@/components/ui/button";

type PrimaryButtonProps = {
    onPress?: () => void | Promise<void>;
    loading?: boolean;
    label?: string;
    children?: React.ReactNode;
    className?: string;
    textClassName?: string;
    isDisabled?: boolean;
    style?: StyleProp<ViewStyle>;
} & React.ComponentProps<typeof Button>;

export function PrimaryButton({
    onPress,
    loading = false,
    label,
    children,
    className = "",
    textClassName = "",
    isDisabled,
    style,
    ...rest
}: PrimaryButtonProps) {
    const isButtonDisabled = !!loading || !!isDisabled;

    return (
        <Button
            onPress={isButtonDisabled ? undefined : onPress}
            className={`bg-purple-900 rounded-2xl ${className}`}
            style={[
                styles.primaryButton,
                loading && styles.primaryButtonLoading,
                style,
            ]}
            isDisabled={isButtonDisabled}
            {...rest}
        >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : children ? (
                children
            ) : (
                <ButtonText
                    className={`text-white font-bold text-lg ${textClassName}`}
                >
                    {label}
                </ButtonText>
            )}
        </Button>
    );
}

const styles = StyleSheet.create({
    primaryButton: {
        minHeight: 48,
    },
    primaryButtonLoading: {
        opacity: 0.7,
    },
});
