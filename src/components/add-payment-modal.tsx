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
import { DatePicker } from '@/components/ui/date-picker';
import { TagInput } from '@/components/ui/tag-input';
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
  onSuccess?: () => void;
}

export function AddPaymentModal({ open, onOpenChange, onSuccess }: AddPaymentModalProps) {
  // Form state - campos obrigatórios
  const [conta, setConta] = useState('');
  const [lancamento, setLancamento] = useState(new Date().toISOString().split('T')[0]);
  const [credor, setCredor] = useState('');
  const [devedor, setDevedor] = useState('');
  const [competencia, setCompetencia] = useState('');
  const [vencimento, setVencimento] = useState('');
  const [status, setStatus] = useState('PENDENTE');
  
  // Form state - campos opcionais
  const [quitacao, setQuitacao] = useState('');
  const [documentoContrato, setDocumentoContrato] = useState('');
  const [fatura, setFatura] = useState('');
  const [contaGrupo, setContaGrupo] = useState('');
  const [referencia, setReferencia] = useState('');
  const [palavrasChave, setPalavrasChave] = useState<string[]>([]);
  const [classificacaoContabil, setClassificacaoContabil] = useState('');
  const [classificacaoGerencial, setClassificacaoGerencial] = useState('');
  const [centroCusto, setCentroCusto] = useState('');
  const [vencimentoAlterado, setVencimentoAlterado] = useState('');
  const [numeroParcela, setNumeroParcela] = useState(1);
  const [previsao, setPrevisao] = useState('');
  const [transacao, setTransacao] = useState('');
  const [notas, setNotas] = useState('');
  
  // Form state - valores
  const [hasInstallments, setHasInstallments] = useState(false);
  const [numInstallments, setNumInstallments] = useState(1);
  const [totalValue, setTotalValue] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [interest, setInterest] = useState(0);
  
  // Loading and error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate final values
  const finalValue = totalValue - discount + interest;
  const installmentValue = hasInstallments && numInstallments > 0 ? finalValue / numInstallments : finalValue;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const resetForm = () => {
    setConta('');
    setLancamento(new Date().toISOString().split('T')[0]);
    setCredor('');
    setDevedor('');
    setCompetencia('');
    setVencimento('');
    setStatus('PENDENTE');
    setQuitacao('');
    setDocumentoContrato('');
    setFatura('');
    setContaGrupo('');
    setReferencia('');
    setPalavrasChave([]);
    setClassificacaoContabil('');
    setClassificacaoGerencial('');
    setCentroCusto('');
    setVencimentoAlterado('');
    setNumeroParcela(1);
    setNumInstallments(1);
    setHasInstallments(false);
    setPrevisao('');
    setTransacao('');
    setTotalValue(0);
    setDiscount(0);
    setInterest(0);
    setNotas('');
    setError(null);
  };

  const handleSubmit = async () => {
    setError(null);
    
    // Validação básica
    if (!conta || !credor || !devedor || !competencia || !vencimento || totalValue <= 0) {
      setError('Preencha todos os campos obrigatórios: Conta, Credor, Devedor, Competência, Vencimento e Valor');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const payload = {
        conta,
        lancamento: new Date(lancamento + 'T00:00:00').toISOString(),
        quitacao: quitacao ? new Date(quitacao + 'T00:00:00').toISOString() : null,
        status,
        documentoContrato: documentoContrato || null,
        fatura: fatura || null,
        contaGrupo: contaGrupo || null,
        referencia: referencia || null,
        palavrasChave: palavrasChave,
        credor,
        devedor,
        classificacaoContabil: classificacaoContabil || null,
        classificacaoGerencial: classificacaoGerencial || null,
        centroCusto: centroCusto || null,
        competencia,
        vencimento,
        vencimentoAlterado: vencimentoAlterado || null,
        numeroParcela,
        totalParcelas: numInstallments,
        previsao: previsao || null,
        transacao: transacao || null,
        valor: totalValue,
        desconto: discount,
        juros: interest,
      };
      
      const response = await fetch('/api/contas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao cadastrar conta');
      }
      
      // Sucesso!
      resetForm();
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setIsSubmitting(false);
    }
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Conta *</Label>
                      <Input
                        placeholder="Código da conta"
                        className="h-9"
                        value={conta}
                        onChange={(e) => setConta(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Status</Label>
                      <Select value={status} onValueChange={setStatus}>
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
                      <Label className="text-xs text-muted-foreground">Lançamento</Label>
                      <DatePicker
                        value={lancamento}
                        onChange={setLancamento}
                        placeholder="Selecionar data"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Quitação</Label>
                      <DatePicker
                        value={quitacao}
                        onChange={setQuitacao}
                        placeholder="Indefinido"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Documento/Contrato</Label>
                      <Input
                        placeholder="Indefinido"
                        className="h-9"
                        value={documentoContrato}
                        onChange={(e) => setDocumentoContrato(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Fatura</Label>
                      <Input
                        placeholder="Indefinido"
                        className="h-9"
                        value={fatura}
                        onChange={(e) => setFatura(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Conta/Grupo</Label>
                      <Input
                        placeholder="Selecionar..."
                        className="h-9"
                        value={contaGrupo}
                        onChange={(e) => setContaGrupo(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Referência</Label>
                      <Input
                        placeholder="Referência"
                        className="h-9"
                        value={referencia}
                        onChange={(e) => setReferencia(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-xs text-muted-foreground">Palavra-chave</Label>
                      <TagInput
                        value={palavrasChave}
                        onChange={setPalavrasChave}
                        placeholder="Adicionar tags..."
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
                      <Label className="text-xs text-muted-foreground">Credor *</Label>
                      <Input
                        placeholder="Nome do fornecedor"
                        className="h-9"
                        value={credor}
                        onChange={(e) => setCredor(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Devedor *</Label>
                      <Input
                        placeholder="Nome do devedor"
                        className="h-9"
                        value={devedor}
                        onChange={(e) => setDevedor(e.target.value)}
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
                        placeholder="Ex: 1.1.1.01.001"
                        className="h-9"
                        value={classificacaoContabil}
                        onChange={(e) => setClassificacaoContabil(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Classificação Gerencial
                      </Label>
                      <Input
                        placeholder="Ex: Operacional"
                        className="h-9"
                        value={classificacaoGerencial}
                        onChange={(e) => setClassificacaoGerencial(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Centro de Custo
                      </Label>
                      <Input
                        placeholder="Ex: Administrativo"
                        className="h-9"
                        value={centroCusto}
                        onChange={(e) => setCentroCusto(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Dados Financeiros */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Dados Financeiros</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Competência *
                      </Label>
                      <DatePicker
                        value={competencia}
                        onChange={setCompetencia}
                        placeholder="Selecionar data"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Vencimento *
                      </Label>
                      <DatePicker
                        value={vencimento}
                        onChange={setVencimento}
                        placeholder="Selecionar data"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Vencimento Alterado
                      </Label>
                      <DatePicker
                        value={vencimentoAlterado}
                        onChange={setVencimentoAlterado}
                        placeholder="Indefinido"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Nº da Parcela
                      </Label>
                      <Input
                        type="number"
                        value={numeroParcela}
                        onChange={(e) => setNumeroParcela(parseInt(e.target.value) || 1)}
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
                      <Input
                        placeholder="Previsão"
                        className="h-9"
                        value={previsao}
                        onChange={(e) => setPrevisao(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Transação</Label>
                      <Input
                        placeholder="Transação"
                        className="h-9"
                        value={transacao}
                        onChange={(e) => setTransacao(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Valores */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Valores</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
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
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
