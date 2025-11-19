'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  LayoutDashboard,
  Activity,
  BusFront,
  Package,
  BedDouble,
  Ticket,
  Plane,
  Sparkles,
  MapPin,
  Map,
  DollarSign,
  WalletMinimal,
  CalendarDays,
  Puzzle,
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
      { labelKey: 'menu.transfer', iconName: 'BusFront', href: '/' },
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
      { labelKey: 'menu.financas', iconName: 'WalletMinimal', href: '/' },
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
    BusFront: <BusFront size={18} />,
    Package: <Package size={18} />,
    BedDouble: <BedDouble size={18} />,
    Ticket: <Ticket size={18} />,
    Plane: <Plane size={18} />,
    Sparkles: <Sparkles size={18} />,
    MapPin: <MapPin size={18} />,
    Map: <Map size={18}/>,
    DollarSign: <DollarSign size={18} />,
    WalletMinimal: <WalletMinimal size={18} />,
    CalendarDays: <CalendarDays size={18} />,
    Puzzle: <Puzzle size={18} />,
    FileText: <FileText size={18} />,
    Settings: <Settings size={18} />,
  };
  return icons[iconName];
};

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [selectedCompany, setSelectedCompany] = useState('Pass');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const companies = [
    { name: 'Pass', icon: Building2 },
    { name: 'Allinsys', icon: Building2 },
    { name: 'Google', icon: Building2 },
  ];

  return (
    <>
      {/* Overlay para mobile */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={toggleSidebar} 
        />
      )}
      
      <aside className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-background transition-all duration-300",
        "lg:block",
        isCollapsed ? "w-[60px] -translate-x-full lg:translate-x-0" : "w-60"
      )}>
        <div className="flex h-full flex-col pt-2">
        {/* Logo/Company Selector */}
        <div className={cn(
          "flex h-16 items-center border-b border-border mx-3",
          isCollapsed ? "justify-center" : "justify-start"
        )}>
          {isCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 cursor-pointer">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-black dark:bg-blue-600">
                    <Building2 size={16} className="text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                side={isMobile ? "bottom" : "right"}
                align="start" 
                sideOffset={8}
                className="w-64 lg:w-56 ml-0 lg:ml-2 rounded-2xl lg:rounded-xl border-2 lg:border p-2 z-50"
              >
                <DropdownMenuLabel className="px-3 py-2.5 text-sm font-normal text-muted-foreground">Empresas</DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                {companies.map((company) => (
                  <DropdownMenuItem
                    key={company.name}
                    onClick={() => setSelectedCompany(company.name)}
                    className="flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-muted">
                      <company.icon size={16} />
                    </div>
                    <span className="flex-1 text-sm font-medium">{company.name}</span>
                    {selectedCompany === company.name && <Check size={18} className="text-foreground shrink-0" />}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-xl cursor-pointer text-muted-foreground transition-colors">
                  <Plus size={18} className="shrink-0" />
                  <span className="text-sm">Adicionar Organização</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-full justify-start gap-3 px-2 hover:bg-transparent cursor-pointer">
                  <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-black dark:bg-blue-600">
                    <Building2 size={16} className="text-white" />
                  </div>
                  <span className="flex-1 text-left text-sm font-semibold">{selectedCompany}</span>
                  <ChevronsUpDown size={16} className="text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                side={isMobile ? "bottom" : "right"}
                align="start" 
                sideOffset={8}
                className="w-64 lg:w-56 ml-0 lg:ml-2 rounded-2xl lg:rounded-xl border-2 lg:border p-2 z-50"
              >
                <DropdownMenuLabel className="px-3 py-2.5 text-sm font-normal text-muted-foreground">Empresas</DropdownMenuLabel>
                <DropdownMenuSeparator className="my-1" />
                {companies.map((company) => (
                  <DropdownMenuItem
                    key={company.name}
                    onClick={() => setSelectedCompany(company.name)}
                    className="flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-muted">
                      <company.icon size={16} />
                    </div>
                    <span className="flex-1 text-sm font-medium">{company.name}</span>
                    {selectedCompany === company.name && <Check size={18} className="text-foreground shrink-0" />}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 my-0.5 rounded-xl cursor-pointer text-muted-foreground transition-colors">
                  <Plus size={18} className="shrink-0" />
                  <span className="text-sm">Adicionar Organização</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-hide">
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
    </>
  );
}
