import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/Components/ui/card";

import React from 'react';

import { Doughnut, Line } from 'react-chartjs-2';
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/Components/ui/table"
import Summary from '@/Components/Summary'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';




const data = [
    {
      name: 'Janeiro',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Fevereiro',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Março',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Abril',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Maio',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Junho',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Julho',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];
export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}    
            header={<Summary/>}        
        >
            <Head title="Dashboard" />

            <div className="py-2">
                <div className="max-w-full mx-auto sm:px-0 lg:px-8 px-6">
                <div className="w-full md:max-w-7xl mx-auto sm:px-6 lg:px-8 md:grid md:grid-cols-4 md:grid-flow-row md:gap-4 lg:grid lg:grid-cols-4 lg:grid-flow-row [&>div>div]:p-2  flex flex-col gap-4 rounded-md py-8">
                        <Card className="h-32">
                            <CardContent >
                                <p className='text-[16px]' >Receita</p>
                                <h1 className='text-primary text-[24px] font-bold'>R$0,00</h1>
                            </CardContent>
                        </Card>
                        
                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>ROAS</p>
                                <h1 className='text-primary text-[24px] font-[700]'>0</h1>
                            </CardContent>
                        </Card >

                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[14px]'>Investimento em Marketing</p>
                                <h1 className='text-primary text-[24px] font-[700]'>R$0,00</h1>
                            </CardContent>
                        </Card>

                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Lucro</p>
                                <h1 className='text-primary text-[24px] font-[700]'>R$0,00</h1>
                            </CardContent>
                        </Card>

                        <Card className="lg:col-span-3 lg:row-span-4 md:col-span-3 md:row-span-3 flex flex-col justify-center"> 
                            <CardContent>
                                <p className='text-xl mb-10'>Resumo Financeiro</p>
                             <ResponsiveContainer width="99%" height={400}>
            <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >

        
        <CartesianGrid strokeDasharray="3 3" className='dark:opacity-20'/>  
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone"  dataKey="uv" stroke="#22c55e" fill="#22c55e" className=''/>
          <Area type="monotone" dataKey="pv" stroke="#ff6b72" fill="#ff6b72" className=''/>
          <Area type="monotone" dataKey="amt" stroke="#ff9f43" fill="#ff9f43" className=''/>
        </AreaChart>
        </ResponsiveContainer>
       
                            </CardContent>
                        </Card>

                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Margem de Lucro</p>
                                <h1 className='text-primary text-[24px] font-[700]'>0%</h1>
                            </CardContent>
                        </Card>

                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>ROI</p>
                                <h1 className='text-primary text-[24px] font-[700]'>0%</h1>
                            </CardContent>
                        </Card>

                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>ARPU</p>
                                <h1 className='text-primary text-[24px] font-[700]'>R$0,00</h1>
                            </CardContent>
                        </Card>

                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Reembolso</p>
                                <h1 className='text-primary text-[24px] font-[700]'>0%</h1>
                            </CardContent>
                        </Card>

                        <Card className="row-span-3">
                            <CardContent>
                                <p>Cartões</p>
                                <p className='text-[#9ca3af]'>Conversão</p>
                                <h1 className='text-primary text-[24px] font-[700]'>R$0,00</h1>
                                
                                
                                    <p className='text-[#9ca3af]'>Aprovados</p>
                                    <p className='text-primary font-[700]'>R$0,00</p>
                                    <p className='text-[#9ca3af]'>Pendentes</p>
                                    <p className='text-primary font-[700]'>R$0,00</p>
                                    <p className='text-[#9ca3af]'>Cancelados</p>
                                    <p className='text-primary font-[700]'>R$0,00</p>
                                
                            </CardContent>
                        </Card>

                        <Card className="row-span-3">
                            <CardContent>
                                <p>Pix</p>
                                <p className='text-[#9ca3af]'>Conversão</p>
                                <h1 className='text-primary text-[24px] font-[700]'>R$0,00</h1>
                                
                                <p className='text-[#9ca3af]'>Aprovados</p>
                                <p className='text-primary font-[700]'>R$0,00</p>
                                <p className='text-[#9ca3af]'>Pendentes</p>
                                <p className='text-primary font-[700]'>R$0,00</p>
                                <p className='text-[#9ca3af]'>Cancelados</p>
                                <p className='text-primary font-[700]'>R$0,00</p>
                            </CardContent>
                        </Card>

                        <Card className="row-span-3">
                            <CardContent>
                                <p>Boletos</p>
                                <p className='text-[#9ca3af]'>Conversão</p>
                                <h1 className='text-primary text-[24px] font-[700]'>R$0,00</h1>
                               
                                <p className='text-[#9ca3af]'>Aprovados</p>
                                <p className='text-primary font-[700]'>R$0,00</p>
                                <p className='text-[#9ca3af]'>Pendentes</p>
                                <p className='text-primary font-[700]'>R$0,00</p>
                                <p className='text-[#9ca3af]'>Cancelados</p>
                                <p className='text-primary font-[700]'>R$0,00</p>
                            </CardContent>
                        </Card>

                        <Card className="h-auto">
                            <CardContent className="space-y-8">
                                <p className='text-[16px]'>% Compras aprovadas</p>
                                <p className='text-[#9ca3af]'>
                                    Pix: 
                                    <span className='text-primary font-[700]'>0%</span>
                                </p>
                                
                                <p className='text-[#9ca3af]'>
                                    Cartão: 
                                    <span className='text-primary font-[700]'>0%</span>
                                </p>

                                <p className='text-[#9ca3af]'>
                                    Boleto: 
                                    <span className='text-primary font-[700]'>0%</span>
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Compras aprovadas</p>
                                <h1 className='text-primary text-[24px] font-[700]'>0</h1>
                            </CardContent>
                        </Card>

                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Compras pendentes</p>
                                <h1 className='text-primary text-[24px] font-[700]'>0</h1>
                            </CardContent>
                        </Card>

                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Custo por aquisição</p>
                                <h1 className='text-primary text-[24px] font-[700]'>R$0,00</h1>
                            </CardContent>
                        </Card>

                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Ticket Médio</p>
                                <h1 className='text-primary text-[24px] font-[700]'>R$0,00</h1>
                            </CardContent>
                        </Card>

                        <Card className="h-32">
                            <CardContent>
                                <p className='text-[16px]'>Taxas e impostos</p>
                                <h1 className='text-primary text-[24px] font-[700]'>R$0,00</h1>
                            </CardContent>
                        </Card>
                </div>
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
                            <TableBody className="shadow-md  ">
                                <TableRow className="">
                                    <TableCell className="font-medium text-center border-r">INV001</TableCell>
                                    <TableCell className="text-center border-r">Paid</TableCell>
                                    <TableCell className="text-center ">R$0,00</TableCell>
                                </TableRow>  
                            </TableBody>
                        </Table>
                    </div>
                </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}


