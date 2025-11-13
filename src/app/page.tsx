'use client';

import { useState, Fragment, useEffect } from 'react';
import { mockBills } from '@/data/mock-bills';
import { Bill } from '@/types/bill';
import { AccountPayableModal } from '@/components/account-payable-modal';
import { AddPaymentModal } from '@/components/add-payment-modal';
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
import { Search, LayoutPanelLeft, ListFilter, Settings, MoreVertical, Moon, Sun, Globe, LogOut, ChevronDown, PanelLeft, CircleUser, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit, Trash2, RefreshCw, Download, Plus, Bot, BarChart3 } from 'lucide-react';
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
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAITooltip, setShowAITooltip] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
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
              className="h-9 w-9 rounded-xl cursor-pointer"
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
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl cursor-pointer"
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
                <Button variant="ghost" className="h-9 gap-1 px-2 sm:gap-2 sm:px-3 rounded-xl cursor-pointer">
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
                <Button variant="ghost" className="h-9 gap-2 px-1 sm:px-2 rounded-xl cursor-pointer">
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
                <DropdownMenuItem className="cursor-pointer">
                  <CircleUser className="mr-2 h-4 w-4" />
                  Contas
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 cursor-pointer">
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
                {/* AI Assistant Button */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg cursor-pointer bg-black dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[length:250%_250%,100%_100%] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] before:duration-1000 hover:before:bg-[position:-100%_0,0_0] dark:before:bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.2)_50%,transparent_75%,transparent_100%)]"
                    onMouseEnter={() => setShowAITooltip(true)}
                    onMouseLeave={() => setShowAITooltip(false)}
                  >
                    <Bot size={16} className="text-white dark:text-black relative z-10" />
                  </Button>
                  {showAITooltip && (
                    <div
                      className="absolute top-full left-0 mt-2 w-72 p-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                      onMouseEnter={() => setShowAITooltip(true)}
                      onMouseLeave={() => setShowAITooltip(false)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-white dark:bg-black rounded-lg flex items-center justify-center">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-black dark:text-white"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm mb-1">@passAI</div>
                          <p className="text-xs text-zinc-300 dark:text-zinc-600 leading-relaxed mb-2">
                            Use the AI assistant to generate reports directly from your dashboard.
                          </p>
                          <div className="text-[10px] text-zinc-400 dark:text-zinc-500">
                            Powered by PASS — © 2025
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" />
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hidden md:flex cursor-pointer">
                  <LayoutPanelLeft size={16}/>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg cursor-pointer">
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
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg cursor-pointer">
                  <Settings size={16} />
                </Button>
                <div className="relative hidden lg:flex items-center flex-1 max-w-xs">
                  <Search className="absolute left-2.5 h-3.5 w-3.5 text-zinc-400" />
                  <Input
                    type="text"
                    placeholder="Buscar"
                    className="h-8 pl-8 pr-3 text-xs rounded-lg border-zinc-200 dark:border-zinc-700"
                    value={tableSearchTerm}
                    onChange={(e) => setTableSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-2 rounded-lg cursor-pointer">
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span className="text-xs">Atualizar</span>
                </Button>
                <Button variant="outline" size="sm" className="h-8 gap-2 rounded-lg cursor-pointer">
                  <Download className="h-3.5 w-3.5" />
                  <span className="text-xs">Export</span>
                </Button>
                <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700" />
                <Button 
                  size="sm" 
                  className="h-8 gap-2 rounded-lg bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 cursor-pointer"
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                  <span className="text-xs">Análise</span>
                </Button>
                <Button 
                  size="sm" 
                  className="h-8 gap-2 rounded-lg bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 cursor-pointer"
                  onClick={() => setShowPaymentModal(true)}
                >
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
                  onClick={() => {
                    setSelectedBill(bill);
                    setShowAccountModal(true);
                  }}
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
                    <Button variant="outline" size="sm" className="h-9 gap-1 rounded-lg border-zinc-300 dark:border-zinc-600 cursor-pointer">
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
                    className="h-9 w-9 rounded-lg border-zinc-300 dark:border-zinc-600 hidden sm:flex cursor-pointer"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 rounded-lg border-zinc-300 dark:border-zinc-600 cursor-pointer"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 rounded-lg border-zinc-300 dark:border-zinc-600 cursor-pointer"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 rounded-lg border-zinc-300 dark:border-zinc-600 hidden sm:flex cursor-pointer"
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

      {/* Modals */}
      <AccountPayableModal
        bill={selectedBill}
        open={showAccountModal}
        onOpenChange={setShowAccountModal}
        onAddPayment={() => {
          setShowAccountModal(false);
          setShowPaymentModal(true);
        }}
      />
      <AddPaymentModal
        open={showPaymentModal}
        onOpenChange={setShowPaymentModal}
      />
    </div>
  );
}
