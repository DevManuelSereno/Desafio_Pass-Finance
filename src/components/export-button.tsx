'use client';

import { useState, useEffect } from 'react';
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

  useEffect(() => {
    console.log('ExportButton: Componente montado');
    return () => console.log('ExportButton: Componente desmontado');
  }, []);

  const handleExport = async () => {
    console.log('ExportButton: Iniciando exportação...');
    setIsExporting(true);

    try {
      console.log('ExportButton: Fazendo requisição para /api/export-data');
      // Fazer requisição para a API para buscar os dados
      const response = await fetch('/api/export-data');
      console.log('ExportButton: Resposta recebida:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error('Erro ao buscar dados para exportação');
      }

      // Obter os dados em formato JSON
      const data = await response.json();
      console.log('ExportButton: Dados recebidos:', data.length, 'registros');

      if (!Array.isArray(data) || data.length === 0) {
        console.warn('ExportButton: Nenhum dado para exportar');
        alert('Nenhum dado disponível para exportação');
        return;
      }

      // Mapear os dados para usar cabeçalhos em português
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

      // Converter os dados para CSV usando papaparse
      console.log('ExportButton: Convertendo para CSV...');
      const csv = Papa.unparse(dadosFormatados, {
        quotes: true, // Adicionar aspas aos valores
        delimiter: ',', // Usar vírgula como delimitador
        header: true, // Incluir cabeçalhos
      });
      console.log('ExportButton: CSV gerado com', csv.length, 'caracteres');

      // Criar um Blob com o conteúdo CSV
      const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });

      // Criar um link temporário para download
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      // Configurar o link
      link.setAttribute('href', url);
      link.setAttribute('download', `contas_a_pagar_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';

      // Adicionar o link ao documento, clicar nele e removê-lo
      console.log('ExportButton: Disparando download...');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log('ExportButton: Download iniciado');

      // Limpar o URL do objeto
      URL.revokeObjectURL(url);

      console.log('Exportação concluída com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      alert('Erro ao exportar dados. Por favor, tente novamente.');
    } finally {
      setIsExporting(false);
    }
  };

  console.log('ExportButton: Renderizando...');

  return (
    <Button
      variant={variant}
      size={size}
      className={`h-8 gap-2 rounded-lg cursor-pointer ${className || ''}`}
      onClick={(e) => {
        console.log('ExportButton: Clique detectado!');
        e.preventDefault();
        e.stopPropagation();
        handleExport();
      }}
      disabled={isExporting}
      type="button"
    >
      <Download className="h-3.5 w-3.5" />
      <span className="text-xs">{isExporting ? 'Exportando...' : 'Export'}</span>
    </Button>
  );
}
