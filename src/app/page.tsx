'use client';

import { useState, Fragment, useEffect } from 'react';
import { mockBills } from '@/data/mock-bills';
import { Bill } from '@/types/bill';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, LayoutPanelLeft, ListFilter, Settings, MoreVertical, Moon, Sun, Globe, LogOut, ChevronDown, PanelLeft, CircleUser, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronUp, Info, Store, ChartNoAxesColumn, Edit, Trash2, RefreshCw, Download, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useTheme } from '@/contexts/theme-context';
import { useSidebar } from '@/contexts/sidebar-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function Home() {
  const [bills] = useState<Bill[]>(mockBills);
  const [searchTerm, setSearchTerm] = useState('');
  const [tableSearchTerm, setTableSearchTerm] = useState('');
  const [filterSearchTerm, setFilterSearchTerm] = useState('');
  const [subFilterSearchTerm, setSubFilterSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [activeFilterCategory, setActiveFilterCategory] = useState<string | null>(null);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedSubFilters, setSelectedSubFilters] = useState<Record<string, string[]>>({
    payment: [],
    status: [],
    classification: []
  });
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme, mounted } = useTheme();
  const { toggleSidebar } = useSidebar();

  // Filtrar contas com base na busca e filtros
  const filteredBills = bills.filter(bill => {
    // Filtro de busca por ID ou Participante
    if (tableSearchTerm) {
      const searchLower = tableSearchTerm.toLowerCase();
      const idMatch = bill.id.padStart(6, '0').includes(searchLower);
      const participantMatch = bill.participants.name.toLowerCase().includes(searchLower) ||
                              (bill.participants.secondary?.toLowerCase().includes(searchLower) || false);
      if (!idMatch && !participantMatch) return false;
    }
    
    // Filtro de Quitação
    if (selectedSubFilters.payment && selectedSubFilters.payment.length > 0) {
      const payment = bill.paymentInfo || 'Indefinido';
      if (!selectedSubFilters.payment.includes(payment)) return false;
    }
    
    // Filtro de Status
    if (selectedSubFilters.status && selectedSubFilters.status.length > 0) {
      if (!selectedSubFilters.status.includes(bill.status)) return false;
    }
    
    // Filtro de Classificação
    if (selectedSubFilters.classification && selectedSubFilters.classification.length > 0) {
      if (!selectedSubFilters.classification.includes(bill.classification.description)) return false;
    }
    
    return true;
  });

  // Detectar tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 500);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const total = filteredBills.reduce((sum, bill) => sum + bill.amount, 0);
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  
  // Calcular os itens da página atual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBills = filteredBills.slice(startIndex, endIndex);
  
  const toggleSubFilter = (category: string, value: string) => {
    setSelectedSubFilters(prev => {
      const current = prev[category] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };
  
  // Contar quantas contas têm cada tipo de status/classificação/quitação
  const paymentCounts = bills.reduce((acc, bill) => {
    const payment = bill.paymentInfo || 'Indefinido';
    acc[payment] = (acc[payment] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const statusCounts = bills.reduce((acc, bill) => {
    acc[bill.status] = (acc[bill.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const classificationCounts = bills.reduce((acc, bill) => {
    const classification = bill.classification.description;
    acc[classification] = (acc[classification] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Filtros principais
  const filterOptions = [
    { id: 'payment', label: 'Quitação' },
    { id: 'status', label: 'Status' },
    { id: 'classification', label: 'Classificação' },
  ].filter(option => 
    option.label.toLowerCase().includes(filterSearchTerm.toLowerCase())
  );
  
  // Sub-opções de filtros
  const getSubFilterOptions = (category: string) => {
    let options: { value: string; count: number }[] = [];
    
    if (category === 'payment') {
      options = Object.entries(paymentCounts).map(([key, count]) => ({
        value: key,
        count
      }));
    } else if (category === 'status') {
      options = Object.entries(statusCounts).map(([key, count]) => ({
        value: key,
        count
      }));
    } else if (category === 'classification') {
      options = Object.entries(classificationCounts).map(([key, count]) => ({
        value: key,
        count
      }));
    }
    
    return options.filter(option =>
      option.value.toLowerCase().includes(subFilterSearchTerm.toLowerCase())
    );
  };
  
  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };
  
  const handleSelectAll = () => {
    if (selectedItems.length === paginatedBills.length) {
      // Desmarcar todos da página atual
      setSelectedItems(prev => prev.filter(id => !paginatedBills.find(bill => bill.id === id)));
    } else {
      // Marcar todos da página atual
      setSelectedItems(prev => [...new Set([...prev, ...paginatedBills.map(bill => bill.id)])]);
    }
  };
  
  const getLanguageLabel = (lang: string) => {
    switch(lang) {
      case 'pt': return 'Português';
      case 'en': return 'English';
      case 'es': return 'Español';
      default: return 'Português';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-3 sm:px-4 md:px-6 py-3 dark:border-zinc-800 dark:bg-[#0a0a0a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-xl"
              onClick={toggleSidebar}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
            <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" />
            <h1 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Finanças</h1>
          </div>
          
          <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder={t('bills.search')}
                className="h-9 w-64 pl-9 pr-16 text-sm rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <kbd className="pointer-events-none absolute right-3 top-2 inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-200 bg-zinc-100 px-1.5 font-mono text-[10px] font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                CTRL+K
              </kbd>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Button (Mobile) */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-xl lg:hidden bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl"
              onClick={() => toggleTheme()}
              suppressHydrationWarning
            >
              {!mounted ? (
                <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : theme === 'light' ? (
                <Sun className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Moon className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </Button>

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 gap-1 px-2 sm:gap-2 sm:px-3 rounded-xl">
                  <Globe className="h-5 w-5 sm:h-4 sm:w-4" />
                  <span className="text-xs hidden md:inline">{getLanguageLabel(language)}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl">
                <DropdownMenuItem onClick={() => setLanguage('pt')}>
                  Português
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('en')}>
                  English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage('es')}>
                  Español
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 gap-2 px-1 sm:px-2 rounded-xl">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-black text-xs font-semibold text-white dark:bg-blue-600">
                      MS
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-black text-xs font-semibold text-white dark:bg-blue-600">
                        MS
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Manuel Sereno</span>
                      <span className="text-xs text-muted-foreground">nelfsereno@gmail.com</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <CircleUser className="mr-2 h-4 w-4" />
                  Contas
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {mobileSearchOpen && (
          <div className="px-3 py-3 border-t border-zinc-200 dark:border-zinc-800 lg:hidden">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder={t('bills.search')}
                className="h-9 w-full pl-9 text-sm rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}
      </header>

      {/* Table */}
      <div className="flex-1 overflow-auto px-3 sm:px-4 md:px-6 py-3 md:py-4 scrollbar-hide">
        <div className="overflow-hidden rounded-xl md:rounded-2xl border border-zinc-200 dark:border-zinc-800">
          {/* Toolbar */}
          <div className="border-b border-zinc-200 bg-white px-3 sm:px-4 md:px-6 py-3 dark:border-zinc-800 dark:bg-[#161616]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hidden md:flex">
                  <LayoutPanelLeft size={16}/>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                      <ListFilter size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="start" 
                    className="w-56 rounded-xl p-2"
                  >
                    <div className="px-2 pb-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-zinc-400" />
                        <Input
                          type="text"
                          placeholder="Filtrar modo..."
                          className="h-8 pl-7 pr-2 text-xs rounded-lg"
                          value={filterSearchTerm}
                          onChange={(e) => setFilterSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="max-h-64 overflow-y-auto">
                      {filterOptions.map((option) => (
                        <DropdownMenu key={option.id}>
                          <DropdownMenuTrigger asChild>
                            <div
                              className="flex items-center justify-between py-2 px-2 cursor-pointer rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm"
                              onMouseEnter={() => {
                                setActiveFilterCategory(option.id);
                                setSubFilterSearchTerm('');
                              }}
                            >
                              <span>{option.label}</span>
                              <ChevronDown className="h-4 w-4 -rotate-90" />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent 
                            side={isSmallScreen ? "bottom" : "right"}
                            align={isSmallScreen ? "start" : "start"}
                            sideOffset={isSmallScreen ? 8 : 5}
                            alignOffset={isSmallScreen ? 0 : -10}
                            className="w-64 rounded-xl p-2"
                            data-submenu
                            collisionPadding={10}
                            avoidCollisions={true}
                          >
                            <div className="px-2 pb-2">
                              <div className="relative">
                                <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-zinc-400" />
                                <Input
                                  type="text"
                                  placeholder="Buscar..."
                                  className="h-8 pl-7 pr-2 text-xs rounded-lg"
                                  value={subFilterSearchTerm}
                                  onChange={(e) => setSubFilterSearchTerm(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                            <DropdownMenuSeparator />
                            <div className="max-h-64 overflow-y-auto">
                              {getSubFilterOptions(option.id).map((subOption) => (
                                <div
                                  key={subOption.value}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSubFilter(option.id, subOption.value);
                                  }}
                                  className="flex items-center justify-between py-2 px-2 cursor-pointer rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                >
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={selectedSubFilters[option.id]?.includes(subOption.value) || false}
                                      onChange={() => {}}
                                      className="h-4 w-4 rounded-[5px] cursor-pointer bg-white dark:bg-black border border-zinc-400/30 dark:border-zinc-500/30 checked:bg-black dark:checked:bg-white checked:border-black dark:checked:border-white appearance-none checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgNEw0LjUgNy41TDExIDEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] dark:checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgNEw0LjUgNy5MTEgMSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48L3N2Zz4=')] bg-center bg-no-repeat flex-shrink-0"
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                    <span className="text-sm truncate">{subOption.value}</span>
                                  </div>
                                  <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2 flex-shrink-0">{subOption.count}</span>
                                </div>
                              ))}
                              {getSubFilterOptions(option.id).length === 0 && (
                                <div className="py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                                  Nenhuma opção encontrada
                                </div>
                              )}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ))}
                      {filterOptions.length === 0 && (
                        <div className="py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                          Nenhum filtro encontrado
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                  <Settings size={16} />
                </Button>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden lg:inline">29/02/2012 - 17/07/2039</span>
                <div className="relative hidden lg:flex items-center flex-1 max-w-xs">
                  <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por ID ou Participante..."
                    className="h-8 pl-8 pr-3 text-xs rounded-lg border-zinc-200 dark:border-zinc-700"
                    value={tableSearchTerm}
                    onChange={(e) => setTableSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-2 rounded-lg">
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="text-xs">Atualizar</span>
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-2 rounded-lg">
                  <Download className="h-3.5 w-3.5" />
                  <span className="text-xs">Export</span>
                </Button>
                <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" />
                <Button size="sm" className="h-8 gap-2 rounded-lg bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                  <Plus className="h-3.5 w-3.5" />
                  <span className="text-xs">Adicionar</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto scrollbar-hide">
          <Table>
          <TableHeader>
            <TableRow className="border-b border-zinc-200 bg-white hover:bg-white dark:border-zinc-800 dark:bg-[#161616]">
              <TableHead className="h-10 w-12">
                <input 
                  type="checkbox" 
                  className="h-4 w-4 rounded-[6px] cursor-pointer bg-white dark:bg-black border border-zinc-400/30 dark:border-zinc-500/30 checked:bg-black dark:checked:bg-white checked:border-black dark:checked:border-white appearance-none checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgNEw0LjUgNy41TDExIDEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] dark:checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgNEw0LjUgNy41TDExIDEiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] bg-center bg-no-repeat"
                  checked={paginatedBills.length > 0 && paginatedBills.every(bill => selectedItems.includes(bill.id))}
                  onChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="h-10 text-xs font-medium text-zinc-600 dark:text-zinc-400 min-w-[100px]">{t('bills.id')}</TableHead>
              <TableHead className="h-10 text-xs font-medium text-zinc-600 dark:text-zinc-400 min-w-[100px]">{t('bills.competence')}</TableHead>
              <TableHead className="h-10 text-xs font-medium text-zinc-600 dark:text-zinc-400 min-w-[100px]">{t('bills.due')}</TableHead>
              <TableHead className="h-10 text-xs font-medium text-zinc-600 dark:text-zinc-400 min-w-[100px]">{t('bills.payment')}</TableHead>
              <TableHead className="h-10 text-xs font-medium text-zinc-600 dark:text-zinc-400 min-w-20">{t('bills.status')}</TableHead>
              <TableHead className="h-10 text-xs font-medium text-zinc-600 dark:text-zinc-400 min-w-[150px]">{t('bills.classification')}</TableHead>
              <TableHead className="h-10 text-xs font-medium text-zinc-600 dark:text-zinc-400 min-w-[150px]">{t('bills.participants')}</TableHead>
              <TableHead className="h-10 text-xs font-medium text-zinc-600 dark:text-zinc-400 min-w-20">{t('bills.installment')}</TableHead>
              <TableHead className="h-10 text-right text-xs font-medium text-zinc-600 dark:text-zinc-400 min-w-[100px]">{t('bills.total')}</TableHead>
              <TableHead className="h-10 w-12 min-w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedBills.map((bill) => (
              <Fragment key={bill.id}>
                <TableRow 
                  key={bill.id} 
                  className="border-b border-zinc-100 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-[#161616] dark:hover:bg-[#1a1a1a] cursor-pointer"
                  onClick={() => setExpandedRow(expandedRow === bill.id ? null : bill.id)}
                >
                  <TableCell className="py-3" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="h-4 w-4 rounded-[6px] cursor-pointer bg-white dark:bg-black border border-zinc-400/30 dark:border-zinc-500/30 checked:bg-black dark:checked:bg-white checked:border-black dark:checked:border-white appearance-none checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgNEw0LjUgNy41TDExIDEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] dark:checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgNEw0LjUgNy41TDExIDEiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] bg-center bg-no-repeat"
                      checked={selectedItems.includes(bill.id)}
                      onChange={() => handleSelectItem(bill.id)}
                    />
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      {bill.id.padStart(6, '0')}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-zinc-900 dark:text-zinc-100">{bill.competenceDate}</TableCell>
                  <TableCell className="py-3 text-xs text-zinc-900 dark:text-zinc-100">{bill.dueDate}</TableCell>
                  <TableCell className="py-3 text-xs text-zinc-600 dark:text-zinc-400">{bill.paymentInfo}</TableCell>
                  <TableCell className="py-3">
                    <Badge
                      variant="secondary"
                    >
                      {t('bills.pending')}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="space-y-0.5">
                      {bill.classification.code && (
                        <div className="text-xs text-zinc-900 dark:text-zinc-100">{bill.classification.code}</div>
                      )}
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">{bill.classification.description}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <div className="space-y-0.5">
                      <div className="text-xs text-zinc-900 dark:text-zinc-100">{bill.participants.name}</div>
                      {bill.participants.secondary && (
                        <div className="text-xs text-zinc-600 dark:text-zinc-400">{bill.participants.secondary}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-3 text-xs text-zinc-900 dark:text-zinc-100">{bill.installment}</TableCell>
                  <TableCell className="py-3 text-right text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(bill.amount)}
                  </TableCell>
                  <TableCell className="py-3" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical size={16} className="text-zinc-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar pagamento
                        </DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir pagamento
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
                
                {/* Expanded Details Row */}
                {expandedRow === bill.id && bill.details && (
                  <TableRow key={`${bill.id}-details`} className="border-b border-zinc-100 bg-[#FAFAFA] dark:border-zinc-800 dark:bg-[#171717]">
                    <TableCell colSpan={11} className="p-3 sm:p-4 md:p-6">
                      <div className="space-y-0">
                        {/* Header */}
                        <div className="flex items-center justify-between pb-4 md:pb-6">
                          <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                            Conta a Pagar - {bill.id.split('\n')[0]}
                          </h3>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 sm:h-8 sm:w-8"
                            onClick={() => setExpandedRow(null)}
                          >
                            <ChevronUp className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>
                        </div>

                        {/* Dados Gerais */}
                        <div className="space-y-3 md:space-y-4 border-t border-zinc-200 dark:border-zinc-700 py-4 md:py-6">
                          <div className="flex items-center gap-2">
                              <Info size={14} className="sm:w-4 sm:h-4" />
                            <h4 className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100">Dados Gerais</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 md:gap-x-8 gap-y-3 md:gap-y-4">
                            <div>
                              <label className="text-xs text-zinc-600 dark:text-zinc-400">Conta</label>
                              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{bill.code.split('\n')[0]}</p>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-600 dark:text-zinc-400">Lançamento</label>
                              <p className="text-sm text-zinc-900 dark:text-zinc-100">{bill.details.launchDate}</p>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-600 dark:text-zinc-400">Quitação</label>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">{bill.details.paymentDate}</p>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-600 dark:text-zinc-400 pr-3">Status</label>
                              <Badge 
                                variant="secondary"
                              >
                                {bill.status}
                              </Badge>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-600 dark:text-zinc-400">Documento/Contrato</label>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">{bill.details.document}</p>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-600 dark:text-zinc-400">Fatura</label>
                              <p className="text-sm text-zinc-600 dark:text-zinc-400">{bill.details.invoice}</p>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-600 dark:text-zinc-400">Conta/Grupo</label>
                              <p className="text-sm text-zinc-900 dark:text-zinc-100">{bill.details.accountGroup}</p>
                            </div>
                            <div className="col-span-2">
                              <label className="text-xs text-zinc-600 dark:text-zinc-400">Referência</label>
                              <p className="text-sm text-zinc-900 dark:text-zinc-100">{bill.details.reference}</p>
                            </div>
                          </div>
                        </div>

                        {/* Participantes */}
                        <div className="space-y-3 md:space-y-4 border-t border-zinc-200 dark:border-zinc-700 py-4 md:py-6">
                          <div className="flex items-center gap-2">
                              <Store size={14} className="sm:w-4 sm:h-4"  />
                            <h4 className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100">Participantes</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 md:gap-x-8 gap-y-3 md:gap-y-4">
                            <div>
                              <label className="text-xs text-zinc-600 dark:text-zinc-400">Credor ({bill.details.creditor?.id})</label>
                              <p className="text-sm text-zinc-900 dark:text-zinc-100">{bill.details.creditor?.name}</p>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-600 dark:text-zinc-400">Devedor ({bill.details.debtor?.id})</label>
                              <p className="text-sm text-zinc-900 dark:text-zinc-100">{bill.details.debtor?.name}</p>
                            </div>
                          </div>
                        </div>

                        {/* Contábil */}
                        <div className="space-y-3 md:space-y-4 border-t border-zinc-200 dark:border-zinc-700 py-4 md:py-6">
                          <div className="flex items-center gap-2">
                              <ChartNoAxesColumn size={14} className="sm:w-4 sm:h-4"/>
                            <h4 className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100">Contábil</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 md:gap-x-8 gap-y-3 md:gap-y-4">
                            <div>
                              <label className="text-xs text-zinc-600 dark:text-zinc-400">Classificação Gerencial ({bill.details.accountingClassification?.id})</label>
                              <p className="text-sm text-zinc-900 dark:text-zinc-100">{bill.details.accountingClassification?.description}</p>
                            </div>
                            <div>
                              <label className="text-xs text-zinc-600 dark:text-zinc-400">Centro de Custo ({bill.details.costCenter?.id})</label>
                              <p className="text-sm text-zinc-900 dark:text-zinc-100">{bill.details.costCenter?.name}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
        </div>
        
          {/* Total above footer */}
          <div className="border-t border-zinc-200 bg-white px-3 sm:px-4 md:px-6 py-2 dark:border-zinc-800 dark:bg-[#161616]">
            <div className="flex justify-end">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">{t('bills.total')}</span>
                <span className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        
          {/* Footer */}
          <div className="border-t border-zinc-200 bg-white px-3 sm:px-4 md:px-6 py-3 dark:border-zinc-800 dark:bg-[#161616]">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Left: Selected items */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
                <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                  {selectedItems.length} de {bills.length} linha(s) selecionadas.
                </span>
              </div>
              
              {/* Center: Items per page */}
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9 gap-1 rounded-lg border-zinc-300 dark:border-zinc-600">
                      <span className="text-sm">{itemsPerPage} / página</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="rounded-xl">
                    {[5, 10, 15, 20].map((num) => (
                      <DropdownMenuItem key={num} onClick={() => {
                        setItemsPerPage(num);
                        setCurrentPage(1); // Reset para primeira página ao mudar itens por página
                      }}>
                        {num}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Right: Pagination + Total */}
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                  Página {currentPage} de {totalPages}
                </span>
                
                <div className="flex items-center gap-1.5">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 rounded-lg border-zinc-300 dark:border-zinc-600 hidden sm:flex"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 rounded-lg border-zinc-300 dark:border-zinc-600"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 rounded-lg border-zinc-300 dark:border-zinc-600"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 rounded-lg border-zinc-300 dark:border-zinc-600 hidden sm:flex"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
