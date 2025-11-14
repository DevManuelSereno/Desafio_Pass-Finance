import type { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { atualizarContaPagarSchema } from '@/lib/schemas/contaPagar.schema';

function calcularTotais(
  valorAtual: number,
  descontoAtual: number,
  jurosAtual: number,
  overrides: Partial<{ valor: number; desconto: number; juros: number }>,
) {
  const valor = overrides.valor ?? valorAtual;
  const desconto = overrides.desconto ?? descontoAtual;
  const juros = overrides.juros ?? jurosAtual;
  const total = valor - desconto + juros;
  return { valor, desconto, juros, total };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const id = Number(req.query.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ message: 'ID inválido' });
  }

  try {
    if (req.method === 'GET') {
      const conta = await prisma.contaPagar.findUnique({
        where: { id },
        include: { pagamentos: true },
      });

      if (!conta) {
        return res.status(404).json({ message: 'Conta não encontrada' });
      }

      return res.status(200).json(conta);
    }

    if (req.method === 'PUT') {
      const parsed = atualizarContaPagarSchema.parse(req.body);

      const contaAtual = await prisma.contaPagar.findUnique({ where: { id } });
      if (!contaAtual) {
        return res.status(404).json({ message: 'Conta não encontrada' });
      }

      const {
        valor,
        desconto,
        juros,
        total,
      } = calcularTotais(
        contaAtual.valor.toNumber(),
        contaAtual.desconto.toNumber(),
        contaAtual.juros.toNumber(),
        {
          valor: parsed.valor,
          desconto: parsed.desconto,
          juros: parsed.juros,
        },
      );

      const valorPago = contaAtual.valorPago.toNumber();
      const saldo = total - valorPago;

      const contaAtualizada = await prisma.contaPagar.update({
        where: { id },
        data: {
          conta: parsed.conta ?? contaAtual.conta,
          lancamento: parsed.lancamento ?? contaAtual.lancamento,
          quitacao: parsed.quitacao ?? contaAtual.quitacao,
          status: parsed.status ?? contaAtual.status,
          documentoContrato: parsed.documentoContrato ?? contaAtual.documentoContrato,
          fatura: parsed.fatura ?? contaAtual.fatura,
          contaGrupo: parsed.contaGrupo ?? contaAtual.contaGrupo,
          referencia: parsed.referencia ?? contaAtual.referencia,
          palavrasChave: parsed.palavrasChave ?? contaAtual.palavrasChave,
          credor: parsed.credor ?? contaAtual.credor,
          devedor: parsed.devedor ?? contaAtual.devedor,
          classificacaoContabil: parsed.classificacaoContabil ?? contaAtual.classificacaoContabil,
          classificacaoGerencial: parsed.classificacaoGerencial ?? contaAtual.classificacaoGerencial,
          centroCusto: parsed.centroCusto ?? contaAtual.centroCusto,
          competencia: parsed.competencia ?? contaAtual.competencia,
          vencimento: parsed.vencimento ?? contaAtual.vencimento,
          vencimentoAlterado: parsed.vencimentoAlterado ?? contaAtual.vencimentoAlterado,
          numeroParcela: parsed.numeroParcela ?? contaAtual.numeroParcela,
          totalParcelas: parsed.totalParcelas ?? contaAtual.totalParcelas,
          previsao: parsed.previsao ?? contaAtual.previsao,
          transacao: parsed.transacao ?? contaAtual.transacao,
          valor,
          desconto,
          juros,
          total,
          // valorPago é atualizado apenas via fluxo de pagamentos
          valorPago,
          saldo,
          notas: parsed.notas ?? contaAtual.notas,
          arquivos: parsed.arquivos ?? contaAtual.arquivos,
        },
      });

      return res.status(200).json(contaAtualizada);
    }

    if (req.method === 'DELETE') {
      await prisma.contaPagar.delete({ where: { id } });
      return res.status(204).end();
    }

    res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Erro de validação',
        issues: error.issues,
      });
    }

    console.error(`Erro em /api/contas/${id}:`, error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
