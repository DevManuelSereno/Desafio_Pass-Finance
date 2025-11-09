'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/contexts/theme-context';
import { LanguageProvider } from '@/contexts/language-context';
import { SidebarProvider, useSidebar } from '@/contexts/sidebar-context';
import { Sidebar } from './sidebar';

function LayoutContent({ children }: { children: ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div className="flex">
      <Sidebar />
      <main className={`w-full transition-all duration-300 ${isCollapsed ? 'ml-0 lg:ml-[60px]' : 'ml-0 lg:ml-[240px]'}`}>
        {children}
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
