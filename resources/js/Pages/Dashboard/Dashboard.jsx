import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Card,
    CardContent,
} from "@/Components/ui/card";

import React from 'react';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

import Summary from '@/Components/Summary';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { Button } from '@/Components/ui/button';
import { RefreshCw } from 'lucide-react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
export default function Dashboard({
    auth,
    revenue = 0,
    roas = 0,
    marketing = 0,
    profit = 0,
    profitMargin = 0,
    roi = 0,
    arpu = 0,
    refund = 0,
    approvedPurchases = 0,
    pendingPurchases = 0,
    cpa = 0,
    avgTicket = 0,
    taxes = 0,
    chartData = [],
    productRanking = [],
    cancelledPurchases = 0,
    expiredPurchases = 0,
    pixCount = 0,
    boletoCount = 0,
    cartaoCount = 0,
    error = "" }) {

    const [loading, setLoading] = useState(false);

    const handleRefresh = () => {
        setLoading(true);
        router.post(route('dashboard.refresh'), {}, {
            onFinish: () => setLoading(false),
        });
    };

    const paymentData = [
        { name: 'Pix', value: pixCount },
        { name: 'Cartão de Crédito', value: cartaoCount },
        { name: 'Boleto Bancário', value: boletoCount },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    const processedChartData = chartData.map(dataPoint => ({
        date: dataPoint.date,
        positiveProfit: dataPoint.profit >= 0 ? dataPoint.profit : 0,
        negativeProfit: dataPoint.profit < 0 ? Math.abs(dataPoint.profit) : 0,
    }));
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<Summary />}
        >
            <Head title="Dashboard" />
            {error && <p>{error}</p>}
       
            <div className="py-2">
                <div className="max-w-full mx-auto sm:px-0 lg:px-8 px-6">
                <div className="flex justify-end mb-4">
                <Button onClick={handleRefresh} disabled={loading}>
                    {loading ? 'Atualizando...' : 'Atualizar'}
                    <RefreshCw className="ml-2 h-4 w-4" />
                </Button>
            </div>
                    <div className="w-full md:max-w-7xl mx-auto sm:px-6 lg:px-8 md:grid md:grid-cols-4 md:grid-flow-row md:gap-4 lg:grid lg:grid-cols-4 lg:grid-flow-row flex flex-col gap-4 rounded-md py-8">
                        {/* Receita */}
                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Receita</p>
                                <h1 className='text-primary text-[24px] font-bold'>R$ {revenue.toFixed(2)}</h1>
                            </CardContent>
                        </Card>

                        {/* ROAS */}
                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>ROAS</p>
                                <h1 className='text-primary text-[24px] font-[700]'>{roas.toFixed(2)}</h1>
                            </CardContent>
                        </Card>

                        {/* Investimento em Marketing */}
                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[14px]'>Investimento em Marketing</p>
                                <h1 className='text-primary text-[24px] font-[700]'>R$ {marketing.toFixed(2)}</h1>
                            </CardContent>
                        </Card>

                        {/* Lucro */}
                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Lucro</p>
                                <h1 className='text-primary text-[24px] font-[700]'>R$ {profit.toFixed(2)}</h1>
                            </CardContent>
                        </Card>

                        {/* Resumo Financeiro - Gráfico */}
                        <Card className="lg:col-span-3 lg:row-span-4 md:col-span-3 md:row-span-3 flex flex-col justify-center">
    <CardContent>
        <p className='text-xl mb-10'>Resumo Financeiro</p>
        <ResponsiveContainer width="99%" height={400}>
            <AreaChart
                data={processedChartData} // Utilize os dados processados
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" className='dark:opacity-20' />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                
                {/* Área para Valores Positivos */}
                <Area
                    type="monotone"
                    dataKey="positiveProfit"
                    stroke="#22c55e" // Verde para lucro positivo
                    fill="#22c55e"
                    name="Lucro Positivo"
                />
                
                {/* Área para Valores Negativos */}
                <Area
                    type="monotone"
                    dataKey="negativeProfit"
                    stroke="#ef4444" // Vermelho para lucro negativo
                    fill="#ef4444"
                    name="Lucro Negativo"
                />
            </AreaChart>
        </ResponsiveContainer>
    </CardContent>
</Card>

                        {/* Margem de Lucro */}
                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Margem de Lucro</p>
                                <h1 className='text-primary text-[24px] font-[700]'>{profitMargin.toFixed(2)}%</h1>
                            </CardContent>
                        </Card>

                        {/* ROI */}
                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>ROI</p>
                                <h1 className='text-primary text-[24px] font-[700]'>{roi.toFixed(2)}%</h1>
                            </CardContent>
                        </Card>

                        {/* ARPU */}
                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>ARPU</p>
                                <h1 className='text-primary text-[24px] font-[700]'>R$ {arpu.toFixed(2)}</h1>
                            </CardContent>
                        </Card>

                        {/* Reembolso */}
                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Reembolso</p>
                                <h1 className='text-primary text-[24px] font-[700]'>{refund}%</h1>
                            </CardContent>
                        </Card>

                        {/* Compras aprovadas */}
                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Compras aprovadas</p>
                                <h1 className='text-primary text-[24px] font-[700]'>{approvedPurchases}</h1>
                            </CardContent>
                        </Card>

                        {/* Compras pendentes */}
                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Compras pendentes</p>
                                <h1 className='text-primary text-[24px] font-[700]'>{pendingPurchases}</h1>
                            </CardContent>
                        </Card>

                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Compras canceladas</p>
                                <h1 className='text-primary text-[24px] font-[700]'>{cancelledPurchases}</h1>
                            </CardContent>
                        </Card>


                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Compras expiradas</p>
                                <h1 className='text-primary text-[24px] font-[700]'>{expiredPurchases}</h1>
                            </CardContent>


                        </Card>
                        {/* Custo por aquisição */}
                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Custo por aquisição</p>
                                <h1 className='text-primary text-[24px] font-[700]'>R$ {cpa.toFixed(2)}</h1>
                            </CardContent>
                        </Card>

                        {/* Ticket Médio */}
                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Ticket Médio</p>
                                <h1 className='text-primary text-[24px] font-[700]'>R$ {avgTicket.toFixed(2)}</h1>
                            </CardContent>
                        </Card>

                        {/* Taxas e impostos */}
                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Taxas e impostos</p>
                                <h1 className='text-primary text-[24px] font-[700]'>R$ {taxes.toFixed(2)}</h1>
                            </CardContent>
                        </Card>

                        {/* Donut Chart de Formas de Pagamento */}
                        <Card className="h-68">
                            <CardContent>
                                <p className='text-xl mb-4'>Formas de Pagamento</p>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={paymentData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={60}
                                            innerRadius={20} // Define o raio interno para transformar o PieChart em Donut Chart
                                            fill="#8884d8"
                                            label
                                        >
                                            {paymentData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Ranking de Produtos */}
                    <div className='max-w-7xl mx-auto sm:px-6 lg:px-8 mt-2 rounded-md py-4'>
                        <h1 className="text-xl mb-4 font-semibold text-card-foreground">Ranking de Produtos</h1>
                        <div className='border border-border rounded-md bg-card'>
                            <Table className="text-card-foreground">
                                <TableHeader className="text-center rounded-t-md">
                                    <TableRow>
                                        <TableHead className="text-center">Nome</TableHead>
                                        <TableHead className="text-center">Receita</TableHead>
                                        <TableHead className="text-center">Vendas Concluídas</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {productRanking.map((product, index) => (
                                        <TableRow key={index}>
                                            <TableCell className="font-medium text-center border-r">{product.product_name}</TableCell>
                                            <TableCell className="text-center border-r">R$ {product.revenue.toFixed(2)}</TableCell>
                                            <TableCell className="text-center">{product.sales}</TableCell>
                                        </TableRow>
                                    ))}
                                    {productRanking.length === 0 && (
                                        <TableRow>
                                            <TableCell className="text-center" colSpan="3">Nenhum dado disponível</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}