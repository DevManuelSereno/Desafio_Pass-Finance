# Implementação dos Modais - Conta a Pagar

## Visão Geral

Foram criados dois modais modernos e responsivos seguindo o design fornecido:

1. **AccountPayableModal** - Modal para visualizar e editar detalhes de uma Conta a Pagar
2. **AddPaymentModal** - Modal para adicionar novos pagamentos

## Componentes Criados

### Componentes UI (shadcn/ui pattern)

Todos os componentes UI seguem o padrão shadcn/ui e foram criados em `src/components/ui/`:

- **dialog.tsx** - Componente de diálogo modal com overlay
- **select.tsx** - Componente de seleção dropdown
- **label.tsx** - Labels para formulários
- **textarea.tsx** - Campo de texto multilinha
- **separator.tsx** - Separador visual
- **collapsible.tsx** - Componente para seções expansíveis/recolhíveis

### Modais Principais

#### 1. AccountPayableModal (`src/components/account-payable-modal.tsx`)

Modal completo para visualizar e editar contas a pagar com as seguintes seções (todas colapsáveis):

- **Dados Gerais**: Conta, Lançamento, Quitação, Status, Documento/Contrato, Fatura, Conta/Grupo, Referência, Palavra-chave
- **Participantes**: Credor e Devedor
- **Contábil**: Classificação Contábil, Classificação Gerencial, Centro de Custo
- **Dados Financeiros**: Competência, Vencimento, Vencimento Alterado, Nº da Parcela, Qtd. Total de Parcelas, Previsão, Transação
- **Totais**: Valor, Desconto, Juros, Total, Valor Pago, Saldo (com destaque visual para saldo negativo)
- **Pagamentos**: Tabela com lista de pagamentos + botão "Adicionar Pagamento" que abre o modal de pagamento
- **Arquivos**: Área de drag-and-drop para upload de anexos
- **Notas**: Campo de texto para anotações

**Características:**
- Header fixo com título, badge de status e botões de ação
- Body com scroll independente
- Seções colapsáveis com ícones e animações
- Footer fixo com botões "Fechar" e "Atualizar"
- Responsivo para diferentes tamanhos de tela
- Badge de status com cores diferentes (Pendente, Pago, Vencido, Cancelado)

#### 2. AddPaymentModal (`src/components/add-payment-modal.tsx`)

Modal simplificado para adicionar pagamentos com:

- **Dados Gerais**: Data do Movimento, Caixa/Conta, Forma de Pagamento, Classificação Gerencial, Saldo a Pagar, Valor
- **Notas**: Campo para anotações

**Características:**
- Interface limpa e focada
- Exibe saldo a pagar em destaque
- Footer com botões "Fechar" e "Cadastrar"

## Integração com page.tsx

As mudanças na página principal incluem:

1. **Remoção da expansão inline**: A funcionalidade `expandedRow` foi removida
2. **Click na linha da tabela**: Agora abre o modal `AccountPayableModal` com os detalhes completos
3. **Botão "Adicionar"**: Abre o modal `AddPaymentModal` diretamente
4. **Botão "Adicionar Pagamento"** dentro do `AccountPayableModal`: Fecha o modal de conta e abre o modal de pagamento

## Fluxo de Uso

### Visualizar/Editar Conta a Pagar
1. Usuário clica em qualquer linha da tabela
2. Modal `AccountPayableModal` abre com todos os detalhes da conta
3. Usuário pode editar os campos e salvar clicando em "Atualizar"

### Adicionar Pagamento (via toolbar)
1. Usuário clica no botão "Adicionar" na toolbar
2. Modal `AddPaymentModal` abre diretamente

### Adicionar Pagamento (via modal de conta)
1. Usuário está no `AccountPayableModal`
2. Clica em "Adicionar Pagamento" na seção de Pagamentos
3. Modal de conta fecha e `AddPaymentModal` abre

## Design e UX

### Paleta de Cores
- Usa as variáveis CSS do tema (suporta dark mode)
- Saldo negativo em vermelho (`text-destructive`)
- Status com badges coloridos

### Responsividade
- Grid adaptativo (1 coluna → 2 colunas → 4+ colunas)
- Scroll independente no body do modal
- Headers e footers fixos

### Animações
- Transições suaves ao abrir/fechar modais
- Animações nos colapsáveis (ícone chevron rotaciona 90°)
- Hover states em todos os elementos interativos

### Acessibilidade
- Labels semânticos
- Hierarquia adequada de headings
- Focus states visíveis
- Suporte a teclado (ESC para fechar)

## Dependências

Os componentes dependem das seguintes bibliotecas Radix UI que já devem estar instaladas:
- `@radix-ui/react-dialog`
- `@radix-ui/react-select`
- `@radix-ui/react-separator`
- `@radix-ui/react-label`
- `@radix-ui/react-collapsible`

## Próximos Passos

Para completar a implementação, considere:

1. **Validação de formulários**: Adicionar validação com Zod/React Hook Form
2. **Integração com API**: Conectar os modais com backend real
3. **Upload de arquivos**: Implementar funcionalidade de drag-and-drop
4. **Multi-select de tags**: Implementar componente de tags para palavra-chave
5. **Máscaras de input**: Adicionar máscaras para campos de moeda e data
6. **Toasts de feedback**: Adicionar notificações de sucesso/erro após ações
