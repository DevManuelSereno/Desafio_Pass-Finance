'use client';

import Link from 'next/link';
import { 
  LayoutDashboard, 
  Activity, 
  ArrowRightLeft, 
  Package, 
  Hotel, 
  Ticket, 
  Plane, 
  Sparkles, 
  Map, 
  DollarSign,
  Calendar,
  Clock,
  Target,
  FileText,
  Settings
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';

interface MenuItem {
  labelKey: string;
  icon: React.ReactNode;
  href: string;
}

interface MenuSection {
  titleKey: string;
  items: MenuItem[];
}

const getMenuSections = (): MenuSection[] => [
  {
    titleKey: 'menu.principal',
    items: [
      { labelKey: 'menu.painel', icon: <LayoutDashboard size={18} />, href: '/' },
      { labelKey: 'menu.atividade', icon: <Activity size={18} />, href: '/activity' },
    ]
  },
  {
    titleKey: 'menu.servicos',
    items: [
      { labelKey: 'menu.transfer', icon: <ArrowRightLeft size={18} />, href: '/transfer' },
      { labelKey: 'menu.combo', icon: <Package size={18} />, href: '/combo' },
      { labelKey: 'menu.hospedagem', icon: <Hotel size={18} />, href: '/accommodation' },
      { labelKey: 'menu.ingresso', icon: <Ticket size={18} />, href: '/ticket' },
      { labelKey: 'menu.passeio', icon: <Plane size={18} />, href: '/tour' },
      { labelKey: 'menu.experiencia', icon: <Sparkles size={18} />, href: '/experience' },
      { labelKey: 'menu.circuito', icon: <Map size={18} />, href: '/circuit' },
    ]
  },
  {
    titleKey: 'menu.comercial',
    items: [
      { labelKey: 'menu.tarifario', icon: <DollarSign size={18} />, href: '/pricing' },
      { labelKey: 'menu.disponibilidade', icon: <Calendar size={18} />, href: '/availability' },
      { labelKey: 'menu.financas', icon: <DollarSign size={18} />, href: '/finance/bills-to-pay' },
    ]
  },
  {
    titleKey: 'menu.complementos',
    items: [
      { labelKey: 'menu.slots', icon: <Clock size={18} />, href: '/slots' },
      { labelKey: 'menu.perimetros', icon: <Target size={18} />, href: '/perimeters' },
      { labelKey: 'menu.diretrizes', icon: <FileText size={18} />, href: '/guidelines' },
    ]
  },
  {
    titleKey: 'menu.organizacao',
    items: [
      { labelKey: 'menu.configuracoes', icon: <Settings size={18} />, href: '/settings' },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const menuSections = getMenuSections();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[200px] border-r border-border bg-background">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-600">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="text-sm font-semibold">Pass</span>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {menuSections.map((section) => (
            <div key={section.titleKey} className="mb-6">
              <h3 className="mb-2 px-3 text-xs font-medium text-muted-foreground">
                {t(section.titleKey)}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-secondary text-secondary-foreground'
                          : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                      )}
                    >
                      {item.icon}
                      <span>{t(item.labelKey)}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
