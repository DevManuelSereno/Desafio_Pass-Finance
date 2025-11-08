'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  LayoutDashboard,
  Activity,
  ArrowRightLeft,
  Package,
  BedDouble,
  Ticket,
  Plane,
  Sparkles,
  MapPin,
  Map,
  DollarSign,
  CalendarDays,
  Puzzle,
  Target,
  FileText,
  Settings,
  ChevronsUpDown,
  Check,
  Plus
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/language-context';
import { useSidebar } from '@/contexts/sidebar-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

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
      { labelKey: 'menu.hospedagem', iconName: 'BedDouble', href: '/' },
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
      { labelKey: 'menu.disponibilidade', iconName: 'CalendarDays', href: '/' },
      { labelKey: 'menu.financas', iconName: 'DollarSign', href: '/' },
    ]
  },
  {
    titleKey: 'menu.complementos',
    items: [
      { labelKey: 'menu.slots', iconName: 'Puzzle', href: '/' },
      { labelKey: 'menu.perimetros', iconName: 'MapPin', href: '/' },
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
    LayoutDashboard: <LayoutDashboard size={18} />,
    Activity: <Activity size={18} />,
    ArrowRightLeft: <ArrowRightLeft size={18} />,
    Package: <Package size={18} />,
    BedDouble: <BedDouble size={18} />,
    Ticket: <Ticket size={18} />,
    Plane: <Plane size={18} />,
    Sparkles: <Sparkles size={18} />,
    MapPin: <MapPin size={18} />,
    Map: <Map size={18}/>,
    DollarSign: <DollarSign size={18} />,
    CalendarDays: <CalendarDays size={18} />,
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
  const { isCollapsed } = useSidebar();
  const [selectedCompany, setSelectedCompany] = useState('Pass');

  const companies = [
    { name: 'Pass', icon: Building2 },
    { name: 'Allinsys', icon: Building2 },
    { name: 'Google', icon: Building2 },
  ];

  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen bg-background transition-all duration-300",
      isCollapsed ? "w-[60px]" : "w-60"
    )}>
      <div className="flex h-full flex-col mt-2">
        {/* Logo/Company Selector */}
        <div className={cn(
          "flex h-14 items-center border-b border-border mx-3",
          isCollapsed ? "justify-center" : "justify-start"
        )}>
          {isCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black dark:bg-blue-600">
                    <Building2 size={16} className="text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56 ml-2">
                <DropdownMenuLabel>Empresas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {companies.map((company) => (
                  <DropdownMenuItem
                    key={company.name}
                    onClick={() => setSelectedCompany(company.name)}
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted">
                      <company.icon size={14} />
                    </div>
                    <span className="flex-1">{company.name}</span>
                    {selectedCompany === company.name && <Check size={16} />}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2">
                  <Plus size={16} />
                  <span>Adicionar Organização</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-full justify-start gap-3 px-2 hover:bg-transparent">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black dark:bg-blue-600">
                    <Building2 size={16} className="text-white" />
                  </div>
                  <span className="flex-1 text-left text-sm font-semibold">{selectedCompany}</span>
                  <ChevronsUpDown size={16} className="text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56 ml-2">
                <DropdownMenuLabel>Empresas</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {companies.map((company) => (
                  <DropdownMenuItem
                    key={company.name}
                    onClick={() => setSelectedCompany(company.name)}
                    className="flex items-center gap-2"
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-muted">
                      <company.icon size={14} />
                    </div>
                    <span className="flex-1">{company.name}</span>
                    {selectedCompany === company.name && <Check size={16} />}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 opacity-60">
                  <Plus size={16} />
                  <span>Adicionar Organização</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {menuData.map((section) => (
            <div key={section.titleKey} className="mb-6">
              {!isCollapsed && (
                <h3 className="mb-2 px-3 text-xs font-medium text-muted-foreground">
                  {t(section.titleKey)}
                </h3>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href && item.labelKey === 'menu.financas';
                  return (
                    <Link
                      key={item.labelKey}
                      href={item.href}
                      title={isCollapsed ? t(item.labelKey) : undefined}
                      className={cn(
                        'flex items-center rounded-xl py-2 text-sm transition-colors',
                        isCollapsed ? 'justify-center px-2' : 'gap-3 px-3',
                        isActive
                          ? 'bg-secondary text-secondary-foreground'
                          : 'text-muted-foreground hover:bg-transparent hover:text-foreground'
                      )}
                    >
                      {getIcon(item.iconName)}
                      {!isCollapsed && <span>{t(item.labelKey)}</span>}
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
