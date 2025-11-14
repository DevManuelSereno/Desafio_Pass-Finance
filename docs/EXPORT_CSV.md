# Funcionalidade de Exportação CSV

## Visão Geral

Esta funcionalidade permite exportar todos os dados de contas a pagar do banco de dados PostgreSQL para um arquivo CSV que pode ser aberto no Excel, Google Sheets ou qualquer editor de planilhas.

## Arquivos Criados

### 1. API Route: `src/pages/api/export-data.ts`

**Descrição**: Endpoint da API que busca todos os dados de contas a pagar do banco de dados usando Prisma.

**Funcionalidades**:
- Busca todas as contas do modelo `ContaPagar`
- Formata as datas para o formato brasileiro (DD/MM/YYYY)
- Converte valores `Decimal` para `string` para evitar problemas de serialização
- Trata arrays (palavrasChave) convertendo-os em string separada por vírgulas
- Retorna os dados em formato JSON

**Endpoint**: `GET /api/export-data`

**Resposta de Sucesso**:
```json
[
  {
    "id": 1,
    "conta": "000070",
    "lancamento": "2025-11-05",
    "quitacao": null,
    "status": "PENDENTE",
    "documentoContrato": "DOC-123",
    "fatura": "FAT-456",
    "contaGrupo": "Grupo A",
    "referencia": "Ref-789",
    "palavrasChave": "tag1, tag2, tag3",
    "credor": "Fornecedor A",
    "devedor": "Empresa B",
    // ... outros campos
  }
]
```

**Resposta de Erro**:
```json
{
  "error": "Erro ao buscar dados",
  "message": "Mensagem de erro específica"
}
```

### 2. Componente React: `src/components/export-button.tsx`

**Descrição**: Botão reutilizável que faz o fetch dos dados da API e gera o arquivo CSV usando PapaParse.

**Props**:
- `variant`: Variante do botão (default: `'outline'`)
- `size`: Tamanho do botão (default: `'sm'`)
- `className`: Classes CSS adicionais (opcional)

**Funcionalidades**:
1. **Busca de Dados**: Faz requisição para `/api/export-data`
2. **Formatação**: Mapeia os dados para usar cabeçalhos em português
3. **Conversão CSV**: Usa `Papa.unparse()` para converter JSON em CSV
4. **Download Automático**: Cria um Blob e dispara o download no navegador
5. **BOM UTF-8**: Adiciona `\uFEFF` para garantir compatibilidade com Excel
6. **Nome do Arquivo**: Gera nome com data atual: `contas_a_pagar_YYYY-MM-DD.csv`

**Estados**:
- `isExporting`: Boolean que controla o estado de carregamento do botão

## Dependências Instaladas

```bash
npm install papaparse @types/papaparse
```

- **papaparse**: Biblioteca para conversão de JSON para CSV
- **@types/papaparse**: Tipos TypeScript para papaparse

## Como Usar

### No código:

```tsx
import { ExportButton } from '@/components/export-button';

// Uso básico
<ExportButton />

// Com customização
<ExportButton 
  variant="default" 
  size="lg" 
  className="custom-class" 
/>
```

### Para o usuário final:

1. Clique no botão **"Export"** na toolbar da tabela
2. O sistema irá:
   - Buscar todos os dados do banco de dados
   - Converter para formato CSV
   - Baixar automaticamente o arquivo
3. O arquivo será salvo como `contas_a_pagar_YYYY-MM-DD.csv`
4. Abra o arquivo no Excel, Google Sheets ou outro editor de planilhas

## Campos Exportados

O CSV inclui todos os campos da conta a pagar:

| Campo Original | Nome no CSV | Tipo |
|----------------|-------------|------|
| id | ID | Número |
| conta | Conta | Texto |
| lancamento | Lançamento | Data |
| quitacao | Quitação | Data |
| status | Status | Texto |
| documentoContrato | Documento/Contrato | Texto |
| fatura | Fatura | Texto |
| contaGrupo | Conta/Grupo | Texto |
| referencia | Referência | Texto |
| palavrasChave | Palavras-chave | Texto |
| credor | Credor | Texto |
| devedor | Devedor | Texto |
| classificacaoContabil | Classificação Contábil | Texto |
| classificacaoGerencial | Classificação Gerencial | Texto |
| centroCusto | Centro de Custo | Texto |
| competencia | Competência | Data |
| vencimento | Vencimento | Data |
| vencimentoAlterado | Vencimento Alterado | Data |
| numeroParcela | Número Parcela | Número |
| totalParcelas | Total Parcelas | Número |
| previsao | Previsão | Texto |
| transacao | Transação | Texto |
| valor | Valor | Decimal |
| desconto | Desconto | Decimal |
| juros | Juros | Decimal |
| total | Total | Decimal |
| valorPago | Valor Pago | Decimal |
| saldo | Saldo | Decimal |
| notas | Notas | Texto |
| criadoEm | Criado em | Data |
| atualizadoEm | Atualizado em | Data |

## Características Técnicas

### Segurança
- Usa `GET` apenas (método de leitura)
- Valida o método HTTP na API route
- Desconecta o Prisma Client após cada requisição
- Trata erros adequadamente com try-catch

### Performance
- Busca todos os registros de uma vez (considere paginação para grandes volumes)
- Usa ordenação por data de criação (mais recentes primeiro)
- Formato otimizado para Excel (UTF-8 com BOM)

### Compatibilidade
- ✅ Excel (Windows/Mac)
- ✅ Google Sheets
- ✅ LibreOffice Calc
- ✅ Numbers (Mac)
- ✅ Qualquer editor CSV

## Melhorias Futuras

1. **Filtros de Exportação**: Permitir exportar apenas dados filtrados
2. **Seleção de Campos**: Escolher quais colunas exportar
3. **Formatos Adicionais**: Suporte para XLSX, PDF
4. **Paginação**: Para grandes volumes de dados
5. **Progress Bar**: Indicador de progresso para exportações grandes
6. **Agendamento**: Exportações automáticas agendadas
7. **Templates**: Templates de exportação personalizados

## Troubleshooting

### O arquivo não abre no Excel
- **Causa**: Problema de encoding
- **Solução**: O código já inclui BOM UTF-8 (`\uFEFF`), mas se persistir, tente abrir com "Importar Dados" no Excel

### Campos vazios aparecem como "null"
- **Causa**: Valores nulos do banco de dados
- **Solução**: O código já converte `null` para string vazia (`''`) ou texto descritivo

### Download não inicia
- **Causa**: Bloqueador de pop-up ou erro na API
- **Solução**: Verifique o console do navegador e permita downloads do site

### Erro 500 na API
- **Causa**: Problema de conexão com o banco de dados
- **Solução**: Verifique se o banco PostgreSQL está rodando e se a `DATABASE_URL` está correta

## Logs e Debug

Para debugar, verifique:

1. **Console do Navegador**: Erros no frontend
2. **Terminal do Servidor**: Erros no backend (API route)
3. **Network Tab**: Status da requisição HTTP

```javascript
// No componente ExportButton, descomente para debug:
console.log('Dados recebidos:', data);
console.log('CSV gerado:', csv);
```

## Código-fonte Completo

Os arquivos completos estão em:
- Backend: `src/pages/api/export-data.ts`
- Frontend: `src/components/export-button.tsx`
- Integração: `src/app/page.tsx` (linha 9 e 557)
