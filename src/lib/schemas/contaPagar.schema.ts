import { z } from 'zod';
import { StatusConta } from '@prisma/client';

const baseContaPagarSchema = z.object({
  conta: z.string().min(1, 'Campo obrigatório'),
  lancamento: z.coerce.date(),
  quitacao: z.coerce.date().optional().nullable(),
  status: z.nativeEnum(StatusConta).optional(),
  documentoContrato: z.string().optional().nullable(),
  fatura: z.string().optional().nullable(),
  contaGrupo: z.string().optional().nullable(),
  referencia: z.string().optional().nullable(),
  palavrasChave: z.array(z.string()).optional(),
  credor: z.string().min(1, 'Campo obrigatório'),
  devedor: z.string().min(1, 'Campo obrigatório'),
  classificacaoContabil: z.string().optional().nullable(),
  classificacaoGerencial: z.string().optional().nullable(),
  centroCusto: z.string().optional().nullable(),
  competencia: z.coerce.date(),
  vencimento: z.coerce.date(),
  vencimentoAlterado: z.coerce.date().optional().nullable(),
  numeroParcela: z.number().int().positive().default(1),
  totalParcelas: z.number().int().positive().default(1),
  previsao: z.string().optional().nullable(),
  transacao: z.string().optional().nullable(),
  valor: z.number().nonnegative(),
  desconto: z.number().nonnegative().optional().default(0),
  juros: z.number().nonnegative().optional().default(0),
  notas: z.string().optional().nullable(),
  arquivos: z.array(z.string()).optional(),
});

const calculatedFields = {
  total: z.number().optional().readonly(),
  valorPago: z.number().optional().readonly(),
  saldo: z.number().optional().readonly(),
};

export const criarContaPagarSchema = baseContaPagarSchema
  .extend(calculatedFields)
  .superRefine((data, ctx) => {
    if (data.total !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['total'],
        message: 'total é calculado pelo servidor e não deve ser enviado.',
      });
    }
    if (data.valorPago !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['valorPago'],
        message: 'valorPago é calculado pelo servidor e não deve ser enviado.',
      });
    }
    if (data.saldo !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['saldo'],
        message: 'saldo é calculado pelo servidor e não deve ser enviado.',
      });
    }
  });

export const atualizarContaPagarSchema = baseContaPagarSchema
  .partial()
  .extend(calculatedFields)
  .superRefine((data, ctx) => {
    if (data.total !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['total'],
        message: 'total é calculado pelo servidor e não pode ser atualizado diretamente.',
      });
    }
    if (data.valorPago !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['valorPago'],
        message: 'valorPago é calculado pelo servidor e não pode ser atualizado diretamente.',
      });
    }
    if (data.saldo !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['saldo'],
        message: 'saldo é calculado pelo servidor e não pode ser atualizado diretamente.',
      });
    }
  });

export type CriarContaPagarInput = z.infer<typeof criarContaPagarSchema>;
export type AtualizarContaPagarInput = z.infer<typeof atualizarContaPagarSchema>;
