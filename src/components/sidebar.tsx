'use client';

import Link from 'next/link';
import { 
  Building2,
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
  Puzzle,
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

interface MenuData {
  titleKey: string;
  items: Array<{
    labelKey: string;
    iconName: string;
    href: string;
  }>;
}

const menuData: MenuData[] = [
  {
    titleKey: 'menu.principal',
    items: [
      { labelKey: 'menu.painel', iconName: 'LayoutDashboard', href: '/' },
      { labelKey: 'menu.atividade', iconName: 'Activity', href: '/' },
    ]
  },
  {
    titleKey: 'menu.servicos',
    items: [
      { labelKey: 'menu.transfer', iconName: 'ArrowRightLeft', href: '/' },
      { labelKey: 'menu.combo', iconName: 'Package', href: '/' },
      { labelKey: 'menu.hospedagem', iconName: 'Hotel', href: '/' },
      { labelKey: 'menu.ingresso', iconName: 'Ticket', href: '/' },
      { labelKey: 'menu.passeio', iconName: 'Plane', href: '/' },
      { labelKey: 'menu.experiencia', iconName: 'Sparkles', href: '/' },
      { labelKey: 'menu.circuito', iconName: 'Map', href: '/' },
    ]
  },
  {
    titleKey: 'menu.comercial',
    items: [
      { labelKey: 'menu.tarifario', iconName: 'DollarSign', href: '/' },
      { labelKey: 'menu.disponibilidade', iconName: 'Calendar', href: '/' },
      { labelKey: 'menu.financas', iconName: 'DollarSign', href: '/' },
    ]
  },
  {
    titleKey: 'menu.complementos',
    items: [
      { labelKey: 'menu.slots', iconName: 'Puzzle', href: '/' },
      { labelKey: 'menu.perimetros', iconName: 'Target', href: '/' },
      { labelKey: 'menu.diretrizes', iconName: 'FileText', href: '/' },
    ]
  },
  {
    titleKey: 'menu.organizacao',
    items: [
      { labelKey: 'menu.configuracoes', iconName: 'Settings', href: '/' },
    ]
  }
];

const getIcon = (iconName: string) => {
  const icons: Record<string, React.ReactNode> = {
    Building2: <Building2 size={2}/>,
    LayoutDashboard: <LayoutDashboard size={18} />,
    Activity: <Activity size={18} />,
    ArrowRightLeft: <ArrowRightLeft size={18} />,
    Package: <Package size={18} />,
    Hotel: <Hotel size={18} />,
    Ticket: <Ticket size={18} />,
    Plane: <Plane size={18} />,
    Sparkles: <Sparkles size={18} />,
    Map: <Map size={18} />,
    DollarSign: <DollarSign size={18} />,
    Calendar: <Calendar size={18} />,
    Puzzle: <Puzzle size={18} />,
    Target: <Target size={18} />,
    FileText: <FileText size={18} />,
    Settings: <Settings size={18} />,
  };
  return icons[iconName];
};

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[200px] border-r border-border bg-background">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-black dark:bg-blue-600">
              <Building2 size={16} className="text-white" />
            </div>
            <span className="text-sm font-semibold">Pass</span>
          </Link>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {menuData.map((section) => (
            <div key={section.titleKey} className="mb-6">
              <h3 className="mb-2 px-3 text-xs font-medium text-muted-foreground">
                {t(section.titleKey)}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href && item.labelKey === 'menu.financas';
                  return (
                    <Link
                      key={item.labelKey}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors',
                        isActive
                          ? 'bg-secondary text-secondary-foreground'
                          : 'text-muted-foreground hover:bg-transparent hover:text-foreground'
                      )}
                    >
                      {getIcon(item.iconName)}
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
