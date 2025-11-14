'use client';

import { useState, useEffect } from 'react';
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
  TooltipProvider,
} from '@/components/ui/tooltip';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
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
  AlertCircle,
} from 'lucide-react';

interface AccountPayableModalProps {
  bill: Bill | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPayment?: () => void;
  onSuccess?: () => void;
}

export function AccountPayableModal({
  bill,
  open,
  onOpenChange,
  onAddPayment,
  onSuccess,
}: AccountPayableModalProps) {
  // State for editable fields
  const [isEditing, setIsEditing] = useState(false);
  const [status, setStatus] = useState('PENDENTE');
  const [quitacao, setQuitacao] = useState('');
  const [documentoContrato, setDocumentoContrato] = useState('');
  const [fatura, setFatura] = useState('');
  const [contaGrupo, setContaGrupo] = useState('');
  const [referencia, setReferencia] = useState('');
  const [palavrasChave, setPalavrasChave] = useState('');
  const [classificacaoContabil, setClassificacaoContabil] = useState('');
  const [classificacaoGerencial, setClassificacaoGerencial] = useState('');
  const [centroCusto, setCentroCusto] = useState('');
  const [competencia, setCompetencia] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [vencimentoAlterado, setVencimentoAlterado] = useState('');
  const [numeroParcela, setNumeroParcela] = useState(1);
  const [totalParcelas, setTotalParcelas] = useState(1);
  const [notas, setNotas] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Update state when bill changes
  useEffect(() => {
    if (bill) {
      const statusMap: Record<string, string> = {
        'Pendente': 'PENDENTE',
        'Pago': 'PAGO',
        'Vencido': 'ATRASADO',
        'Cancelado': 'CANCELADO',
      };
      setStatus(statusMap[bill.status] || 'PENDENTE');
      setQuitacao('');
      setDocumentoContrato(bill.details?.document || '');
      setFatura(bill.details?.invoice || '');
      setContaGrupo(bill.details?.accountGroup || '');
      setReferencia(bill.details?.reference || '');
      setPalavrasChave('');
      setClassificacaoContabil(bill.classification?.code || '');
      setClassificacaoGerencial(bill.classification?.description || '');
      setCentroCusto(bill.details?.costCenter?.name || '');
      
      // Parse dates
      const parseDate = (dateStr: string) => {
        if (!dateStr) return '';
        const parts = dateStr.split('/');
        if (parts.length === 3) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return dateStr;
      };
      
      setCompetencia(parseDate(bill.competenceDate));
      setVencimento(parseDate(bill.dueDate));
      setVencimentoAlterado('');
      
      // Parse installments
      const installmentParts = bill.installment.split('/');
      setNumeroParcela(parseInt(installmentParts[0]) || 1);
      setTotalParcelas(parseInt(installmentParts[1]) || 1);
      
      setNotas('');
      setIsEditing(false);
      setError(null);
    }
  }, [bill]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const handleUpdate = async () => {
    if (!bill) return;

    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        status,
        quitacao: quitacao || null,
        documentoContrato: documentoContrato || null,
        fatura: fatura || null,
        contaGrupo: contaGrupo || null,
        referencia: referencia || null,
        palavrasChave: palavrasChave ? palavrasChave.split(',').map(k => k.trim()) : [],
        classificacaoContabil: classificacaoContabil || null,
        classificacaoGerencial: classificacaoGerencial || null,
        centroCusto: centroCusto || null,
        competencia: competencia || undefined,
        vencimento: vencimento || undefined,
        vencimentoAlterado: vencimentoAlterado || null,
        numeroParcela,
        totalParcelas,
        notas: notas || null,
      };

      const response = await fetch(`/api/contas/${bill.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar conta');
      }

      // Success!
      setIsEditing(false);
      
      // Call onSuccess before closing modal to ensure data refresh
      if (onSuccess) {
        await onSuccess();
      }
      
      // Small delay to ensure UI updates
      setTimeout(() => {
        onOpenChange(false); // Close modal
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!bill) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/contas/${bill.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir pagamento');
      }

      // Fechar o diálogo de confirmação e o modal
      setShowDeleteDialog(false);
      onOpenChange(false);
      
      // Atualizar a lista
      if (onSuccess) {
        await onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir pagamento');
    } finally {
      setIsDeleting(false);
    }
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
                  <DropdownMenuItem
                    className="gap-2 cursor-pointer"
                    onClick={() => setIsEditing(true)}
                  >
                    <Pencil className="h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 text-destructive cursor-pointer"
                    onClick={() => setShowDeleteDialog(true)}
                  >
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
                      value={quitacao}
                      onChange={(e) => { setQuitacao(e.target.value); setIsEditing(true); }}
                      placeholder="Indefinido"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Status</Label>
                    <Select value={status} onValueChange={(value) => { setStatus(value); setIsEditing(true); }}>
                      <SelectTrigger className="h-9 cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDENTE">Pendente</SelectItem>
                        <SelectItem value="PAGO">Pago</SelectItem>
                        <SelectItem value="ATRASADO">Atrasado</SelectItem>
                        <SelectItem value="CANCELADO">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Documento/Contrato
                    </Label>
                    <Input
                      value={documentoContrato}
                      onChange={(e) => { setDocumentoContrato(e.target.value); setIsEditing(true); }}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Fatura</Label>
                    <Input
                      value={fatura}
                      onChange={(e) => { setFatura(e.target.value); setIsEditing(true); }}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Conta/Grupo
                    </Label>
                    <Input
                      value={contaGrupo}
                      onChange={(e) => { setContaGrupo(e.target.value); setIsEditing(true); }}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Referência
                    </Label>
                    <Input
                      value={referencia}
                      onChange={(e) => { setReferencia(e.target.value); setIsEditing(true); }}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs text-muted-foreground">
                      Palavra-chave
                    </Label>
                    <Input
                      value={palavrasChave}
                      onChange={(e) => { setPalavrasChave(e.target.value); setIsEditing(true); }}
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
                    <Input
                      value={bill.details?.creditor?.name || 'N/A'}
                      readOnly
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Devedor
                    </Label>
                    <Input
                      value={bill.details?.debtor?.name || 'N/A'}
                      readOnly
                      className="h-9"
                    />
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
                    <Input
                      value={classificacaoContabil}
                      onChange={(e) => { setClassificacaoContabil(e.target.value); setIsEditing(true); }}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Classificação Gerencial
                    </Label>
                    <Input
                      value={classificacaoGerencial}
                      onChange={(e) => { setClassificacaoGerencial(e.target.value); setIsEditing(true); }}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Centro de Custo
                    </Label>
                    <Input
                      value={centroCusto}
                      onChange={(e) => { setCentroCusto(e.target.value); setIsEditing(true); }}
                      className="h-9"
                    />
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
                      value={competencia}
                      onChange={(e) => { setCompetencia(e.target.value); setIsEditing(true); }}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Vencimento
                    </Label>
                    <Input
                      type="date"
                      value={vencimento}
                      onChange={(e) => { setVencimento(e.target.value); setIsEditing(true); }}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Vencimento Alterado
                    </Label>
                    <Input 
                      type="date" 
                      value={vencimentoAlterado}
                      onChange={(e) => { setVencimentoAlterado(e.target.value); setIsEditing(true); }}
                      placeholder="Indefinido" 
                      className="h-9" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Nº da Parcela
                    </Label>
                    <Input
                      type="number"
                      value={numeroParcela}
                      onChange={(e) => { setNumeroParcela(parseInt(e.target.value) || 1); setIsEditing(true); }}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Qtd. Total de Parcelas
                    </Label>
                    <Input
                      type="number"
                      value={totalParcelas}
                      onChange={(e) => { setTotalParcelas(parseInt(e.target.value) || 1); setIsEditing(true); }}
                      className="h-9"
                    />
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
                value={notas}
                onChange={(e) => { setNotas(e.target.value); setIsEditing(true); }}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* Error Message */}
        {error && (
          <div className="px-6 py-3 bg-destructive/10 border-t border-destructive/20">
            <div className="flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 z-10 flex items-center justify-between px-6 py-4 border-t bg-background">
          <Button variant="ghost" className="cursor-pointer" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button 
            className="gap-2 bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
            onClick={handleUpdate}
            disabled={isSubmitting || !isEditing}
          >
            {isSubmitting ? 'Atualizando...' : 'Atualizar'}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    <DeleteConfirmationDialog
      open={showDeleteDialog}
      onOpenChange={setShowDeleteDialog}
      onConfirm={handleDelete}
      isDeleting={isDeleting}
      title="Excluir pagamento?"
      description={`Tem certeza que deseja excluir o pagamento ${bill?.id.padStart(6, '0')}? Esta ação não pode ser desfeita.`}
    />
    </TooltipProvider>
  );
}
