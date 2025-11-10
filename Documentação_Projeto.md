# Pass Finance 💰

> Sistema moderno de gestão financeira desenvolvido com Next.js 16, React 19, TypeScript, Tailwind CSS e Shadcn/UI.

[![Next.js](https://img.shields.io/badge/Next.js-16.0.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61dafb?style=flat&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

## 🚀 **Veja o projeto ao vivo:** [**https://desafio-pass-finance.vercel.app/**](https://desafio-pass-finance.vercel.app/)

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Componentes Principais](#-componentes-principais)
- [Contextos](#-contextos)
- [Tipos e Interfaces](#-tipos-e-interfaces)
- [Estilização](#-estilização)
- [Internacionalização](#-internacionalização)
- [Boas Práticas](#-boas-práticas)
- [Deploy](#-deploy)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

## 🎯 Visão Geral

Pass Finance é um sistema completo de gestão financeira desenvolvido para o desafio da Pass. O projeto oferece uma interface moderna, intuitiva e responsiva para gerenciamento de contas a pagar e receber, com recursos avançados de filtragem, paginação e internacionalização.

### Principais Destaques

- 🎨 **Interface Moderna**: Design clean e profissional com suporte a Dark Mode
- 🌍 **Multilíngue**: Suporte para Português, Inglês e Espanhol
- 📱 **100% Responsivo**: Experiência perfeita em desktop, tablet e mobile
- ⚡ **Performance Otimizada**: Next.js 16 com React Server Components
- 🎭 **Animações Fluidas**: View Transitions API para transições suaves
- 🔍 **Filtros Avançados**: Sistema completo de busca e filtros hierárquicos
- 📊 **Tabela Dinâmica**: Paginação, seleção múltipla e ordenação
- 💳 **Modais Completos**: Cadastro e edição de pagamentos com validação
- 🧩 **Shadcn UI**: Componentes reutilizáveis e acessíveis com Radix UI

## ✨ Funcionalidades

### Dashboard Principal

- **Listagem de Contas**: Visualização completa de contas a pagar/receber
- **Busca Avançada**: Pesquisa por ID ou nome do participante
- **Filtros Hierárquicos**: 
  - Por quitação (status de pagamento)
  - Por status (Pendente, Pago, Vencido, Cancelado)
  - Por classificação contábil
- **Paginação Customizável**: 5, 10, 15 ou 20 itens por página
- **Seleção Múltipla**: Ações em lote para múltiplas contas
- **Ações por Item**: Editar, excluir e visualizar detalhes

### Modal de Conta a Pagar

Visualização e edição completa com as seguintes seções colapsáveis:

#### 📋 Dados Gerais
- Conta, Lançamento, Quitação, Status
- Documento/Contrato, Fatura
- Conta/Grupo, Referência
- Palavras-chave

#### 👥 Participantes
- Credor (quem recebe)
- Devedor (quem paga)

#### 📊 Contábil
- Classificação Contábil
- Classificação Gerencial
- Centro de Custo

#### 💰 Dados Financeiros
- Competência, Vencimento
- Número de Parcelas
- Previsão, Transação

#### 🧾 Totais
- Valor, Desconto, Juros
- Total, Valor Pago, Saldo
- Destaque visual para saldos negativos

#### 💳 Pagamentos
- Tabela de pagamentos realizados
- Botão para adicionar novo pagamento

#### 📁 Arquivos
- Upload de anexos (drag-and-drop)
- Suporte para PDF, TXT, XML

#### 📝 Notas
- Campo de texto livre para anotações

### Modal de Adicionar Pagamento

Sistema completo de cadastro com:

#### 📋 Dados Gerais
- Tipo de Operação (Pagar/Receber)
- Data de Vencimento e Competência
- Caixa/Conta, Forma de Pagamento
- Classificação Gerencial
- Descrição/Histórico

#### 👥 Participantes
- Credor e Devedor
- Dicas contextuais

#### 💳 Dados Financeiros
- **Parcelamento Inteligente**:
  - Configuração de número de parcelas (1-360)
  - Periodicidade (Semanal, Quinzenal, Mensal, etc.)
  - Data da primeira parcela
  - Preview em tempo real do parcelamento
- Centro de Custo
- Projeto/Departamento

#### 💰 Valores
- Valor Principal (obrigatório)
- Desconto
- Juros/Multa
- **Resumo Visual**:
  - Cálculo automático do total
  - Valor por parcela (se parcelado)
  - Cores semânticas (verde para desconto, vermelho para juros)

#### 📁 Arquivos
- Upload de comprovantes

#### 📝 Notas
- Campo para observações

## 🛠 Tecnologias

### Core

- **[Next.js 16.0.1](https://nextjs.org/)** - Framework React com SSR e SSG
- **[React 19.2.0](https://reactjs.org/)** - Biblioteca JavaScript para UI
- **[TypeScript 5](https://www.typescriptlang.org/)** - Superset tipado do JavaScript

### UI & Styling

- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[Shadcn UI](https://ui.shadcn.com/)** - Sistema de componentes reutilizáveis
  - Biblioteca de componentes copy-paste construída sobre Radix UI
  - 14 componentes implementados: Avatar, Badge, Button, Collapsible, Dialog, Dropdown Menu, Input, Label, Select, Separator, Table, Textarea
  - Totalmente customizável e acessível
- **[Radix UI](https://www.radix-ui.com/)** - Primitivos de UI headless
  - Base para os componentes Shadcn UI
  - Garantem acessibilidade (ARIA) e comportamento correto
- **[Lucide React](https://lucide.dev/)** - Ícones SVG modernos
- **[class-variance-authority](https://cva.style/)** - Variantes de componentes
- **[clsx](https://github.com/lukeed/clsx)** - Utilitário para classes condicionais
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge de classes Tailwind

### Fonts

- **[Geist Font](https://vercel.com/font)** - Família de fontes da Vercel
  - Geist Sans (variável)
  - Geist Mono (variável)

### Dev Tools

- **[ESLint 9](https://eslint.org/)** - Linter para JavaScript/TypeScript
- **[eslint-config-next](https://nextjs.org/docs/pages/building-your-application/configuring/eslint)** - Configuração ESLint para Next.js
- **[PostCSS](https://postcss.org/)** - Transformador de CSS

## 📦 Requisitos

- **Node.js**: >= 18.0.0 (recomendado: 20.x LTS)
- **npm**: >= 9.0.0 ou **yarn**: >= 1.22.0
- **Sistema Operacional**: Windows, macOS ou Linux

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/pass-finance.git
cd pass-finance
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
```

### 3. Execute o projeto em modo de desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

### 4. Abra no navegador

Acesse [http://localhost:3000](http://localhost:3000) para ver o resultado.

## 📜 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento (porta 3000) |
| `npm run build` | Cria build de produção otimizado |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa ESLint para verificar problemas no código |

## 📁 Estrutura do Projeto

```
pass-finance/
├── .next/                      # Build de produção (gerado automaticamente)
├── node_modules/               # Dependências do projeto
├── public/                     # Arquivos estáticos públicos
├── src/                        # Código-fonte principal
│   ├── app/                    # App Router do Next.js 16
│   │   ├── layout.tsx          # Layout root da aplicação
│   │   ├── page.tsx            # Página principal (Dashboard)
│   │   └── globals.css         # Estilos globais e variáveis CSS
│   ├── components/             # Componentes React
│   │   ├── ui/                 # Componentes de UI (shadcn/ui)
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── table.tsx
│   │   │   └── textarea.tsx
│   │   ├── account-payable-modal.tsx  # Modal de Conta a Pagar
│   │   ├── add-payment-modal.tsx      # Modal de Adicionar Pagamento
│   │   ├── providers.tsx              # Providers de contextos
│   │   └── sidebar.tsx                # Sidebar de navegação
│   ├── contexts/               # Contextos React
│   │   ├── language-context.tsx       # Internacionalização
│   │   ├── sidebar-context.tsx        # Estado da sidebar
│   │   └── theme-context.tsx          # Dark/Light mode
│   ├── data/                   # Dados mockados
│   │   └── mock-bills.ts              # Contas a pagar mockadas
│   ├── lib/                    # Utilitários
│   │   └── utils.ts                   # Funções auxiliares
│   └── types/                  # Definições de tipos TypeScript
│       └── bill.ts                    # Tipos de contas a pagar
├── .gitignore                  # Arquivos ignorados pelo Git
├── components.json             # Configuração do shadcn/ui
├── eslint.config.mjs           # Configuração do ESLint
├── next.config.ts              # Configuração do Next.js
├── next-env.d.ts              # Tipos do Next.js (auto-gerado)
├── package.json               # Dependências e scripts
├── package-lock.json          # Lock file das dependências
├── postcss.config.mjs         # Configuração do PostCSS
├── README.md                  # Este arquivo
└── tsconfig.json              # Configuração do TypeScript
```

## 🧩 Componentes Principais

### Dashboard (`src/app/page.tsx`)

Componente principal que gerencia:

- Estado da aplicação (busca, filtros, paginação)
- Renderização da tabela de contas
- Modais de edição e cadastro
- Sistema de filtros hierárquicos
- Seleção múltipla de itens

**Props**: Nenhuma (página root)

**Estado Principal**:
```typescript
- bills: Bill[]                          // Lista de contas
- searchTerm: string                     // Termo de busca global
- tableSearchTerm: string                // Busca na tabela
- selectedItems: string[]                // IDs selecionados
- selectedBill: Bill | null              // Conta selecionada
- showAccountModal: boolean              // Visibilidade do modal de conta
- showPaymentModal: boolean              // Visibilidade do modal de pagamento
- itemsPerPage: number                   // Itens por página
- currentPage: number                    // Página atual
- selectedSubFilters: Record<string, string[]>  // Filtros ativos
```

### AccountPayableModal (`src/components/account-payable-modal.tsx`)

Modal completo para visualização e edição de contas a pagar.

**Props**:
```typescript
interface AccountPayableModalProps {
  bill: Bill | null;              // Conta a ser exibida
  open: boolean;                  // Controle de visibilidade
  onOpenChange: (open: boolean) => void;  // Callback de mudança
  onAddPayment?: () => void;      // Callback para adicionar pagamento
}
```

**Características**:
- 8 seções colapsáveis independentes
- Formatação automática de valores monetários
- Badges de status com cores dinâmicas
- Tabela de pagamentos vinculados
- Upload de arquivos com drag-and-drop

### AddPaymentModal (`src/components/add-payment-modal.tsx`)

Modal para cadastro de novos pagamentos com sistema de parcelamento.

**Props**:
```typescript
interface AddPaymentModalProps {
  open: boolean;                  // Controle de visibilidade
  onOpenChange: (open: boolean) => void;  // Callback de mudança
}
```

**Características**:
- Cálculo automático de valores (desconto, juros, total)
- Sistema de parcelamento com preview
- Validação de campos obrigatórios
- Feedback visual em tempo real
- 6 seções organizadas

### Sidebar (`src/components/sidebar.tsx`)

Navegação lateral com suporte a collapse.

**Características**:
- Responsiva (oculta em mobile, visível em desktop)
- Animações suaves de transição
- Menu hierárquico multinível
- Indicador de item ativo

### Componentes UI (Shadcn UI)

O projeto utiliza **[Shadcn UI](https://ui.shadcn.com/)**, uma coleção de componentes reutilizáveis construídos com **Radix UI** e **Tailwind CSS**.

**O que é Shadcn UI?**
- Não é uma biblioteca NPM tradicional
- Sistema de componentes "copy-paste" que você possui
- Componentes totalmente customizáveis no seu código
- Construído sobre Radix UI para acessibilidade
- Estilizado com Tailwind CSS

**Componentes Implementados** (14 no total):

| Componente | Arquivo | Uso Principal |
|------------|---------|---------------|
| **Avatar** | `ui/avatar.tsx` | Foto do usuário no header |
| **Badge** | `ui/badge.tsx` | Status de contas (Pendente, Pago, etc) |
| **Button** | `ui/button.tsx` | Todos os botões da aplicação |
| **Collapsible** | `ui/collapsible.tsx` | Seções expansíveis dos modais |
| **Dialog** | `ui/dialog.tsx` | Base dos modais (Conta e Pagamento) |
| **Dropdown Menu** | `ui/dropdown-menu.tsx` | Menus de ações e filtros |
| **Input** | `ui/input.tsx` | Campos de texto e números |
| **Label** | `ui/label.tsx` | Labels dos formulários |
| **Select** | `ui/select.tsx` | Campos de seleção (dropdowns) |
| **Separator** | `ui/separator.tsx` | Linhas divisórias |
| **Table** | `ui/table.tsx` | Tabela principal de contas |
| **Textarea** | `ui/textarea.tsx` | Campo de notas/observações |

**Vantagens do Shadcn UI neste projeto**:
- ✅ Componentes vivem no seu código (`src/components/ui/`)
- ✅ Customização total sem limitações
- ✅ Acessibilidade garantida pelo Radix UI
- ✅ Consistência visual com Tailwind
- ✅ TypeScript nativo
- ✅ Dark mode funcionando perfeitamente
- ✅ Sem bundle size extra de bibliotecas

**Configuração**:
O arquivo `components.json` define as configurações do Shadcn UI:
```json
{
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/app/globals.css",
    "baseColor": "zinc"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

**Como adicionar novos componentes Shadcn UI**:
```bash
# Exemplo: adicionar componente de Checkbox
npx shadcn@latest add checkbox

# Lista todos os componentes disponíveis
npx shadcn@latest add
```

## 🎨 Contextos

### LanguageContext

Gerencia a internacionalização da aplicação.

```typescript
interface LanguageContextType {
  language: 'pt' | 'en' | 'es';
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}
```

**Idiomas Suportados**:
- Português (pt) - padrão
- Inglês (en)
- Espanhol (es)

**Uso**:
```typescript
const { t, language, setLanguage } = useLanguage();
<h1>{t('bills.title')}</h1>
```

### ThemeContext

Gerencia o tema (light/dark) com View Transitions API.

```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  mounted: boolean;
}
```

**Características**:
- Persiste preferência no localStorage
- Animação circular de transição
- Suporte a SSR (hidratação sem flash)

**Uso**:
```typescript
const { theme, toggleTheme, mounted } = useTheme();
<Button onClick={toggleTheme}>
  {theme === 'light' ? <Sun /> : <Moon />}
</Button>
```

### SidebarContext

Controla o estado de abertura/fechamento da sidebar.

```typescript
interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}
```

**Comportamento**:
- Mobile: inicia fechada
- Desktop: inicia aberta
- Responsivo automático

## 📐 Tipos e Interfaces

### Bill

Interface principal para contas a pagar/receber:

```typescript
interface Bill {
  id: string;
  code: string;
  competenceDate: string;
  dueDate: string;
  paymentInfo: string;
  status: 'Pendente' | 'Pago' | 'Vencido' | 'Cancelado';
  classification: {
    code: string;
    description: string;
  };
  participants: {
    name: string;
    secondary?: string;
  };
  installment: string;
  amount: number;
  details?: {
    document?: string;
    invoice?: string;
    accountGroup?: string;
    reference?: string;
    launchDate?: string;
    paymentDate?: string;
    creditor?: { id: string; name: string; };
    debtor?: { id: string; name: string; };
    accountingClassification?: { id: string; description: string; };
    costCenter?: { id: string; name: string; };
  };
}
```

### BillFilters

Interface para filtros aplicados:

```typescript
interface BillFilters {
  search: string;
  status: string;
  dateRange: {
    start: string;
    end: string;
  };
}
```

## 🎨 Estilização

### Design System

O projeto utiliza um design system baseado em variáveis CSS customizáveis:

**Cores (Light Mode)**:
```css
--background: 250 250 250;     /* #fafafa */
--foreground: 10 10 10;         /* #0a0a0a */
--primary: 59 130 246;          /* blue-500 */
--destructive: 239 68 68;       /* red-500 */
--border: 228 228 231;          /* zinc-200 */
```

**Cores (Dark Mode)**:
```css
--background: 23 23 23;         /* #171717 */
--foreground: 255 255 255;      /* #ffffff */
--primary: 59 130 246;          /* blue-500 */
--card: 22 22 22;               /* #161616 */
--border: 39 39 42;             /* zinc-800 */
```

### Customizações

**Scrollbar Personalizada**:
- Largura: 10px
- Cor (light): zinc-300
- Cor (dark): zinc-700
- Border radius: 10px

**View Transitions**:
- Animação circular de 700ms
- Easing: ease-in-out
- Origem: botão de empresa

**Rounded Corners**:
- Default: 0.5rem
- Small: 0.375rem
- Large: 0.625rem
- XL: 0.75rem

## 🌍 Internacionalização

### Estrutura de Traduções

```typescript
const translations = {
  pt: {
    'bills.title': 'Contas - A Pagar',
    'bills.search': 'Buscar',
    'bills.status': 'Status',
    // ...
  },
  en: {
    'bills.title': 'Bills - To Pay',
    'bills.search': 'Search',
    'bills.status': 'Status',
    // ...
  },
  es: {
    'bills.title': 'Cuentas - A Pagar',
    'bills.search': 'Buscar',
    'bills.status': 'Estado',
    // ...
  }
};
```

### Adicionando Novas Traduções

1. Abra `src/contexts/language-context.tsx`
2. Adicione a chave nos três idiomas
3. Use via hook: `t('chave.da.traducao')`

## ✅ Boas Práticas

### Código

- ✅ **TypeScript Strict Mode**: Todas as tipagens validadas
- ✅ **ESLint**: Zero erros e warnings
- ✅ **Componentes Reutilizáveis**: Padrão shadcn/ui
- ✅ **Hooks Personalizados**: Lógica encapsulada em contextos
- ✅ **Estado Imutável**: Uso de `useState` e spreads
- ✅ **Conditional Rendering**: Componentes otimizados

### Performance

- ⚡ **React Server Components**: Renderização no servidor
- ⚡ **Code Splitting**: Imports dinâmicos onde necessário
- ⚡ **Memoização**: Cálculos otimizados
- ⚡ **Lazy Loading**: Modais carregados sob demanda

### UX/UI

- 🎨 **Feedback Visual**: Loading states e transições
- 🎨 **Responsividade**: Mobile-first approach
- 🎨 **Acessibilidade**: ARIA labels e navegação por teclado
- 🎨 **Dark Mode**: Suporte completo com transições

### Organização

- 📁 **Estrutura Clara**: Separação por domínio
- 📁 **Nomenclatura Consistente**: camelCase para funções, PascalCase para componentes
- 📁 **Comentários Descritivos**: Código auto-documentado
- 📁 **Git Commits Semânticos**: Conventional Commits

## 🚢 Deploy

### Vercel (Recomendado)

1. Push do código para o GitHub
2. Importe o projeto na [Vercel](https://vercel.com/new)
3. Configure as variáveis de ambiente (se necessário)
4. Deploy automático a cada push

```bash
npx vercel
```

### Build Manual

```bash
npm run build
npm run start
```

O build otimizado estará em `.next/`

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz (não commitar):

```env
# Exemplo de variáveis
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_ENV=production
```

## 👨‍💻 Desenvolvimento Local

### Estrutura de Branches

- `main`: Código de produção
- `develop`: Desenvolvimento ativo
- `feature/*`: Novas funcionalidades
- `bugfix/*`: Correções de bugs

### Workflow

1. Clone o repositório
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Faça commits: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push: `git push origin feature/nova-funcionalidade`
5. Abra um Pull Request

### Commits Semânticos

```
feat: Nova funcionalidade
fix: Correção de bug
docs: Documentação
style: Formatação
refactor: Refatoração de código
test: Testes
chore: Tarefas de manutenção
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

### Checklist de PR

- [ ] Código segue os padrões do projeto
- [ ] `npm run lint` passa sem erros
- [ ] Código está tipado corretamente
- [ ] Componentes são responsivos
- [ ] Funciona em dark mode
- [ ] Documentação atualizada (se necessário)

## 📄 Licença

Este projeto foi desenvolvido para o desafio da Pass e é de propriedade exclusiva da empresa.

## 👤 Autor

Desenvolvido com ❤️ por **Manuel Sereno**

- Email: nelfsereno@gmail.com
- GitHub: [@ManuelSereno](https://github.com/ManuelSereno)

## 🙏 Agradecimentos

- **Pass**: Pela oportunidade do desafio
- **Vercel**: Pelo Next.js e Geist Font
- **Radix UI**: Pelos componentes acessíveis
- **Tailwind Labs**: Pelo Tailwind CSS
- **Shadcn**: Pela biblioteca de componentes

---

**Pass Finance** © 2025 - Sistema de Gestão Financeira

Desenvolvido para o Desafio Pass
