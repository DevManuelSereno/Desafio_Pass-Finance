'use client';

import { useState } from 'react';
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
import { Search, Grid3x3, SlidersHorizontal, Settings2, MoreVertical, Moon, Sun, Globe, LogOut, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import { useTheme } from '@/contexts/theme-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function BillsToPayPage() {
  const [bills] = useState<Bill[]>(mockBills);
  const [searchTerm, setSearchTerm] = useState('');
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const total = bills.reduce((sum, bill) => sum + bill.amount, 0);
  
  const getLanguageLabel = (lang: string) => {
    switch(lang) {
      case 'pt': return 'Portugu\u00eas';
      case 'en': return 'English';
      case 'es': return 'Espa\u00f1ol';
      default: return 'Portugu\u00eas';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="flex h-screen flex-col bg-zinc-50 dark:bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-[#161616]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{t('bills.title')}</h1>
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{t('bills.breadcrumb')}</span>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
              <Input
                type="text"
                placeholder={t('bills.search')}
                className="h-9 w-64 pl-9 pr-16 text-sm rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <kbd className="pointer-events-none absolute right-2 top-2 inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-200 bg-zinc-100 px-1.5 font-mono text-[10px] font-medium text-zinc-600 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                CTRL+K
              </kbd>
            </div>
          </div>
          <div className="flex items-center gap-2 cursor-pointer">
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-xl"
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Language Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-9 gap-2 rounded-xl">
                  <Globe className="h-4 w-4" />
                  <span className="text-xs">{getLanguageLabel(language)}</span>
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
                <Button variant="ghost" className="h-9 gap-2 px-2 rounded-xl">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-blue-600 text-xs font-semibold text-white">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">Jonathan Doe</span>
                    <span className="text-xs text-muted-foreground">johndoe@example.com</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings2 className="mr-2 h-4 w-4" />
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
      </header>

      {/* Toolbar */}
      <div className="border-b border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-[#161616]">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl border border-zinc-200 px-2 py-1 dark:border-zinc-700">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">{t('bills.status')}</span>
              <Badge variant="secondary" className="rounded-full bg-zinc-200 px-2 py-0 text-xs dark:bg-zinc-700">
                lf1805(6)
              </Badge>
              <button className="text-zinc-400">×</button>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">29/02/2012 - 17/07/2039</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <Grid3x3 size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <SlidersHorizontal size={16} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <Settings2 size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto px-6 py-4">
        <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-700">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-zinc-200 bg-white hover:bg-white dark:border-zinc-800 dark:bg-[#161616]">
              <TableHead className="h-10 w-12">
                <input type="checkbox" className="h-4 w-4" />
              </TableHead>
              <TableHead className="h-10 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t('bills.code')}</TableHead>
              <TableHead className="h-10 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t('bills.competence')}</TableHead>
              <TableHead className="h-10 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t('bills.due')}</TableHead>
              <TableHead className="h-10 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t('bills.payment')}</TableHead>
              <TableHead className="h-10 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t('bills.status')}</TableHead>
              <TableHead className="h-10 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t('bills.classification')}</TableHead>
              <TableHead className="h-10 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t('bills.participants')}</TableHead>
              <TableHead className="h-10 text-xs font-medium text-zinc-600 dark:text-zinc-400">{t('bills.installment')}</TableHead>
              <TableHead className="h-10 text-right text-xs font-medium text-zinc-600 dark:text-zinc-400">{t('bills.total')}</TableHead>
              <TableHead className="h-10 w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bills.map((bill) => (
              <TableRow key={bill.id} className="border-b border-zinc-100 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-[#161616] dark:hover:bg-[#1a1a1a]">
                <TableCell className="py-3">
                  <input type="checkbox" className="h-4 w-4" />
                </TableCell>
                <TableCell className="py-3">
                  <div className="whitespace-pre-line text-xs text-zinc-600 dark:text-zinc-400">
                    {bill.code}
                  </div>
                </TableCell>
                <TableCell className="py-3 text-xs text-zinc-900 dark:text-zinc-100">{bill.competenceDate}</TableCell>
                <TableCell className="py-3 text-xs text-zinc-900 dark:text-zinc-100">{bill.dueDate}</TableCell>
                <TableCell className="py-3 text-xs text-zinc-600 dark:text-zinc-400">{bill.paymentInfo}</TableCell>
                <TableCell className="py-3">
                  <Badge 
                    variant="secondary" 
                    className="rounded-full bg-amber-100 px-3 py-1 text-xs font-normal text-amber-900 hover:bg-amber-100"
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
                <TableCell className="py-3">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical size={16} className="text-zinc-400" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-[#161616]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{bills.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{t('bills.total')}</span>
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
