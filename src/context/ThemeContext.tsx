import { Theme } from '@/types/theme';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

type ThemeContextProviderProps = {
  children: ReactNode;
};

export default function ThemeContextProvider({
  children,
}: ThemeContextProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme') as Theme | null;
    if (!localTheme) return;
    setTheme(localTheme);

    if (localTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.remove('grainy');
      document.body.classList.add('bg-black');
      return;
    }

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      document.body.classList.remove('grainy');
      document.body.classList.add('bg-black');
      return;
    }
  }, []);

  function toggleTheme() {
    if (theme === 'light') {
      setTheme('dark');
      window.localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
      document.body.classList.remove('grainy');
      document.body.classList.add('bg-black');
      return;
    }
    setTheme('light');
    window.localStorage.setItem('theme', 'light');
    document.documentElement.classList.remove('dark');
    document.body.classList.add('grainy');
    document.body.classList.remove('bg-black');
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeContextProvider');
  }

  return context;
}
