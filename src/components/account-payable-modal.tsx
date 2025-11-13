'use client';

import { Bill } from '@/types/bill';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Info,
  DollarSign,
  Receipt,
  FileText,
  ChevronRight,
  X,
  MoreHorizontal,
  Upload,
  Search,
  Plus,
  Pencil,
  Trash2,
  Banknote,
} from 'lucide-react';

interface AccountPayableModalProps {
  bill: Bill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPayment?: () => void;
}

export function AccountPayableModal({
  bill,
  open,
  onOpenChange,
  onAddPayment,
}: AccountPayableModalProps) {

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Pago':
        return 'default';
      case 'Pendente':
        return 'secondary';
      case 'Vencido':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  if (!bill) return null;

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-start justify-between px-6 py-6 bg-background">
            <div className="flex items-start gap-4 flex-1">
              <div className="h-12 w-12 rounded-full bg-background border flex items-center justify-center flex-shrink-0">
                <Banknote className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex flex-col gap-1 flex-1">
                <div className="flex items-center gap-3">
                  <DialogTitle className="text-lg font-semibold">
                    Conta a Pagar
                  </DialogTitle>
                  <Badge variant={getStatusVariant(bill.status)}>
                    {bill.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  ID do pagamento: {bill.id.padStart(6, '0')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg cursor-pointer">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2">
                    <Pencil className="h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

        {/* Tabs */}
        <Tabs defaultValue="dados-gerais" className="flex-1 flex flex-col">
          <TabsList className="px-6 justify-start">
            <TabsTrigger value="dados-gerais" className="gap-2 cursor-pointer">
              <Info className="h-4 w-4" />
              Dados Gerais
            </TabsTrigger>
            <TabsTrigger value="dados-financeiros" className="gap-2 cursor-pointer">
              <DollarSign className="h-4 w-4" />
              Dados Financeiros
            </TabsTrigger>
            <TabsTrigger value="pagamentos" className="gap-2 cursor-pointer">
              <Receipt className="h-4 w-4" />
              Pagamentos
            </TabsTrigger>
            <TabsTrigger value="adicionais" className="gap-2 cursor-pointer">
              <FileText className="h-4 w-4" />
              Adicionais
            </TabsTrigger>
          </TabsList>

          {/* Dados Gerais Tab */}
          <TabsContent value="dados-gerais" className="flex-1 overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-4 space-y-6">
            {/* Informações da Conta */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                Dados Gerais
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Conta</Label>
                    <Input
                      value={bill.code.split('\n')[0]}
                      readOnly
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Lançamento
                    </Label>
                    <Input
                      value={bill.details?.launchDate || ''}
                      readOnly
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Quitação
                    </Label>
                    <Input
                      type="date"
                      defaultValue=""
                      placeholder="Indefinido"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Select defaultValue={bill.status}>
                      <SelectTrigger className="h-9 cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                        <SelectItem value="Pago">Pago</SelectItem>
                        <SelectItem value="Vencido">Vencido</SelectItem>
                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Documento/Contrato
                    </Label>
                    <Input
                      defaultValue={bill.details?.document || 'Indefinido'}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Fatura</Label>
                    <Input
                      defaultValue={bill.details?.invoice || 'Indefinido'}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Conta/Grupo
                    </Label>
                    <Input
                      defaultValue={bill.details?.accountGroup || ''}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Referência
                    </Label>
                    <Input
                      defaultValue={bill.details?.reference || ''}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs text-muted-foreground">
                      Palavra-chave
                    </Label>
                    <Input
                      placeholder="Adicionar tags..."
                      className="h-9"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Participantes */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Participantes</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Credor
                    </Label>
                    <Select defaultValue={bill.details?.creditor?.name}>
                      <SelectTrigger className="h-9 cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={bill.details?.creditor?.name || ''}>
                          {bill.details?.creditor?.name}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Devedor
                    </Label>
                    <Select defaultValue={bill.details?.debtor?.name}>
                      <SelectTrigger className="h-9 cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={bill.details?.debtor?.name || ''}>
                          {bill.details?.debtor?.name}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Dados Financeiros Tab */}
          <TabsContent value="dados-financeiros" className="flex-1 overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-4 space-y-6">
            {/* Contábil */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Contábil</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Classificação Contábil
                    </Label>
                    <Select>
                      <SelectTrigger className="h-9 cursor-pointer">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">
                          1.1.1.01.001 - Caixa Fundo Fixo
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Classificação Gerencial
                    </Label>
                    <Select
                      defaultValue={bill.details?.accountingClassification?.description}
                    >
                      <SelectTrigger className="h-9 cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          value={
                            bill.details?.accountingClassification?.description || ''
                          }
                        >
                          {bill.details?.accountingClassification?.id} -{' '}
                          {bill.details?.accountingClassification?.description}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Centro de Custo
                    </Label>
                    <Select defaultValue={bill.details?.costCenter?.name}>
                      <SelectTrigger className="h-9 cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={bill.details?.costCenter?.name || ''}>
                          {bill.details?.costCenter?.name}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Dados Financeiros */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Dados Financeiros</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Competência
                    </Label>
                    <Input
                      type="date"
                      defaultValue="2025-12-31"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Vencimento
                    </Label>
                    <Input
                      type="date"
                      defaultValue={bill.dueDate.split('/').reverse().join('-')}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Vencimento Alterado
                    </Label>
                    <Input type="date" placeholder="Indefinido" className="h-9" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Nº da Parcela
                    </Label>
                    <Input
                      type="number"
                      defaultValue={bill.installment.split('/')[0]}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Qtd. Total de Parcelas
                    </Label>
                    <Input
                      type="number"
                      defaultValue={bill.installment.split('/')[1]}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Previsão</Label>
                    <Select defaultValue="nao">
                      <SelectTrigger className="h-9 cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sim">Sim</SelectItem>
                        <SelectItem value="nao">Não</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Transação</Label>
                    <Select defaultValue="indefinido">
                      <SelectTrigger className="h-9 cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indefinido">Indefinido</SelectItem>
                        <SelectItem value="debito">Débito</SelectItem>
                        <SelectItem value="credito">Crédito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Pagamentos Tab */}
          <TabsContent value="pagamentos" className="flex-1 overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-4 space-y-6">
            {/* Totais */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Totais</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Valor</Label>
                    <Input
                      value={formatCurrency(bill.amount)}
                      readOnly
                      className="h-9 font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Desconto (-)
                    </Label>
                    <Input
                      value="R$ 0,00"
                      readOnly
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Juros (+)</Label>
                    <Input
                      value="R$ 0,00"
                      readOnly
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Total</Label>
                    <Input
                      value={formatCurrency(bill.amount)}
                      readOnly
                      className="h-9 font-bold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Valor Pago
                    </Label>
                    <Input
                      value="R$ 0,00"
                      readOnly
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Saldo</Label>
                    <Input
                      value={`-${formatCurrency(bill.amount)}`}
                      readOnly
                      className="h-9 font-bold text-destructive"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Pagamentos */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Pagamento</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="relative flex-1 max-w-xs">
                    <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                      placeholder="Buscar"
                      className="h-9 pl-8 text-sm"
                    />
                  </div>
                  <Button
                    size="sm"
                    className="h-9 gap-2"
                    onClick={onAddPayment}
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Adicionar Pagamento
                  </Button>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox />
                        </TableHead>
                        <TableHead className="text-xs">ID</TableHead>
                        <TableHead className="text-xs">Cheque Nº</TableHead>
                        <TableHead className="text-xs">Caixa</TableHead>
                        <TableHead className="text-xs">Classificação</TableHead>
                        <TableHead className="text-xs">Tipo</TableHead>
                        <TableHead className="text-xs text-right">Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <Info className="h-5 w-5 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Nenhum registro
                          </p>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                  <div className="border-t px-4 py-2 bg-muted/30">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total</span>
                      <span className="text-sm font-medium">R$ 0,00</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Adicionais Tab */}
          <TabsContent value="adicionais" className="flex-1 overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-4 space-y-6">
            {/* Arquivos */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Arquivos</h3>
              <div className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Clique aqui para inserir anexos
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ou arraste e solte arquivos (.pdf, .txt, .xml)
                  </p>
                </div>
              </div>
            </div>

            {/* Notas */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold">Notas</h3>
              <Textarea
                placeholder="Adicionar anotações..."
                className="min-h-[120px]"
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-between px-6 py-4 border-t bg-background">
          <Button variant="ghost" className="cursor-pointer" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button className="gap-2 bg-foreground text-background hover:bg-foreground/90 cursor-pointer">
            Atualizar
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </TooltipProvider>
  );
}
