'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'pt' | 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  pt: {
    // Menu
    'menu.principal': 'Principal',
    'menu.painel': 'Painel',
    'menu.atividade': 'Atividade',
    'menu.servicos': 'Serviços',
    'menu.transfer': 'Transfer',
    'menu.combo': 'Combo',
    'menu.hospedagem': 'Hospedagem',
    'menu.ingresso': 'Ingresso',
    'menu.passeio': 'Passeio',
    'menu.experiencia': 'Experiência',
    'menu.circuito': 'Circuito',
    'menu.comercial': 'Comercial',
    'menu.tarifario': 'Tarifário',
    'menu.disponibilidade': 'Disponibilidade',
    'menu.financas': 'Finanças',
    'menu.complementos': 'Complementos',
    'menu.slots': 'Slots',
    'menu.perimetros': 'Perímetros',
    'menu.diretrizes': 'Diretrizes',
    'menu.organizacao': 'Organização',
    'menu.configuracoes': 'Configurações',
    
    // Bills to Pay
    'bills.title': 'Contas - A Pagar',
    'bills.breadcrumb': 'Financeiro > Contas',
    'bills.search': 'Buscar',
    'bills.status': 'Status',
    'bills.id': 'ID',
    'bills.competence': 'Competência',
    'bills.due': 'Vencimento',
    'bills.payment': 'Quitação',
    'bills.classification': 'Classificação',
    'bills.participants': 'Participantes',
    'bills.installment': 'Parcela',
    'bills.total': 'Total',
    'bills.pending': 'Pendente',
  },
  en: {
    // Menu
    'menu.principal': 'Main',
    'menu.painel': 'Dashboard',
    'menu.atividade': 'Activity',
    'menu.servicos': 'Services',
    'menu.transfer': 'Transfer',
    'menu.combo': 'Combo',
    'menu.hospedagem': 'Accommodation',
    'menu.ingresso': 'Ticket',
    'menu.passeio': 'Tour',
    'menu.experiencia': 'Experience',
    'menu.circuito': 'Circuit',
    'menu.comercial': 'Commercial',
    'menu.tarifario': 'Pricing',
    'menu.disponibilidade': 'Availability',
    'menu.financas': 'Finance',
    'menu.complementos': 'Add-ons',
    'menu.slots': 'Slots',
    'menu.perimetros': 'Perimeters',
    'menu.diretrizes': 'Guidelines',
    'menu.organizacao': 'Organization',
    'menu.configuracoes': 'Settings',
    
    // Bills to Pay
    'bills.title': 'Bills - To Pay',
    'bills.breadcrumb': 'Finance > Bills',
    'bills.search': 'Search',
    'bills.status': 'Status',
    'bills.id': 'ID',
    'bills.competence': 'Competence',
    'bills.due': 'Due Date',
    'bills.payment': 'Payment',
    'bills.classification': 'Classification',
    'bills.participants': 'Participants',
    'bills.installment': 'Installment',
    'bills.total': 'Total',
    'bills.pending': 'Pending',
  },
  es: {
    // Menu
    'menu.principal': 'Principal',
    'menu.painel': 'Panel',
    'menu.atividade': 'Actividad',
    'menu.servicos': 'Servicios',
    'menu.transfer': 'Transfer',
    'menu.combo': 'Combo',
    'menu.hospedagem': 'Alojamiento',
    'menu.ingresso': 'Entrada',
    'menu.passeio': 'Tour',
    'menu.experiencia': 'Experiencia',
    'menu.circuito': 'Circuito',
    'menu.comercial': 'Comercial',
    'menu.tarifario': 'Tarifario',
    'menu.disponibilidade': 'Disponibilidad',
    'menu.financas': 'Finanzas',
    'menu.complementos': 'Complementos',
    'menu.slots': 'Slots',
    'menu.perimetros': 'Perímetros',
    'menu.diretrizes': 'Directrices',
    'menu.organizacao': 'Organización',
    'menu.configuracoes': 'Configuraciones',
    
    // Bills to Pay
    'bills.title': 'Cuentas - A Pagar',
    'bills.breadcrumb': 'Finanzas > Cuentas',
    'bills.search': 'Buscar',
    'bills.status': 'Estado',
    'bills.id': 'ID',
    'bills.competence': 'Competencia',
    'bills.due': 'Vencimiento',
    'bills.payment': 'Pago',
    'bills.classification': 'Clasificación',
    'bills.participants': 'Participantes',
    'bills.installment': 'Cuota',
    'bills.total': 'Total',
    'bills.pending': 'Pendiente',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.pt] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
