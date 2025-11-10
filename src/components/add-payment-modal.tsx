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
  Info,
  ChevronRight,
  X,
  StickyNote,
  Store,
  Calendar,
  DollarSign,
  AlertCircle,
  Upload,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPaymentModal({ open, onOpenChange }: AddPaymentModalProps) {
  const [openSections, setOpenSections] = useState({
    general: true,
    participants: true,
    financial: true,
    installments: false,
    values: true,
    files: false,
    notes: false,
  });

  // Form state
  const [hasInstallments, setHasInstallments] = useState(false);
  const [numInstallments, setNumInstallments] = useState(1);
  const [totalValue, setTotalValue] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [interest, setInterest] = useState(0);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-lg font-semibold">Novo Pagamento</DialogTitle>
            {hasInstallments && (
              <Badge variant="secondary">
                {numInstallments}x de {formatCurrency(installmentValue)}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg cursor-pointer">
              <Info className="h-4 w-4" />
            </Button>
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

        {/* Body - Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] px-6 py-4 space-y-0">
          {/* Dados Gerais */}
          <Collapsible
            open={openSections.general}
            onOpenChange={() => toggleSection('general')}
          >
            <div className="py-4">
              <CollapsibleTrigger className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity cursor-pointer">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Tipo de Operação
                    </Label>
                    <Select defaultValue="pagar">
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pagar">Contas a Pagar</SelectItem>
                        <SelectItem value="receber">Contas a Receber</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Data de Vencimento
                    </Label>
                    <Input type="date" className="h-9" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Data de Competência
                    </Label>
                    <Input type="date" className="h-9" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Caixa/Conta (f180511)
                    </Label>
                    <Select>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="caixa1">
                          Caixa Principal
                        </SelectItem>
                        <SelectItem value="caixa2">Banco do Brasil</SelectItem>
                        <SelectItem value="caixa3">Bradesco</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Forma de Pagamento (f180506)
                    </Label>
                    <Select>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dinheiro">Dinheiro</SelectItem>
                        <SelectItem value="cartao">Cartão</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="transferencia">Transferência</SelectItem>
                        <SelectItem value="cheque">Cheque</SelectItem>
                        <SelectItem value="boleto">Boleto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Classificação Gerencial (f180518)
                    </Label>
                    <Select>
                      <SelectTrigger className="h-9">
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
                  <div className="space-y-2 md:col-span-2 lg:col-span-3">
                    <Label className="text-xs text-muted-foreground">
                      Descrição/Histórico
                    </Label>
                    <Input
                      placeholder="Ex: Pagamento de fornecedor, Compra de materiais..."
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
              <CollapsibleTrigger className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity cursor-pointer">
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
                      Credor (f180515)
                    </Label>
                    <Select>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecionar fornecedor..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Injetec</SelectItem>
                        <SelectItem value="2">Fornecedor ABC Ltda</SelectItem>
                        <SelectItem value="3">Tech Solutions</SelectItem>
                        <SelectItem value="4">Material de Escritório SA</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Quem você está pagando
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Devedor (f1204)
                    </Label>
                    <Select>
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Selecionar devedor..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Amorim Cortinas</SelectItem>
                        <SelectItem value="2">Empresa Matriz</SelectItem>
                        <SelectItem value="3">Filial São Paulo</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Quem é o responsável pelo pagamento
                    </p>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Info className="h-4 w-4 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">
                        <strong>Dica:</strong> O Credor é quem receberá o pagamento. O Devedor é quem está realizando o pagamento.
                      </p>
                    </div>
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
              <CollapsibleTrigger className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity cursor-pointer">
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    openSections.financial && 'rotate-90'
                  )}
                />
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Dados Financeiros</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="space-y-4">
                  {/* Parcelamento */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="hasInstallments"
                        checked={hasInstallments}
                        onChange={(e) => setHasInstallments(e.target.checked)}
                        className="h-4 w-4 rounded-[5px] cursor-pointer bg-white dark:bg-black border border-zinc-400/30 dark:border-zinc-500/30 checked:bg-black dark:checked:bg-white checked:border-black dark:checked:border-white appearance-none checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgNEw0LjUgNy41TDExIDEiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] dark:checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDEyIDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgNEw0LjUgNy41TDExIDEiIHN0cm9rZT0iYmxhY2siIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+')] bg-center bg-no-repeat flex-shrink-0"
                      />
                      <Label htmlFor="hasInstallments" className="text-sm font-medium cursor-pointer">
                        Pagamento parcelado
                      </Label>
                    </div>
                    
                    {hasInstallments && (
                      <div className="ml-6 space-y-4 p-4 bg-muted/30 rounded-lg border">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                              Número de Parcelas
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              max="360"
                              value={numInstallments}
                              onChange={(e) => setNumInstallments(parseInt(e.target.value) || 1)}
                              className="h-9"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                              Periodicidade
                            </Label>
                            <Select defaultValue="mensal">
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="semanal">Semanal</SelectItem>
                                <SelectItem value="quinzenal">Quinzenal</SelectItem>
                                <SelectItem value="mensal">Mensal</SelectItem>
                                <SelectItem value="bimestral">Bimestral</SelectItem>
                                <SelectItem value="trimestral">Trimestral</SelectItem>
                                <SelectItem value="semestral">Semestral</SelectItem>
                                <SelectItem value="anual">Anual</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">
                              Primeira Parcela
                            </Label>
                            <Input type="date" className="h-9" />
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
                          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                              Parcelamento Configurado
                            </p>
                            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                              Serão geradas {numInstallments} parcelas de {formatCurrency(installmentValue)} cada.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Centro de Custo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Centro de Custo (f1341)
                      </Label>
                      <Select>
                        <SelectTrigger className="h-9">
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
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Projeto/Departamento
                      </Label>
                      <Select>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Selecionar..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Projeto A</SelectItem>
                          <SelectItem value="2">Projeto B</SelectItem>
                          <SelectItem value="3">TI</SelectItem>
                          <SelectItem value="4">RH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          <Separator />

          {/* Valores */}
          <Collapsible
            open={openSections.values}
            onOpenChange={() => toggleSection('values')}
          >
            <div className="py-4">
              <CollapsibleTrigger className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity cursor-pointer">
                <ChevronRight
                  className={cn(
                    'h-4 w-4 transition-transform',
                    openSections.values && 'rotate-90'
                  )}
                />
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold">Valores</h3>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground font-semibold">
                        Valor Principal *
                      </Label>
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
                      <Label className="text-xs text-muted-foreground">
                        Juros/Multa (+)
                      </Label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={interest || ''}
                        onChange={(e) => setInterest(parseFloat(e.target.value) || 0)}
                        className="h-9"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Resumo de Valores */}
                  <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valor Principal:</span>
                      <span className="font-medium">{formatCurrency(totalValue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Desconto:</span>
                      <span className="font-medium text-green-600">- {formatCurrency(discount)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Juros/Multa:</span>
                      <span className="font-medium text-red-600">+ {formatCurrency(interest)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-base">
                      <span className="font-semibold">VALOR TOTAL:</span>
                      <span className="font-bold text-lg">
                        {formatCurrency(totalValue - discount + interest)}
                      </span>
                    </div>
                    {hasInstallments && (
                      <div className="flex justify-between text-sm pt-2 border-t">
                        <span className="text-muted-foreground">Valor por parcela:</span>
                        <span className="font-medium">
                          {numInstallments}x de {formatCurrency(installmentValue)}
                        </span>
                      </div>
                    )}
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
              <CollapsibleTrigger className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity cursor-pointer">
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
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer border-border"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add('border-primary', 'bg-muted/50');
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove('border-primary', 'bg-muted/50');
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove('border-primary', 'bg-muted/50');
                    // Handle file drop logic here
                  }}
                >
                  <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Clique aqui para inserir anexos
                  </p>
                  <p className="text-xs text-muted-foreground">
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
              <CollapsibleTrigger className="flex items-center gap-2 w-full hover:opacity-70 transition-opacity cursor-pointer">
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
                  className="min-h-[100px]"
                />
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t bg-background">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button className="gap-2">
            Cadastrar
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
