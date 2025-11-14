import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface ExportDataItem {
  id: number;
  conta: string;
  lancamento: string;
  quitacao: string | null;
  status: string;
  documentoContrato: string | null;
  fatura: string | null;
  contaGrupo: string | null;
  referencia: string | null;
  palavrasChave: string;
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
  valor: string;
  desconto: string;
  juros: string;
  total: string;
  valorPago: string;
  saldo: string;
  notas: string | null;
  criadoEm: string;
  atualizadoEm: string;
}

type ErrorResponse = {
  error: string;
  message?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ExportDataItem[] | ErrorResponse>
) {
  // Apenas permitir método GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    // Buscar todas as contas a pagar do banco de dados
    const contas = await prisma.contaPagar.findMany({
      orderBy: {
        criadoEm: 'desc',
      },
    });

    // Formatar os dados para exportação
    const dadosFormatados: ExportDataItem[] = contas.map((conta) => ({
      id: conta.id,
      conta: conta.conta,
      lancamento: conta.lancamento.toISOString().split('T')[0],
      quitacao: conta.quitacao ? conta.quitacao.toISOString().split('T')[0] : null,
      status: conta.status,
      documentoContrato: conta.documentoContrato,
      fatura: conta.fatura,
      contaGrupo: conta.contaGrupo,
      referencia: conta.referencia,
      palavrasChave: conta.palavrasChave.join(', '),
      credor: conta.credor,
      devedor: conta.devedor,
      classificacaoContabil: conta.classificacaoContabil,
      classificacaoGerencial: conta.classificacaoGerencial,
      centroCusto: conta.centroCusto,
      competencia: conta.competencia.toISOString().split('T')[0],
      vencimento: conta.vencimento.toISOString().split('T')[0],
      vencimentoAlterado: conta.vencimentoAlterado
        ? conta.vencimentoAlterado.toISOString().split('T')[0]
        : null,
      numeroParcela: conta.numeroParcela,
      totalParcelas: conta.totalParcelas,
      previsao: conta.previsao,
      transacao: conta.transacao,
      valor: conta.valor.toString(),
      desconto: conta.desconto.toString(),
      juros: conta.juros.toString(),
      total: conta.total.toString(),
      valorPago: conta.valorPago.toString(),
      saldo: conta.saldo.toString(),
      notas: conta.notas,
      criadoEm: conta.criadoEm.toISOString().split('T')[0],
      atualizadoEm: conta.atualizadoEm.toISOString().split('T')[0],
    }));

    // Retornar os dados formatados
    res.status(200).json(dadosFormatados);
  } catch (error) {
    console.error('Erro ao buscar dados para exportação:', error);
    res.status(500).json({
      error: 'Erro ao buscar dados',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
    });
  } finally {
    await prisma.$disconnect();
  }
}
