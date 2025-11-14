import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { StatusConta } from '@prisma/client';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const [totalPendenteAgg, totalPagoAgg, gastosPorClassificacaoRaw, contagemPorStatusRaw] =
      await Promise.all([
        prisma.contaPagar.aggregate({
          _sum: { saldo: true },
          where: { status: StatusConta.PENDENTE },
        }),
        prisma.contaPagar.aggregate({
          _sum: { valorPago: true },
        }),
        prisma.contaPagar.groupBy({
          by: ['classificacaoGerencial'],
          _sum: { total: true },
        }),
        prisma.contaPagar.groupBy({
          by: ['status'],
          _count: { _all: true },
        }),
      ]);

    const totalPendente = Number(totalPendenteAgg._sum.saldo ?? 0);
    const totalPago = Number(totalPagoAgg._sum.valorPago ?? 0);

    const gastosPorClassificacao = gastosPorClassificacaoRaw.map((row) => ({
      classificacaoGerencial: row.classificacaoGerencial ?? 'Sem classificação',
      total: Number(row._sum.total ?? 0),
    }));

    const contagemPorStatus = contagemPorStatusRaw.map((row) => ({
      status: row.status,
      contagem: row._count._all,
    }));

    return res.status(200).json({
      totalPendente,
      totalPago,
      gastosPorClassificacao,
      contagemPorStatus,
    });
  } catch (error) {
    console.error('Erro em /api/analytics:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
