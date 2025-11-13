'use client';

import { useState } from 'react';
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
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Info,
  ChevronRight,
  X,
  DollarSign,
  AlertCircle,
  Upload,
  FileText,
  Banknote,
  MoreHorizontal,
  Pencil,
  Trash2,
} from 'lucide-react';

interface AddPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPaymentModal({ open, onOpenChange }: AddPaymentModalProps) {
  // Form state
  const [hasInstallments, setHasInstallments] = useState(false);
  const [numInstallments, setNumInstallments] = useState(1);
  const [totalValue, setTotalValue] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [interest, setInterest] = useState(0);

  // Calculate final values
  const finalValue = totalValue - discount + interest;
  const installmentValue = hasInstallments && numInstallments > 0 ? finalValue / numInstallments : finalValue;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

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
                    Novo Pagamento
                  </DialogTitle>
                  {hasInstallments && (
                    <Badge variant="secondary">
                      {numInstallments}x de {formatCurrency(installmentValue)}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Cadastro de nova conta a pagar
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
                    Limpar Formulário
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-destructive">
                    <Trash2 className="h-4 w-4" />
                    Cancelar
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
              <TabsTrigger value="adicionais" className="gap-2 cursor-pointer">
                <FileText className="h-4 w-4" />
                Adicionais
              </TabsTrigger>
            </TabsList>

            {/* Dados Gerais Tab */}
            <TabsContent value="dados-gerais" className="flex-1 overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-4 space-y-6">
              {/* Informações Gerais */}
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
                        placeholder="Código da conta"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Lançamento
                      </Label>
                      <Input
                        type="date"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Quitação
                      </Label>
                      <Input
                        type="date"
                        placeholder="Indefinido"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <Select defaultValue="Pendente">
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
                        placeholder="Indefinido"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Fatura</Label>
                      <Input
                        placeholder="Indefinido"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Conta/Grupo
                      </Label>
                      <Input
                        placeholder="Selecionar..."
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Referência
                      </Label>
                      <Input
                        placeholder="Referência"
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
                      <Select>
                        <SelectTrigger className="h-9 cursor-pointer">
                          <SelectValue placeholder="Selecionar fornecedor..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Injetec</SelectItem>
                          <SelectItem value="2">Fornecedor ABC Ltda</SelectItem>
                          <SelectItem value="3">Tech Solutions</SelectItem>
                          <SelectItem value="4">Material de Escritório SA</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Devedor
                      </Label>
                      <Select>
                        <SelectTrigger className="h-9 cursor-pointer">
                          <SelectValue placeholder="Selecionar devedor..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Amorim Cortinas</SelectItem>
                          <SelectItem value="2">Empresa Matriz</SelectItem>
                          <SelectItem value="3">Filial São Paulo</SelectItem>
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
                      <Select>
                        <SelectTrigger className="h-9 cursor-pointer">
                          <SelectValue placeholder="Selecionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">
                            1.1.1.01.001 - Caixa Fundo Fixo
                          </SelectItem>
                          <SelectItem value="2">
                            2.1.1.01.001 - Fornecedores
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Centro de Custo
                      </Label>
                      <Select>
                        <SelectTrigger className="h-9 cursor-pointer">
                          <SelectValue placeholder="Selecionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Administrativo</SelectItem>
                          <SelectItem value="2">Operacional</SelectItem>
                          <SelectItem value="3">Comercial</SelectItem>
                          <SelectItem value="4">Marketing</SelectItem>
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
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Vencimento
                      </Label>
                      <Input
                        type="date"
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
                        defaultValue="1"
                        placeholder="1"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Qtd. Total de Parcelas
                      </Label>
                      <Input
                        type="number"
                        value={hasInstallments ? numInstallments : ''}
                        onChange={(e) => {
                          setHasInstallments(true);
                          setNumInstallments(parseInt(e.target.value) || 1);
                        }}
                        placeholder="1"
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

              {/* Valores */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Valores</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Valor</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={totalValue || ''}
                        onChange={(e) => setTotalValue(parseFloat(e.target.value) || 0)}
                        className="h-9 font-medium"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Desconto (-)
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={discount || ''}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Juros (+)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={interest || ''}
                        onChange={(e) => setInterest(parseFloat(e.target.value) || 0)}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Total</Label>
                      <Input
                        value={formatCurrency(finalValue)}
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
                        value={`-${formatCurrency(finalValue)}`}
                        readOnly
                        className="h-9 font-bold text-destructive"
                      />
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
              Cadastrar
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
