'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  BusFront,
  Package,
  BedDouble,
  Ticket,
  Plane,
  Sparkles,
  Map,
  DollarSign,
  WalletMinimal,
  CalendarDays,
  Puzzle,
  MapPin,
  FileText,
  Settings,
  Search,
  X,
} from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { cn } from '@/lib/utils';

interface MenuItem {
  labelKey: string;
  iconName: string;
  href: string;
  section: string;
}

const menuItems: MenuItem[] = [
  { labelKey: 'menu.painel', iconName: 'LayoutDashboard', href: '/', section: 'menu.principal' },
  { labelKey: 'menu.atividade', iconName: 'Activity', href: '/', section: 'menu.principal' },
  { labelKey: 'menu.transfer', iconName: 'BusFront', href: '/', section: 'menu.servicos' },
  { labelKey: 'menu.combo', iconName: 'Package', href: '/', section: 'menu.servicos' },
  { labelKey: 'menu.hospedagem', iconName: 'BedDouble', href: '/', section: 'menu.servicos' },
  { labelKey: 'menu.ingresso', iconName: 'Ticket', href: '/', section: 'menu.servicos' },
  { labelKey: 'menu.passeio', iconName: 'Plane', href: '/', section: 'menu.servicos' },
  { labelKey: 'menu.experiencia', iconName: 'Sparkles', href: '/', section: 'menu.servicos' },
  { labelKey: 'menu.circuito', iconName: 'Map', href: '/', section: 'menu.servicos' },
  { labelKey: 'menu.tarifario', iconName: 'DollarSign', href: '/', section: 'menu.comercial' },
  { labelKey: 'menu.disponibilidade', iconName: 'CalendarDays', href: '/', section: 'menu.comercial' },
  { labelKey: 'menu.financas', iconName: 'WalletMinimal', href: '/', section: 'menu.comercial' },
  { labelKey: 'menu.slots', iconName: 'Puzzle', href: '/', section: 'menu.complementos' },
  { labelKey: 'menu.perimetros', iconName: 'MapPin', href: '/', section: 'menu.complementos' },
  { labelKey: 'menu.diretrizes', iconName: 'FileText', href: '/', section: 'menu.complementos' },
  { labelKey: 'menu.configuracoes', iconName: 'Settings', href: '/', section: 'menu.organizacao' },
];

const getIcon = (iconName: string, size = 18) => {
  const icons: Record<string, React.ReactNode> = {
    LayoutDashboard: <LayoutDashboard size={size} />,
    Activity: <Activity size={size} />,
    BusFront: <BusFront size={size} />,
    Package: <Package size={size} />,
    BedDouble: <BedDouble size={size} />,
    Ticket: <Ticket size={size} />,
    Plane: <Plane size={size} />,
    Sparkles: <Sparkles size={size} />,
    Map: <Map size={size} />,
    DollarSign: <DollarSign size={size} />,
    WalletMinimal: <WalletMinimal size={size} />,
    CalendarDays: <CalendarDays size={size} />,
    Puzzle: <Puzzle size={size} />,
    MapPin: <MapPin size={size} />,
    FileText: <FileText size={size} />,
    Settings: <Settings size={size} />,
  };
  return icons[iconName];
};

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { t } = useLanguage();
  const router = useRouter();

  const filteredItems = menuItems.filter((item) =>
    t(item.labelKey).toLowerCase().includes(search.toLowerCase())
  );

  // Agrupa itens por seção
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearch('');
        setSelectedIndex(0);
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearch('');
        setSelectedIndex(0);
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      }

      if (e.key === 'Enter' && filteredItems[selectedIndex]) {
        e.preventDefault();
        router.push(filteredItems[selectedIndex].href);
        setIsOpen(false);
        setSearch('');
        setSelectedIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, router]);

  // Reset selected index quando a busca muda
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!isOpen) return null;

  let currentIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 pt-[15vh]">
      <div className="w-full max-w-[640px] overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
        {/* Header com Input de Busca */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <Search size={18} className="text-muted-foreground cursor-pointer" />
          <input
            type="text"
            placeholder="Digite um comando ou pesquise..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            autoFocus
          />
          <button
            onClick={() => setIsOpen(false)}
            className="text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Lista de Comandos */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              Nenhum resultado encontrado
            </div>
          ) : (
            Object.entries(groupedItems).map(([section, items], index) => (
              <div key={section}>
                {index > 0 && <div className="border-t border-border my-2" />}
                <div className="mb-4">
                  <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                    {t(section)}
                  </div>
                  <div className="space-y-0.5">
                    {items.map((item) => {
                      const itemIndex = currentIndex++;
                      const isSelected = itemIndex === selectedIndex;
                      
                      return (
                        <button
                          key={item.labelKey}
                          onClick={() => {
                            router.push(item.href);
                            setIsOpen(false);
                            setSearch('');
                            setSelectedIndex(0);
                          }}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors cursor-pointer',
                            isSelected
                              ? 'bg-secondary text-secondary-foreground'
                              : 'text-foreground hover:bg-secondary/50'
                          )}
                        >
                          <div className="text-muted-foreground">
                            {getIcon(item.iconName)}
                          </div>
                          <span>{t(item.labelKey)}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
