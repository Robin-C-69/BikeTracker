import { useMemo } from "react";
import { StyleSheet, useColorScheme } from "react-native";
import { getTheme, Theme } from "@/constants/theme";

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return getTheme(scheme === "light" ? "light" : "dark");
}

export function makeStyles<
  T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>,
>(factory: (theme: Theme) => T) {
  return function useStyles() {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(factory(theme)), [theme]);
  };
}
