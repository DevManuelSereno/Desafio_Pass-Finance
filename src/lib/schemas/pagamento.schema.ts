import { z } from 'zod';

export const criarPagamentoSchema = z.object({
  chequeNumero: z.string().optional().nullable(),
  caixa: z.string().optional().nullable(),
  classificacao: z.string().optional().nullable(),
  tipo: z.string().optional().nullable(),
  total: z.number().nonnegative(),
  dataPagamento: z.coerce.date().optional(),
});

export type CriarPagamentoInput = z.infer<typeof criarPagamentoSchema>;
