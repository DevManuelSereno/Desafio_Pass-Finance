import type { NextApiRequest, NextApiResponse } from 'next';
import { ZodError } from 'zod';
import { prisma } from '@/lib/prisma';
import { criarContaPagarSchema } from '@/lib/schemas/contaPagar.schema';

function calcularTotais(valor: number, desconto: number, juros: number) {
  const total = valor - desconto + juros;
  const valorPago = 0;
  const saldo = total - valorPago;
  return { total, valorPago, saldo };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const parsed = criarContaPagarSchema.parse(req.body);

      const desconto = parsed.desconto ?? 0;
      const juros = parsed.juros ?? 0;
      const { total, valorPago, saldo } = calcularTotais(parsed.valor, desconto, juros);

      const conta = await prisma.contaPagar.create({
        data: {
          conta: parsed.conta,
          lancamento: parsed.lancamento,
          quitacao: parsed.quitacao ?? null,
          status: parsed.status,
          documentoContrato: parsed.documentoContrato ?? null,
          fatura: parsed.fatura ?? null,
          contaGrupo: parsed.contaGrupo ?? null,
          referencia: parsed.referencia ?? null,
          palavrasChave: parsed.palavrasChave ?? [],
          credor: parsed.credor,
          devedor: parsed.devedor,
          classificacaoContabil: parsed.classificacaoContabil ?? null,
          classificacaoGerencial: parsed.classificacaoGerencial ?? null,
          centroCusto: parsed.centroCusto ?? null,
          competencia: parsed.competencia,
          vencimento: parsed.vencimento,
          vencimentoAlterado: parsed.vencimentoAlterado ?? null,
          numeroParcela: parsed.numeroParcela ?? 1,
          totalParcelas: parsed.totalParcelas ?? 1,
          previsao: parsed.previsao ?? null,
          transacao: parsed.transacao ?? null,
          valor: parsed.valor,
          desconto,
          juros,
          total,
          valorPago,
          saldo,
          notas: parsed.notas ?? null,
          arquivos: parsed.arquivos ?? [],
        },
      });

      return res.status(201).json(conta);
    }

    if (req.method === 'GET') {
      const page = Number.parseInt((req.query.page as string) ?? '1', 10) || 1;
      const limit = Number.parseInt((req.query.limit as string) ?? '10', 10) || 10;
      const safePage = page < 1 ? 1 : page;
      const safeLimit = limit < 1 ? 10 : limit;

      const [contas, totalCount] = await Promise.all([
        prisma.contaPagar.findMany({
          skip: (safePage - 1) * safeLimit,
          take: safeLimit,
          orderBy: { criadoEm: 'desc' },
        }),
        prisma.contaPagar.count(),
      ]);

      // Converter Decimal para number
      const contasSerializadas = contas.map(conta => ({
        ...conta,
        valor: Number(conta.valor),
        desconto: Number(conta.desconto),
        juros: Number(conta.juros),
        total: Number(conta.total),
        valorPago: Number(conta.valorPago),
        saldo: Number(conta.saldo),
      }));

      return res.status(200).json({
        data: contasSerializadas,
        pagination: {
          page: safePage,
          limit: safeLimit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / safeLimit),
        },
      });
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

    console.error('Erro em /api/contas:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
