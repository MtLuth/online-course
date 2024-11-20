"use client";

import { useMemo } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material/styles";

import { palette } from "./palette";
import { shadows } from "./shadows";
import { typography } from "./typography";
import { customShadows } from "./custom-shadows";
import { componentsOverrides } from "./overrides";
import { createPresets } from "./options/presets";
import NextAppDirEmotionCacheProvider from "./next-emotion-cache";

type Props = {
  children: React.ReactNode;
  themeMode?: "light" | "dark";
  themeDirection?: "ltr" | "rtl";
  themeColorPresets: string;
};

export default function ThemeProvider({
  children,
  themeMode = "light",
  themeDirection = "ltr",
  themeColorPresets,
}: Props) {
  const presets = createPresets(themeColorPresets);

  const memoizedValue = useMemo(
    () => ({
      palette: {
        ...palette(themeMode),
        ...presets.palette,
      },
      customShadows: {
        ...customShadows(themeMode),
        ...presets.customShadows,
      },
      direction: themeDirection,
      shadows: shadows(themeMode),
      shape: { borderRadius: 8 },
      typography,
      breakpoints: {
        values: {
          xs: 0,
          sm: 600,
          md: 960,
          lg: 1366,
          xl: 1600,
          xxl: 1920,
        },
      },
    }),
    [themeMode, themeDirection, presets.palette, presets.customShadows]
  );

  const baseTheme = useMemo(
    () => createTheme(memoizedValue as ThemeOptions),
    [memoizedValue]
  );

  const theme = useMemo(
    () =>
      createTheme(baseTheme, {
        components: componentsOverrides(baseTheme),
      }),
    [baseTheme]
  );

  return (
    <NextAppDirEmotionCacheProvider options={{ key: "css" }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
