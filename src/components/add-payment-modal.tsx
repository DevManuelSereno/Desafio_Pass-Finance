'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  Receipt,
  ChevronRight,
  ChevronDown,
  X,
  StickyNote,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPaymentModal({ open, onOpenChange }: AddPaymentModalProps) {
  const [openSections, setOpenSections] = useState({
    general: true,
    notes: false,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-background">
          <DialogTitle className="text-lg font-semibold">Pagamento</DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
              <Info className="h-4 w-4" />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Data do Movimento
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
                        <SelectItem value="transferencia">
                          Transferência
                        </SelectItem>
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
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">
                        Saldo a Pagar
                      </Label>
                      <span className="text-sm font-semibold text-destructive">
                        -R$ 100,00
                      </span>
                    </div>
                    <Separator />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground font-semibold">
                      Valor
                    </Label>
                    <Input
                      type="text"
                      placeholder="R$ 0,00"
                      className="h-9 font-medium"
                    />
                  </div>
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
