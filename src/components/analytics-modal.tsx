'use client';

import { Bill } from '@/types/bill';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X, BarChart3, CircleDot, DollarSign, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig 
} from '@/components/ui/chart';
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useMemo } from 'react';

interface AnalyticsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bills: Bill[];
}

export function AnalyticsModal({ open, onOpenChange, bills }: AnalyticsModalProps) {
  // Preparar dados para gráfico de status
  const statusData = useMemo(() => {
    const statusCount = bills.reduce((acc, bill) => {
      acc[bill.status] = (acc[bill.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCount).map(([status, count]) => ({
      status,
      count,
    }));
  }, [bills]);

  // Preparar dados para gráfico de valores por classificação
  const classificationData = useMemo(() => {
    const classificationValues = bills.reduce((acc, bill) => {
      const classification = bill.classification.description;
      acc[classification] = (acc[classification] || 0) + bill.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(classificationValues).map(([classification, total]) => ({
      classification,
      total: parseFloat(total.toFixed(2)),
    }));
  }, [bills]);

  // Preparar dados para gráfico de contas ao longo do tempo
  const timelineData = useMemo(() => {
    const monthlyData = bills.reduce((acc, bill) => {
      const date = new Date(bill.competenceDate.split('/').reverse().join('-'));
      const month = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!acc[month]) {
        acc[month] = { month, count: 0, total: 0 };
      }
      
      acc[month].count += 1;
      acc[month].total += bill.amount;
      
      return acc;
    }, {} as Record<string, { month: string; count: number; total: number }>);

    return Object.values(monthlyData).sort((a, b) => {
      const [monthA, yearA] = a.month.split('/').map(Number);
      const [monthB, yearB] = b.month.split('/').map(Number);
      return yearA === yearB ? monthA - monthB : yearA - yearB;
    });
  }, [bills]);

  // Preparar dados para gráfico de participantes
  const participantData = useMemo(() => {
    const participantValues = bills.reduce((acc, bill) => {
      const participant = bill.participants.name;
      acc[participant] = (acc[participant] || 0) + bill.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(participantValues)
      .map(([participant, total]) => ({
        participant,
        total: parseFloat(total.toFixed(2)),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Top 10 participantes
  }, [bills]);

  const COLORS = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  const statusChartConfig = {
    count: {
      label: 'Quantidade',
      color: 'hsl(220, 70%, 50%)',
    },
  } satisfies ChartConfig;

  const classificationChartConfig = {
    total: {
      label: 'Total (R$)',
      color: 'hsl(142, 76%, 36%)',
    },
  } satisfies ChartConfig;

  const timelineChartConfig = {
    count: {
      label: 'Quantidade',
      color: 'hsl(220, 70%, 50%)',
    },
    total: {
      label: 'Total (R$)',
      color: 'hsl(142, 76%, 36%)',
    },
  } satisfies ChartConfig;

  const participantChartConfig = {
    total: {
      label: 'Total (R$)',
      color: 'hsl(280, 70%, 50%)',
    },
  } satisfies ChartConfig;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const totalBills = bills.length;
  const statusPercentage = useMemo(() => {
    return statusData.map(item => ({
      ...item,
      percentage: ((item.count / totalBills) * 100).toFixed(1)
    }));
  }, [statusData, totalBills]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl w-[95vw] max-h-[90vh] p-0 gap-0 rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 flex-shrink-0">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-full bg-white dark:bg-[#161616] border border-zinc-200 dark:border-zinc-700">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle asChild>
                <h2 className="text-xl font-semibold">Análise de Contas</h2>
              </DialogTitle>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                Representação visual dos dados
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg -mt-1 -mr-1"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="px-6 flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800">
          <Tabs defaultValue="status" className="w-full flex flex-col">
            <TabsList className="h-auto bg-transparent p-0 gap-0 w-full justify-start">
              <TabsTrigger 
                value="status" 
                className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-sm font-medium transition-all hover:text-zinc-900 dark:hover:text-zinc-100 data-[state=active]:border-zinc-900 data-[state=active]:text-zinc-900 data-[state=active]:shadow-none dark:data-[state=active]:border-zinc-100 dark:data-[state=active]:text-zinc-100 data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400"
              >
                <div className="flex items-center gap-2">
                  <CircleDot className="h-4 w-4" />
                  Status
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="classification" 
                className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-sm font-medium transition-all hover:text-zinc-900 dark:hover:text-zinc-100 data-[state=active]:border-zinc-900 data-[state=active]:text-zinc-900 data-[state=active]:shadow-none dark:data-[state=active]:border-zinc-100 dark:data-[state=active]:text-zinc-100 data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400"
              >
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Classificação
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="timeline" 
                className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-sm font-medium transition-all hover:text-zinc-900 dark:hover:text-zinc-100 data-[state=active]:border-zinc-900 data-[state=active]:text-zinc-900 data-[state=active]:shadow-none dark:data-[state=active]:border-zinc-100 dark:data-[state=active]:text-zinc-100 data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Linha do Tempo
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="participants" 
                className="relative rounded-none border-b-2 border-transparent px-4 pb-3 pt-2 text-sm font-medium transition-all hover:text-zinc-900 dark:hover:text-zinc-100 data-[state=active]:border-zinc-900 data-[state=active]:text-zinc-900 data-[state=active]:shadow-none dark:data-[state=active]:border-zinc-100 dark:data-[state=active]:text-zinc-100 data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400"
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Participantes
                </div>
              </TabsTrigger>
            </TabsList>

            <div className="overflow-y-auto px-6" style={{ maxHeight: 'calc(90vh - 180px)' }}>
              <TabsContent value="status" className="mt-6 pb-6 data-[state=inactive]:hidden">
                <div className="space-y-1 mb-6">
                <h3 className="text-base font-semibold">Distribuição por Status</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Quantidade de contas em cada status
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="flex items-center justify-center">
                  <ChartContainer config={statusChartConfig} className="h-[280px] w-full max-w-[280px]">
                    <PieChart>
                      <ChartTooltip 
                        content={<ChartTooltipContent hideLabel />}
                        formatter={(value: any, name: string) => [
                          `${value} contas`,
                          name
                        ]}
                      />
                      <Pie
                        data={statusData}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                </div>
                <div className="space-y-3">
                  {statusPercentage.map((item, index) => (
                    <div key={item.status} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/50">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-sm flex-shrink-0" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm font-medium">{item.status}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-zinc-600 dark:text-zinc-400">{item.count} contas</span>
                        <span className="text-sm font-semibold min-w-[45px] text-right">{item.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                </div>
              </TabsContent>

              <TabsContent value="classification" className="mt-6 pb-6 data-[state=inactive]:hidden">
              <div className="space-y-1 mb-6">
                <h3 className="text-base font-semibold">Valores por Classificação</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Total de valores agrupados por classificação
                </p>
              </div>
              <ChartContainer config={classificationChartConfig} className="h-[400px] w-full">
              <BarChart data={classificationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="classification" 
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={[8, 8, 0, 0]} />
              </BarChart>
              </ChartContainer>
              </TabsContent>

              <TabsContent value="timeline" className="mt-6 pb-6 data-[state=inactive]:hidden">
              <div className="space-y-1 mb-6">
                <h3 className="text-base font-semibold">Evolução Temporal</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Quantidade e valor total das contas ao longo do tempo
                </p>
              </div>
              <ChartContainer config={timelineChartConfig} className="h-[400px] w-full">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="left"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any, name: string) => {
                    if (name === 'total') {
                      return formatCurrency(value);
                    }
                    return value;
                  }}
                />
                <ChartLegend content={(props) => <ChartLegendContent payload={props.payload} verticalAlign={props.verticalAlign} />} />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="count" 
                  stroke="var(--color-count)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="total" 
                  stroke="var(--color-total)" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
              </ChartContainer>
              </TabsContent>

              <TabsContent value="participants" className="mt-6 pb-6 data-[state=inactive]:hidden">
              <div className="space-y-1 mb-6">
                <h3 className="text-base font-semibold">Top 10 Participantes</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Participantes com maior valor total em contas
                </p>
              </div>
              <ChartContainer config={participantChartConfig} className="h-[400px] w-full">
              <BarChart data={participantData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  type="number"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => `R$ ${value}`}
                />
                <YAxis 
                  type="category"
                  dataKey="participant" 
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  width={150}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={[0, 8, 8, 0]} />
              </BarChart>
              </ChartContainer>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
