# 🧪 Guia de Testes do Backend - Pass Finance

## ✅ Implementações Concluídas

### 1. **Schema Prisma** (`prisma/schema.prisma`)
- ✅ Modelo `ContaPagar` com todos os campos necessários
- ✅ Modelo `Pagamento` com relação 1:N
- ✅ Enum `StatusConta` (PENDENTE, PAGO, ATRASADO, CANCELADO)
- ✅ Configurado para PostgreSQL

### 2. **Singleton do Prisma** (`src/lib/prisma.ts`)
- ✅ Padrão singleton para Vercel serverless
- ✅ Reutilização de instância em desenvolvimento
- ✅ Logs configurados por ambiente

### 3. **Schemas de Validação Zod**
- ✅ `src/lib/schemas/contaPagar.schema.ts`
  - `criarContaPagarSchema` - valida criação de contas
  - `atualizarContaPagarSchema` - valida atualizações
  - Bloqueia campos calculados (total, valorPago, saldo)
- ✅ `src/lib/schemas/pagamento.schema.ts`
  - `criarPagamentoSchema` - valida criação de pagamentos

### 4. **API Routes - CRUD de ContaPagar**

#### `POST /api/contas` - Criar conta
- ✅ Valida com Zod
- ✅ Calcula `total = valor - desconto + juros`
- ✅ Inicializa `valorPago = 0` e `saldo = total`
- ✅ Retorna `201 Created`

#### `GET /api/contas` - Listar contas
- ✅ Suporta paginação (`?page=1&limit=10`)
- ✅ Retorna `{ data: [], pagination: {} }`

#### `GET /api/contas/[id]` - Buscar conta específica
- ✅ Inclui pagamentos relacionados
- ✅ Retorna `404` se não encontrar

#### `PUT /api/contas/[id]` - Atualizar conta
- ✅ Recalcula totais ao atualizar valor/desconto/juros
- ✅ Mantém `valorPago` intacto (só muda via pagamentos)
- ✅ Atualiza `saldo = total - valorPago`

#### `DELETE /api/contas/[id]` - Deletar conta
- ✅ Deleta conta e pagamentos em cascata
- ✅ Retorna `204 No Content`

### 5. **API Routes - CRUD de Pagamento**

#### `POST /api/contas/[id]/pagamentos` - Criar pagamento
- ✅ Usa transação do Prisma
- ✅ Atualiza `valorPago` e `saldo` da conta automaticamente
- ✅ Retorna `201 Created`

#### `GET /api/contas/[id]/pagamentos` - Listar pagamentos
- ✅ Lista todos os pagamentos da conta
- ✅ Ordenado por `dataPagamento desc`

#### `DELETE /api/pagamentos/[pagamentoId]` - Deletar pagamento
- ✅ Usa transação do Prisma
- ✅ Reverte `valorPago` e `saldo` da conta
- ✅ Retorna `204 No Content`

### 6. **API Route de Analytics**

#### `GET /api/analytics` - Dados agregados
- ✅ `totalPendente` - soma do saldo das contas pendentes
- ✅ `totalPago` - soma do valorPago de todas as contas
- ✅ `gastosPorClassificacao` - array `[{ classificacaoGerencial, total }]`
- ✅ `contagemPorStatus` - array `[{ status, contagem }]`
- ✅ Formato otimizado para gráficos (shadcn charts)

### 7. **Frontend - Integração com API**

- ✅ Hook customizado `useBills()` em `src/hooks/use-bills.ts`
- ✅ Mapeia `ContaPagar` do backend para `Bill` da UI
- ✅ Suporta paginação e loading states
- ✅ Página principal atualizada para usar dados reais
- ✅ Botão "Atualizar" com indicador de loading
- ✅ Estados de erro e "vazio" na tabela

---

## 🚀 Como Testar

### Pré-requisitos

1. **Banco de dados PostgreSQL configurado**
   - Certifique-se de que a `DATABASE_URL` no `.env` está correta
   - Exemplo local: `postgresql://postgres:senha@localhost:5432/PassFinance?schema=public`

2. **Instalar dependências (se ainda não tiver)**
   ```bash
   npm install
   ```

3. **Gerar Prisma Client**
   ```bash
   npx prisma generate
   ```

4. **Rodar migrations** (cria as tabelas no banco)
   ```bash
   npx prisma migrate dev --name init
   ```

### Método 1: Script de Teste Automatizado

1. **Inicie o dev server em um terminal**:
   ```bash
   npm run dev
   ```

2. **Em outro terminal, execute o script de teste**:
   ```bash
   node test-api.mjs
   ```

Este script vai:
- ✅ Listar contas (GET /api/contas)
- ✅ Criar uma conta de teste (POST /api/contas)
- ✅ Buscar a conta criada (GET /api/contas/[id])
- ✅ Atualizar a conta (PUT /api/contas/[id])
- ✅ Criar um pagamento (POST /api/contas/[id]/pagamentos)
- ✅ Listar pagamentos (GET /api/contas/[id]/pagamentos)
- ✅ Deletar o pagamento (DELETE /api/pagamentos/[id])
- ✅ Deletar a conta (DELETE /api/contas/[id])
- ✅ Buscar analytics (GET /api/analytics)

### Método 2: Testar via Interface (Browser)

1. **Inicie o dev server**:
   ```bash
   npm run dev
   ```

2. **Abra o navegador** em `http://localhost:3000`

3. **Verifique se a tabela carrega**:
   - Se o banco estiver vazio, você verá "Nenhuma conta encontrada"
   - Caso contrário, verá as contas listadas

4. **Teste o botão "Atualizar"**:
   - Clique no botão (ícone de refresh)
   - Deve mostrar animação de loading e recarregar os dados

### Método 3: Testar via cURL ou Postman

#### Exemplo: Criar uma conta

```bash
curl -X POST http://localhost:3000/api/contas \
  -H "Content-Type: application/json" \
  -d '{
    "conta": "TESTE-001",
    "lancamento": "2025-01-10T10:00:00Z",
    "credor": "Fornecedor XYZ",
    "devedor": "Empresa ABC",
    "competencia": "2025-01-15",
    "vencimento": "2025-02-15",
    "valor": 1000,
    "desconto": 50,
    "juros": 10,
    "classificacaoGerencial": "Operacional"
  }'
```

#### Exemplo: Listar contas

```bash
curl http://localhost:3000/api/contas?page=1&limit=10
```

#### Exemplo: Buscar analytics

```bash
curl http://localhost:3000/api/analytics
```

---

## 🛠️ Estrutura de Pastas

```
pass-finance/
├── prisma/
│   └── schema.prisma           # Schema do banco de dados
├── src/
│   ├── lib/
│   │   ├── prisma.ts           # Singleton do Prisma Client
│   │   └── schemas/
│   │       ├── contaPagar.schema.ts
│   │       └── pagamento.schema.ts
│   ├── pages/
│   │   └── api/
│   │       ├── contas/
│   │       │   ├── index.ts           # GET/POST /api/contas
│   │       │   ├── [id].ts            # GET/PUT/DELETE /api/contas/[id]
│   │       │   └── [id]/
│   │       │       └── pagamentos.ts  # GET/POST /api/contas/[id]/pagamentos
│   │       ├── pagamentos/
│   │       │   └── [pagamentoId].ts   # DELETE /api/pagamentos/[id]
│   │       └── analytics/
│   │           └── index.ts           # GET /api/analytics
│   ├── hooks/
│   │   └── use-bills.ts        # Hook customizado para buscar contas
│   └── app/
│       └── page.tsx             # Página principal (usa useBills)
├── .env                         # Configuração do banco de dados
└── test-api.mjs                 # Script de teste automatizado
```

---

## 🐛 Troubleshooting

### Erro: "Prisma Client não foi gerado"
```bash
npx prisma generate
```

### Erro: "Tabelas não existem no banco"
```bash
npx prisma migrate dev --name init
```

### Erro: "Cannot connect to database"
- Verifique se o PostgreSQL está rodando
- Verifique a string de conexão no `.env`
- Teste a conexão com: `npx prisma db pull`

### Erro: "EPERM: operation not permitted" (Windows)
- Feche o dev server
- Delete a pasta `node_modules\.prisma`
- Execute `npx prisma generate` novamente

---

## 📊 Formato das Respostas da API

### GET /api/contas
```json
{
  "data": [
    {
      "id": 1,
      "conta": "000001",
      "credor": "Fornecedor XYZ",
      "devedor": "Empresa ABC",
      "valor": 1000,
      "total": 960,
      "valorPago": 300,
      "saldo": 660,
      "status": "PENDENTE",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

### GET /api/analytics
```json
{
  "totalPendente": 12500.50,
  "totalPago": 8900.00,
  "gastosPorClassificacao": [
    { "classificacaoGerencial": "Operacional", "total": 5600.00 },
    { "classificacaoGerencial": "Administrativo", "total": 3400.50 }
  ],
  "contagemPorStatus": [
    { "status": "PENDENTE", "contagem": 15 },
    { "status": "PAGO", "contagem": 8 },
    { "status": "ATRASADO", "contagem": 3 }
  ]
}
```

---

## ✅ Checklist de Funcionalidades

- [x] Schema Prisma completo
- [x] Singleton do Prisma para Vercel
- [x] Validação com Zod
- [x] CRUD completo de ContaPagar
- [x] CRUD de Pagamento com atualização automática de totais
- [x] Endpoint de analytics com agregações
- [x] Hook customizado `useBills`
- [x] Integração frontend com backend
- [x] Paginação funcional
- [x] Loading e error states
- [x] Script de teste automatizado

---

🎉 **Backend totalmente implementado e pronto para uso!**
