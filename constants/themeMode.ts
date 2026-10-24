import { useState } from "react";
import { Appearance } from "react-native";
import Storage from "expo-sqlite/kv-store";

export type ThemeMode = "light" | "dark" | "system";
const KEY = "theme-mode";

const apply = (mode: ThemeMode) =>
  Appearance.setColorScheme(mode === "system" ? "unspecified" : mode);

const parse = (v: string | null): ThemeMode =>
  v === "light" || v === "dark" ? v : "system";

function read(): ThemeMode {
  try {
    return parse(Storage.getItemSync(KEY));
  } catch {
    return "system";
  }
}

// call once at startup
export async function loadThemeMode() {
  apply(read());
}

// for the settings screen
//For later use when the user will be able to choose its color theme
export function useThemeMode() {
  const [mode, setModeState] = useState<ThemeMode>(read);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    apply(m);
    try {
      Storage.setItemSync(KEY, m);
    } catch {}
  };

  return { mode, setMode };
}
