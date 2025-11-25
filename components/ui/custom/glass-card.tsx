import { ReactNode } from "react";
import { useColorScheme } from "react-native";
import { Box } from "@/components/ui/box";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className = "" }: GlassCardProps) {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const baseClasses = isDark
    ? "w-[85%] max-w-[380px] p-6 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20"
    : "w-[85%] max-w-[380px] p-6 rounded-3xl bg-white/95 border border-purple-100 shadow-xl";

  return (
    <Box className={`${baseClasses} ${className}`}>
      {children}
    </Box>
  );
}