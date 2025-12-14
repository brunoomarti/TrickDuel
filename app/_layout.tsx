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
import { Slot, useRouter, usePathname, Href } from "expo-router";

import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/store";

import { ApolloProvider } from "@apollo/client/react";
import { apolloClient } from "@/lib/apolloClient";

import { Fab, FabIcon } from "@/components/ui/fab";
import { MoonIcon, SunIcon } from "@/components/ui/icon";
import { View, useColorScheme, StyleSheet } from "react-native";

import { ScreenTransition } from "@/components/ui/custom/screen-transition";
import type { ReactElement } from "react";
import * as Notifications from "expo-notifications";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

// Temas
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

export let startScreenTransition: (preview: ReactElement, route: Href) => void = () => { };

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function RootLayoutNav() {
  const router = useRouter();
  const pathname = usePathname();
  const systemScheme = useColorScheme();

  const [colorMode, setColorMode] = useState<"light" | "dark">(
    systemScheme === "dark" ? "dark" : "light"
  );

  useEffect(() => {
    if (systemScheme) setColorMode(systemScheme);
  }, [systemScheme]);

  useEffect(() => {
    async function requestNotificationPermission() {
      const { status } = await Notifications.getPermissionsAsync();

      if (status !== "granted") {
        await Notifications.requestPermissionsAsync();
      }
    }
    requestNotificationPermission();
  }, []);

  const theme = colorMode === "dark" ? DarkTheme : LightTheme;

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextScreenPreview, setNextScreenPreview] = useState<ReactElement | null>(null);
  const [nextRoute, setNextRoute] = useState<Href | null>(null);

  startScreenTransition = (preview: ReactElement, route: Href) => {
    setNextScreenPreview(preview);
    setNextRoute(route);
    setIsTransitioning(true);
  };

  return (
    <GluestackUIProvider mode={colorMode}>
      <ApolloProvider client={apolloClient}>
        <ReduxProvider store={store}>
          <ThemeProvider value={theme}>
            <View
              style={[
                styles.root,
                { backgroundColor: theme.colors.background }
              ]}
            >

              <Slot />

              {isTransitioning && (
                <ScreenTransition
                  duration={1400}
                  color1="#EFBA3C"
                  color2="#7C4BD8"
                  onFinish={() => {
                    if (nextRoute) router.push(nextRoute);
                    setIsTransitioning(false);
                    setNextScreenPreview(null);
                    setNextRoute(null);
                  }}
                >
                  {nextScreenPreview}
                </ScreenTransition>
              )}

              {/* Botão de tema somente no home */}
              {(pathname === "/" || pathname === "/home") && (
                <Fab
                  onPress={() =>
                    setColorMode((prev) => (prev === "dark" ? "light" : "dark"))
                  }
                  className="m-6"
                  size="lg"
                >
                  <FabIcon as={colorMode === "dark" ? MoonIcon : SunIcon} />
                </Fab>
              )}

            </View>
          </ThemeProvider>
        </ReduxProvider>
      </ApolloProvider>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
