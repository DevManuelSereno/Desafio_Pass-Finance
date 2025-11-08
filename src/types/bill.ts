export interface Bill {
  id: string;
  code: string;
  competenceDate: string;
  dueDate: string;
  paymentInfo: string;
  status: 'Pendente' | 'Pago' | 'Vencido' | 'Cancelado';
  classification: {
    code: string;
    description: string;
  };
  participants: {
    name: string;
    secondary?: string;
  };
  installment: string;
  amount: number;
  details?: {
    document?: string;
    invoice?: string;
    accountGroup?: string;
    reference?: string;
    launchDate?: string;
    paymentDate?: string;
    creditor?: {
      id: string;
      name: string;
    };
    debtor?: {
      id: string;
      name: string;
    };
    accountingClassification?: {
      id: string;
      description: string;
    };
    costCenter?: {
      id: string;
      name: string;
    };
  };
}

export interface BillFilters {
  search: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
}
