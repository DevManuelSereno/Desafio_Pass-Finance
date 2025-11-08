'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/theme-context';
import { LanguageProvider } from '@/contexts/language-context';
import { Sidebar } from './sidebar';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="flex">
          <Sidebar />
          <main className="ml-[200px] w-full">
            {children}
          </main>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
