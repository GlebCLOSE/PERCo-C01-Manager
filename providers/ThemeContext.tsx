import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createDarkPalette,
  createLightPalette,
  type AppPalette,
  type SchemeName,
} from '../constants/theme';

const STORAGE_KEY = '@c01_theme_scheme';

interface ThemeContextValue {
  palette: AppPalette;
  scheme: SchemeName;
  setScheme: (s: SchemeName) => void;
  toggleScheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [scheme, setSchemeState] = useState<SchemeName>('light');

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (cancelled) return;
        if (stored === 'light' || stored === 'dark') {
          setSchemeState(stored);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const setScheme = useCallback((s: SchemeName) => {
    setSchemeState(s);
    AsyncStorage.setItem(STORAGE_KEY, s).catch(() => {});
  }, []);

  const toggleScheme = useCallback(() => {
    setScheme(scheme === 'light' ? 'dark' : 'light');
  }, [scheme, setScheme]);

  const palette = useMemo(
    () => (scheme === 'dark' ? createDarkPalette() : createLightPalette()),
    [scheme],
  );

  const value = useMemo(
    () => ({ palette, scheme, setScheme, toggleScheme }),
    [palette, scheme, setScheme, toggleScheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}
