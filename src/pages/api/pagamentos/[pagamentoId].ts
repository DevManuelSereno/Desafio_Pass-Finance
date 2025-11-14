import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pagamentoId = Number(req.query.pagamentoId);

  if (!Number.isInteger(pagamentoId) || pagamentoId <= 0) {
    return res.status(400).json({ message: 'ID do pagamento inválido' });
  }

  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    await prisma.$transaction(async (tx) => {
      const pagamento = await tx.pagamento.findUnique({ where: { id: pagamentoId } });
      if (!pagamento) {
        throw new Error('PAGAMENTO_NOT_FOUND');
      }

      const conta = await tx.contaPagar.findUnique({ where: { id: pagamento.contaPagarId } });
      if (!conta) {
        throw new Error('CONTA_NOT_FOUND');
      }

      await tx.pagamento.delete({ where: { id: pagamentoId } });

      const valorPagoAtual = conta.valorPago.toNumber();
      const novoValorPago = Math.max(0, valorPagoAtual - pagamento.total.toNumber());
      const novoSaldo = conta.total.toNumber() - novoValorPago;

      await tx.contaPagar.update({
        where: { id: conta.id },
        data: {
          valorPago: novoValorPago,
          saldo: novoSaldo,
        },
      });
    });

    return res.status(204).end();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'PAGAMENTO_NOT_FOUND') {
        return res.status(404).json({ message: 'Pagamento não encontrado' });
      }
      if (error.message === 'CONTA_NOT_FOUND') {
        return res.status(404).json({ message: 'Conta vinculada ao pagamento não encontrada' });
      }
    }

    console.error(`Erro em /api/pagamentos/${pagamentoId}:`, error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
