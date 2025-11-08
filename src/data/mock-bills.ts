import { Bill } from '@/types/bill';

export const mockBills: Bill[] = [
  {
    id: '1',
    code: '000070\n000009',
    competenceDate: '31/12/2025',
    dueDate: '05/11/2025',
    paymentInfo: '2 dias vencidos',
    status: 'Pendente',
    classification: {
      code: '111.01.001',
      description: 'Caixa Fundo Fixo'
    },
    participants: {
      name: 'Amorim Cortinas',
      secondary: 'Injepic'
    },
    installment: '2/12',
    amount: 100.00
  },
  {
    id: '2',
    code: '000090',
    competenceDate: '06/11/2025',
    dueDate: '06/11/2025',
    paymentInfo: '1 dia vencido',
    status: 'Pendente',
    classification: {
      code: '',
      description: 'Aluguel'
    },
    participants: {
      name: 'Amorim Cortinas',
      secondary: 'Igor Nental Industria'
    },
    installment: '1/1',
    amount: 198.00
  },
  {
    id: '3',
    code: '000040\n000001',
    competenceDate: '30/10/2025',
    dueDate: '06/11/2025',
    paymentInfo: '1 dia vencido',
    status: 'Pendente',
    classification: {
      code: '111.03.002',
      description: 'Aplicação Bradesco FI-FI - Ag 1311/ Cc 5249'
    },
    participants: {
      name: 'Amorim Cortinas',
      secondary: 'Amorim Cortinas'
    },
    installment: '1/6',
    amount: 150.00
  },
  {
    id: '4',
    code: '000041\n000001',
    competenceDate: '30/10/2025',
    dueDate: '06/11/2025',
    paymentInfo: '1 dia vencido',
    status: 'Pendente',
    classification: {
      code: '111.02.001',
      description: 'Banco Bradesco S/A'
    },
    participants: {
      name: 'Amorim Cortinas',
      secondary: 'Amorim Cortinas'
    },
    installment: '2/6',
    amount: 150.00
  },
  {
    id: '5',
    code: '000042\n000001',
    competenceDate: '30/10/2025',
    dueDate: '06/11/2025',
    paymentInfo: '1 dia vencido',
    status: 'Pendente',
    classification: {
      code: '111.02.001',
      description: 'Banco Bradesco S/A'
    },
    participants: {
      name: 'Amorim Cortinas',
      secondary: 'Amorim Cortinas'
    },
    installment: '3/6',
    amount: 150.00
  },
  {
    id: '6',
    code: '000043\n000001',
    competenceDate: '30/10/2025',
    dueDate: '06/11/2025',
    paymentInfo: '1 dia vencido',
    status: 'Pendente',
    classification: {
      code: '111.02.001',
      description: 'Banco Bradesco S/A'
    },
    participants: {
      name: 'Amorim Cortinas',
      secondary: 'Amorim Cortinas'
    },
    installment: '4/6',
    amount: 150.00
  },
  {
    id: '7',
    code: '000091',
    competenceDate: '07/11/2025',
    dueDate: '07/11/2025',
    paymentInfo: '-',
    status: 'Pendente',
    classification: {
      code: '',
      description: 'Energia Elétrica'
    },
    participants: {
      name: 'Amorim Cortinas',
      secondary: 'Igor Nental Industria'
    },
    installment: '1/1',
    amount: 36.00
  },
  {
    id: '8',
    code: '000089',
    competenceDate: '06/11/2025',
    dueDate: '13/11/2025',
    paymentInfo: '-',
    status: 'Pendente',
    classification: {
      code: '111.01.001',
      description: 'Caixa Fundo Fixo'
    },
    participants: {
      name: 'Amorim Cortinas',
      secondary: 'Amorim Cortinas'
    },
    installment: '1/1',
    amount: 10.00
  },
  {
    id: '9',
    code: '000088',
    competenceDate: '30/10/2025',
    dueDate: '14/11/2025',
    paymentInfo: '-',
    status: 'Pendente',
    classification: {
      code: '111.01.001',
      description: 'Caixa Fundo Fixo'
    },
    participants: {
      name: 'Amorim Cortinas',
      secondary: 'Amorim Cortinas'
    },
    installment: '1/1',
    amount: 10.00
  },
  {
    id: '10',
    code: '000085',
    competenceDate: '06/11/2025',
    dueDate: '21/11/2025',
    paymentInfo: '-',
    status: 'Pendente',
    classification: {
      code: '111.01.001',
      description: 'Caixa Fundo Fixo'
    },
    participants: {
      name: 'Amorim Cortinas',
      secondary: 'Amorim Cortinas'
    },
    installment: '1/1',
    amount: 10.00
  }
];
