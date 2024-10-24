import { Button } from '@/Components/ui/button';
import Campanhas from './Campanhas'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
export default function Contas({auth, accountsData}) {
    console.log(accountsData)
    return(
        <Campanhas auth={auth}>
             <div className='bg-card w-full'>
                <div className='flex w-full justify-end items-center border-b border-border py-4'>
                    <div className='flex gap-2 px-4 items-center'>
                        <p className='text-muted-foreground text-sm'>Atualizado agora a pouco</p>
                        
                        <Button className="font-semibold">Atualizar</Button>
                    </div>
                </div>

                <div className='w-full'>
                <div className="flex justify-center pt-2 px-8 text-muted-foreground text-[10px] gap-4 items-end md:text-xs">
                    <div>
                        <label htmlFor="">Nome do Conjunto</label>
                        <input type="text" placeholder="Pesquisar" className="rounded-md w-full p-2 border border-border bg-card text-card-foreground focus:border-ring focus:ring-ring"/>
                    </div>

                    <div>
                        <label htmlFor="">Status do Conjunto</label>
                        <input type="text" placeholder="Pesquisar" className="rounded-md w-full p-2 border border-border bg-card text-card-foreground"/>
                    </div>

                    <div>
                        <label htmlFor="">Período de Visualização</label>
                        <input type="text" placeholder="Pesquisar" className="rounded-md w-full p-2 border border-border bg-card text-card-foreground"/>
                    </div>

                    <div>
                        <label htmlFor="">Conta de Anúncio</label>
                        <input type="text" placeholder="Pesquisar" className="rounded-md w-full p-2 border border-border bg-card text-card-foreground"/>
                    </div>

                    <div>
                        <label htmlFor="">Produto</label>
                        <input type="text" placeholder="Pesquisar" className="rounded-md w-full p-2 border border-border bg-card text-card-foreground"/>
                    </div>
                </div>

                <div className='bg-card mt-4 border-t border-border overflow-y-scroll no-scrollbar'>
                        <Table className="text-card-foreground border-collapse" overflow={"no-scrollbar"}>
                            <TableHeader className="text-center rounded-t-md">
                                <TableRow className="">
                                        {/* Cabeçalhos das colunas */}
                                <TableHead className="text-center border-r border-collapse">Nome</TableHead>
                                <TableHead className="text-center border-r border-collapse">Vendas</TableHead>
                                <TableHead className="text-center border-r border-collapse">CPA</TableHead>
                                <TableHead className="text-center border-r border-collapse">GASTOS</TableHead>
                                <TableHead className="text-center border-r border-collapse">FATURAMENTO</TableHead>
                                <TableHead className="text-center border-r border-collapse">LUCRO</TableHead>
                                <TableHead className="text-center border-r border-collapse">ROAS</TableHead>
                                <TableHead className="text-center border-r border-collapse">MARGEM</TableHead>
                                <TableHead className="text-center border-r border-collapse">ROI</TableHead>
                                <TableHead className="text-center border-r border-collapse">IC</TableHead>
                                <TableHead className="text-center border-r border-collapse">CPI</TableHead>
                                <TableHead className="text-center border-r border-collapse">CPC</TableHead>
                                <TableHead className="text-center border-r border-collapse">CTR</TableHead>
                                <TableHead className="text-center border-r border-collapse">CPM</TableHead>
                                <TableHead className="text-center border-r border-collapse">Impressões</TableHead>
                                <TableHead className="text-center border-r border-collapse">Cliques</TableHead>
                                {/* ... outros cabeçalhos */}
                                </TableRow>
                            </TableHeader>
                            <TableBody className="shadow-md  ">
                                {Object.values(accountsData['dados']).map((campaign) => (
                                    <TableRow key={campaign.account_name}>
                                        <TableCell className="text-center text-xs border-r">{campaign.account_name}</TableCell>
                                        <TableCell className="text-center text-xs border-r">{campaign.vendas}</TableCell>
                                        <TableCell className="text-center text-xs border-r">R$ {campaign.cpa.toFixed(2)}</TableCell>
                                        <TableCell className="text-center text-xs border-r">R$ {campaign.gastos.toFixed(2)}</TableCell>
                                        <TableCell className="text-center text-xs border-r">R$ {campaign.faturamento.toFixed(2)}</TableCell>
                                        <TableCell className="text-center text-xs border-r">R$ {campaign.lucro.toFixed(2)}</TableCell>
                                        <TableCell className="text-center text-xs border-r">{campaign.roas.toFixed(2)}</TableCell>
                                        <TableCell className="text-center text-xs border-r">{campaign.margem.toFixed(2)}%</TableCell>
                                        <TableCell className="text-center text-xs border-r">R$ {campaign.roi.toFixed(2)}</TableCell>
                                        <TableCell className="text-center text-xs border-r">{campaign.ic > 0 ? campaign.ic.toFixed(2) : "N/A"}</TableCell>
                                        <TableCell className="text-center text-xs border-r">{campaign.cpi > 0 ? campaign.cpi.toFixed(2) : "N/A"}</TableCell>
                                        <TableCell className="text-center text-xs border-r">R$ {campaign.cpc.toFixed(2)}</TableCell>
                                        <TableCell className="text-center text-xs border-r">{parseFloat(campaign.ctr).toFixed(2)}%</TableCell>
                                        <TableCell className="text-center text-xs border-r">R$ {campaign.cpm.toFixed(2)}</TableCell>
                                        <TableCell className="text-center text-xs border-r">{campaign.impressões}</TableCell>
                                        <TableCell className="text-center text-xs border-r">{campaign.cliques}</TableCell>
                                    </TableRow>
                                ))}  
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </Campanhas>
    )
}