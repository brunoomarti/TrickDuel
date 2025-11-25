// app/_layout.tsx
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Slot, usePathname } from "expo-router";
import { Fab, FabIcon } from "@/components/ui/fab";
import { MoonIcon, SunIcon } from "@/components/ui/icon";
import { View, useColorScheme, StyleSheet } from "react-native";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

// ======================
// Cores base dos temas
// ======================
const LIGHT_BG_COLOR = "#f9f5ff";
const DARK_BG_COLOR = "#0f051a";

const LightTheme = {
  ...NavDefaultTheme,
  colors: {
    ...NavDefaultTheme.colors,
    background: LIGHT_BG_COLOR,
  },
};

const DarkTheme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    background: DARK_BG_COLOR,
  },
};

// ======================
// 1) Carrega fontes / splash
// ======================
export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

// ======================
// 2) Layout com tema customizado + auto dark/light
// ======================
function RootLayoutNav() {
  const pathname = usePathname();
  const systemScheme = useColorScheme(); // "light" | "dark" | null

  const [colorMode, setColorMode] = useState<"light" | "dark">(
    systemScheme === "dark" || systemScheme === "light"
      ? systemScheme
      : "light"
  );

  // Sempre que o sistema mudar de tema, sincroniza
  useEffect(() => {
    if (systemScheme === "dark" || systemScheme === "light") {
      setColorMode(systemScheme);
    }
  }, [systemScheme]);

  const theme = colorMode === "dark" ? DarkTheme : LightTheme;

  const handleToggleColorMode = () => {
    setColorMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <GluestackUIProvider mode={colorMode}>
      <ThemeProvider value={theme}>
        {/* View raiz estilizada via StyleSheet + cor do tema */}
        <View style={[styles.root, { backgroundColor: theme.colors.background }]}>
          <Slot />

          {(pathname === "/" || pathname === "/home") && (
            <Fab onPress={handleToggleColorMode} className="m-6" size="lg">
              <FabIcon as={colorMode === "dark" ? MoonIcon : SunIcon} />
            </Fab>
          )}
        </View>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
