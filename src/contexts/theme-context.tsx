'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (event?: React.MouseEvent) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // Load theme from localStorage and set mounted state
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    // Batch state updates together
    if (savedTheme && savedTheme !== theme) {
      setTheme(savedTheme);
    }
    
    // Apply initial theme class
    document.documentElement.classList.toggle('dark', (savedTheme || theme) === 'dark');
    
    setMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  useEffect(() => {
    // Apply theme class to document when theme changes after mount
    if (mounted) {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme, mounted]);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';

    // Check if View Transitions API is supported
    if (!document.startViewTransition) {
      // Fallback for browsers that don't support View Transitions
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      return;
    }

    // Start from top-left corner (company selector button position)
    const x = 40; // Approximate position of company button
    const y = 28; // Approximate vertical center of header

    // Calculate the radius (distance to farthest corner - bottom right)
    const endRadius = Math.hypot(
      window.innerWidth,
      window.innerHeight
    );

    // Create the circular reveal transition
    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
    });

    // Wait for the transition to be ready
    await transition.ready;

    // Animate the circular reveal
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 700,
        easing: 'ease-in-out',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
