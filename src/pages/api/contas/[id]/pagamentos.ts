import type { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { criarPagamentoSchema } from '@/lib/schemas/pagamento.schema';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const contaId = Number(req.query.id);

  if (!Number.isInteger(contaId) || contaId <= 0) {
    return res.status(400).json({ message: 'ID da conta inválido' });
  }

  try {
    if (req.method === 'POST') {
      const parsed = criarPagamentoSchema.parse(req.body);

      const pagamento = await prisma.$transaction(async (tx) => {
        const conta = await tx.contaPagar.findUnique({ where: { id: contaId } });
        if (!conta) {
          throw new Error('CONTA_NOT_FOUND');
        }

        const novoPagamento = await tx.pagamento.create({
          data: {
            chequeNumero: parsed.chequeNumero ?? null,
            caixa: parsed.caixa ?? null,
            classificacao: parsed.classificacao ?? null,
            tipo: parsed.tipo ?? null,
            total: parsed.total,
            dataPagamento: parsed.dataPagamento ?? new Date(),
            contaPagarId: contaId,
          },
        });

        const valorPagoAtual = conta.valorPago.toNumber();
        const novoValorPago = valorPagoAtual + parsed.total;
        const novoSaldo = conta.total.toNumber() - novoValorPago;

        await tx.contaPagar.update({
          where: { id: contaId },
          data: {
            valorPago: novoValorPago,
            saldo: novoSaldo,
          },
        });

        return novoPagamento;
      });

      return res.status(201).json(pagamento);
    }

    if (req.method === 'GET') {
      const pagamentos = await prisma.pagamento.findMany({
        where: { contaPagarId: contaId },
        orderBy: { dataPagamento: 'desc' },
      });

      return res.status(200).json(pagamentos);
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Erro de validação',
        issues: error.issues,
      });
    }

    if (error instanceof Error && error.message === 'CONTA_NOT_FOUND') {
      return res.status(404).json({ message: 'Conta não encontrada' });
    }

    console.error(`Erro em /api/contas/${contaId}/pagamentos:`, error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
