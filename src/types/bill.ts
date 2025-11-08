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
}

export interface BillFilters {
  search: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
}
