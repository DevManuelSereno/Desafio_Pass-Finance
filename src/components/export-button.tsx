'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import Papa from 'papaparse';

interface ExportButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function ExportButton({ variant = 'outline', size = 'sm', className }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const response = await fetch('/api/export-data');

      if (!response.ok) {
        throw new Error('Erro ao buscar dados para exportação');
      }

      const data = await response.json();

      if (!Array.isArray(data) || data.length === 0) {
        alert('Nenhum dado disponível para exportação');
        return;
      }

      const dadosFormatados = data.map((item) => ({
        ID: item.id,
        Conta: item.conta,
        Lançamento: item.lancamento,
        Quitação: item.quitacao || 'Não quitado',
        Status: item.status,
        'Documento/Contrato': item.documentoContrato || '',
        Fatura: item.fatura || '',
        'Conta/Grupo': item.contaGrupo || '',
        Referência: item.referencia || '',
        'Palavras-chave': item.palavrasChave || '',
        Credor: item.credor,
        Devedor: item.devedor,
        'Classificação Contábil': item.classificacaoContabil || '',
        'Classificação Gerencial': item.classificacaoGerencial || '',
        'Centro de Custo': item.centroCusto || '',
        Competência: item.competencia,
        Vencimento: item.vencimento,
        'Vencimento Alterado': item.vencimentoAlterado || '',
        'Número Parcela': item.numeroParcela,
        'Total Parcelas': item.totalParcelas,
        Previsão: item.previsao || '',
        Transação: item.transacao || '',
        Valor: item.valor,
        Desconto: item.desconto,
        Juros: item.juros,
        Total: item.total,
        'Valor Pago': item.valorPago,
        Saldo: item.saldo,
        Notas: item.notas || '',
        'Criado em': item.criadoEm,
        'Atualizado em': item.atualizadoEm,
      }));

      const csv = Papa.unparse(dadosFormatados, {
        quotes: true,
        delimiter: ',',
        header: true,
      });

      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `contas_a_pagar_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      alert('Erro ao exportar dados. Por favor, tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={`h-9 gap-2 rounded-lg cursor-pointer ${className || ''}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleExport();
      }}
      disabled={isExporting}
      type="button"
    >
      <Download className="h-3.5 w-3.5" />
      <span className="text-sm">{isExporting ? 'Exportando...' : 'Export'}</span>
    </Button>
  );
}
