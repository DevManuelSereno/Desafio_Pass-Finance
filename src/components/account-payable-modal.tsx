'use client';

import { useState } from 'react';
import { Bill } from '@/types/bill';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
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
  Store,
  ChartNoAxesColumn,
  DollarSign,
  Receipt,
  FileText,
  StickyNote,
  ChevronDown,
  ChevronRight,
  X,
  MoreHorizontal,
  Upload,
  Search,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [openSections, setOpenSections] = useState({
    general: true,
    participants: true,
    accounting: true,
    financial: true,
    totals: true,
    payments: true,
    files: false,
    notes: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 gap-0">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b bg-background">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-lg font-semibold">
              Conta a Pagar - {bill.id.padStart(6, '0')}
            </DialogTitle>
            <Badge variant={getStatusVariant(bill.status)}>
              {bill.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <Info className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Body - Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4 space-y-0">
          {/* Dados Gerais */}
          <Collapsible
            open={openSections.general}
            onOpenChange={() => toggleSection('general')}
          >
            <div className="py-4">
              <CollapsibleTrigger className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity">
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    openSections.general && 'rotate-90'
                  )}
                />
                <Info className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Dados Gerais</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
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
                      <SelectTrigger className="h-9">
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
              </CollapsibleContent>
            </div>
          </Collapsible>

          <Separator />

          {/* Participantes */}
          <Collapsible
            open={openSections.participants}
            onOpenChange={() => toggleSection('participants')}
          >
            <div className="py-4">
              <CollapsibleTrigger className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity">
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    openSections.participants && 'rotate-90'
                  )}
                />
                <Store className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Participantes</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Credor ({bill.details?.creditor?.id || 'f180515'})
                    </Label>
                    <Select defaultValue={bill.details?.creditor?.name}>
                      <SelectTrigger className="h-9">
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
                      Devedor ({bill.details?.debtor?.id || 'f1204'})
                    </Label>
                    <Select defaultValue={bill.details?.debtor?.name}>
                      <SelectTrigger className="h-9">
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
              </CollapsibleContent>
            </div>
          </Collapsible>

          <Separator />

          {/* Contábil */}
          <Collapsible
            open={openSections.accounting}
            onOpenChange={() => toggleSection('accounting')}
          >
            <div className="py-4">
              <CollapsibleTrigger className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity">
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    openSections.accounting && 'rotate-90'
                  )}
                />
                <ChartNoAxesColumn className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Contábil</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Classificação Contábil (f180525)
                    </Label>
                    <Select>
                      <SelectTrigger className="h-9">
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
                      Classificação Gerencial (f180518)
                    </Label>
                    <Select
                      defaultValue={bill.details?.accountingClassification?.description}
                    >
                      <SelectTrigger className="h-9">
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
                      Centro de Custo (f1341)
                    </Label>
                    <Select defaultValue={bill.details?.costCenter?.name}>
                      <SelectTrigger className="h-9">
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
              </CollapsibleContent>
            </div>
          </Collapsible>

          <Separator />

          {/* Dados Financeiros */}
          <Collapsible
            open={openSections.financial}
            onOpenChange={() => toggleSection('financial')}
          >
            <div className="py-4">
              <CollapsibleTrigger className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity">
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    openSections.financial && 'rotate-90'
                  )}
                />
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Dados Financeiros</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
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
                      <SelectTrigger className="h-9">
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
                      <SelectTrigger className="h-9">
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
              </CollapsibleContent>
            </div>
          </Collapsible>

          <Separator />

          {/* Totais */}
          <Collapsible
            open={openSections.totals}
            onOpenChange={() => toggleSection('totals')}
          >
            <div className="py-4">
              <CollapsibleTrigger className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity">
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    openSections.totals && 'rotate-90'
                  )}
                />
                <Receipt className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Totais</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
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
              </CollapsibleContent>
            </div>
          </Collapsible>

          <Separator />

          {/* Pagamentos */}
          <Collapsible
            open={openSections.payments}
            onOpenChange={() => toggleSection('payments')}
          >
            <div className="py-4">
              <CollapsibleTrigger className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity">
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    openSections.payments && 'rotate-90'
                  )}
                />
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Pagamento</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4 space-y-3">
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
                          <input type="checkbox" className="h-4 w-4" />
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
              </CollapsibleContent>
            </div>
          </Collapsible>

          <Separator />

          {/* Arquivos */}
          <Collapsible
            open={openSections.files}
            onOpenChange={() => toggleSection('files')}
          >
            <div className="py-4">
              <CollapsibleTrigger className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity">
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    openSections.files && 'rotate-90'
                  )}
                />
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Arquivos</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Clique aqui para inserir anexos
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ou arraste e solte arquivos (.pdf, .txt, .xml)
                  </p>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          <Separator />

          {/* Notas */}
          <Collapsible
            open={openSections.notes}
            onOpenChange={() => toggleSection('notes')}
          >
            <div className="py-4">
              <CollapsibleTrigger className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity">
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    openSections.notes && 'rotate-90'
                  )}
                />
                <StickyNote className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Notas</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <Textarea
                  placeholder="Adicionar anotações..."
                  className="min-h-[120px]"
                />
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-between px-6 py-4 border-t bg-background">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button className="gap-2">
            Atualizar
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
