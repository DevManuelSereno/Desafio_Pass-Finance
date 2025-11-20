'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/theme-context';
import { LanguageProvider } from '@/contexts/language-context';
import { SidebarProvider, useSidebar } from '@/contexts/sidebar-context';
import { Sidebar } from './sidebar';
import { CommandPalette } from './command-palette';

function LayoutContent({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <CommandPalette />
      <main className={`w-full transition-all duration-300 ${isCollapsed ? 'ml-0 lg:ml-[60px]' : 'ml-0 lg:ml-[240px]'} pt-2 pb-2 pr-3`}>
        <div className="w-full h-[calc(100vh-1rem)] rounded-2xl overflow-hidden shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SidebarProvider>
          <LayoutContent>{children}</LayoutContent>
        </SidebarProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
