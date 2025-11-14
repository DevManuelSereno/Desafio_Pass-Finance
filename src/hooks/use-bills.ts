import { useState, useEffect } from 'react';
import { Bill } from '@/types/bill';

interface ContaPagar {
  id: number;
  conta: string;
  lancamento: string;
  quitacao: string | null;
  status: 'PENDENTE' | 'PAGO' | 'ATRASADO' | 'CANCELADO';
  documentoContrato: string | null;
  fatura: string | null;
  contaGrupo: string | null;
  referencia: string | null;
  palavrasChave: string[];
  credor: string;
  devedor: string;
  classificacaoContabil: string | null;
  classificacaoGerencial: string | null;
  centroCusto: string | null;
  competencia: string;
  vencimento: string;
  vencimentoAlterado: string | null;
  numeroParcela: number;
  totalParcelas: number;
  previsao: string | null;
  transacao: string | null;
  valor: number;
  desconto: number;
  juros: number;
  total: number;
  valorPago: number;
  saldo: number;
  notas: string | null;
  arquivos: string[];
  criadoEm: string;
  atualizadoEm: string;
}

interface ApiResponse {
  data: ContaPagar[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

function mapContaPagarToBill(conta: ContaPagar): Bill {
  const statusMap: Record<string, Bill['status']> = {
    PENDENTE: 'Pendente',
    PAGO: 'Pago',
    ATRASADO: 'Vencido',
    CANCELADO: 'Cancelado',
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const calculatePaymentInfo = (vencimento: string, status: string): string => {
    if (status === 'PAGO') return 'Pago';
    
    const dueDate = new Date(vencimento);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} ${Math.abs(diffDays) === 1 ? 'dia vencido' : 'dias vencidos'}`;
    } else if (diffDays === 0) {
      return 'Vence hoje';
    } else if (diffDays === 1) {
      return 'Vence amanhã';
    } else {
      return `Vence em ${diffDays} dias`;
    }
  };

  return {
    id: conta.id.toString(),
    code: conta.conta,
    competenceDate: formatDate(conta.competencia),
    dueDate: formatDate(conta.vencimento),
    paymentInfo: conta.quitacao ? formatDate(conta.quitacao) : calculatePaymentInfo(conta.vencimento, conta.status),
    status: statusMap[conta.status] || 'Pendente',
    classification: {
      code: conta.classificacaoContabil || '',
      description: conta.classificacaoGerencial || 'Sem classificação',
    },
    participants: {
      name: conta.credor,
      secondary: conta.devedor !== conta.credor ? conta.devedor : undefined,
    },
    installment: `${conta.numeroParcela}/${conta.totalParcelas}`,
    amount: conta.total,
    details: {
      document: conta.documentoContrato || 'Indefinido',
      invoice: conta.fatura || 'Indefinido',
      accountGroup: conta.contaGrupo || undefined,
      reference: conta.referencia || undefined,
      launchDate: conta.lancamento ? formatDate(conta.lancamento) : undefined,
      paymentDate: conta.quitacao ? formatDate(conta.quitacao) : 'Indefinido',
      creditor: {
        id: conta.id.toString(),
        name: conta.credor,
      },
      debtor: {
        id: conta.id.toString(),
        name: conta.devedor,
      },
      accountingClassification: conta.classificacaoContabil
        ? {
            id: conta.id.toString(),
            description: conta.classificacaoContabil,
          }
        : undefined,
      costCenter: conta.centroCusto
        ? {
            id: conta.id.toString(),
            name: conta.centroCusto,
          }
        : undefined,
    },
  };
}

export function useBills(page: number = 1, limit: number = 10) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const fetchBills = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/contas?page=${page}&limit=${limit}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar contas: ${response.statusText}`);
      }
      
      const data: ApiResponse = await response.json();
      
      const mappedBills = data.data.map(mapContaPagarToBill);
      setBills(mappedBills);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit]);

  return {
    bills,
    loading,
    error,
    pagination,
    refetch: fetchBills,
  };
}
