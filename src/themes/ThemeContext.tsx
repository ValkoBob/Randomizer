import { createContext, useContext } from 'react';
import { THEMES, type Theme } from './themes';

export const ThemeContext = createContext<Theme>(THEMES[0]);

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
