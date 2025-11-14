-- CreateEnum
CREATE TYPE "StatusConta" AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO', 'CANCELADO');

-- CreateTable
CREATE TABLE "ContaPagar" (
    "id" SERIAL NOT NULL,
    "conta" TEXT NOT NULL,
    "lancamento" TIMESTAMP(3) NOT NULL,
    "quitacao" TIMESTAMP(3),
    "status" "StatusConta" NOT NULL DEFAULT 'PENDENTE',
    "documentoContrato" TEXT,
    "fatura" TEXT,
    "contaGrupo" TEXT,
    "referencia" TEXT,
    "palavrasChave" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "credor" TEXT NOT NULL,
    "devedor" TEXT NOT NULL,
    "classificacaoContabil" TEXT,
    "classificacaoGerencial" TEXT,
    "centroCusto" TEXT,
    "competencia" DATE NOT NULL,
    "vencimento" DATE NOT NULL,
    "vencimentoAlterado" DATE,
    "numeroParcela" INTEGER NOT NULL DEFAULT 1,
    "totalParcelas" INTEGER NOT NULL DEFAULT 1,
    "previsao" TEXT,
    "transacao" TEXT,
    "valor" DECIMAL(10,2) NOT NULL,
    "desconto" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "juros" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(10,2) NOT NULL,
    "valorPago" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "saldo" DECIMAL(10,2) NOT NULL,
    "notas" TEXT,
    "arquivos" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContaPagar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pagamento" (
    "id" SERIAL NOT NULL,
    "chequeNumero" TEXT,
    "caixa" TEXT,
    "classificacao" TEXT,
    "tipo" TEXT,
    "total" DECIMAL(10,2) NOT NULL,
    "dataPagamento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contaPagarId" INTEGER NOT NULL,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ContaPagar_conta_key" ON "ContaPagar"("conta");

-- CreateIndex
CREATE INDEX "Pagamento_contaPagarId_idx" ON "Pagamento"("contaPagarId");

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_contaPagarId_fkey" FOREIGN KEY ("contaPagarId") REFERENCES "ContaPagar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
