import { Button } from "./ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
export const CampanhasContent = ({children}) => {
    return (
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
                                    <TableHead className="text-center border-r border-collapse">Status</TableHead>
                                    <TableHead className="text-center border-r border-collapse">Campanha</TableHead>
                                    <TableHead className="text-center border-r border-collapse">Orçamento</TableHead>
                                    <TableHead className="text-center border-r border-collapse">Vendas</TableHead>
                                    <TableHead className="text-center border-r border-collapse">CPA</TableHead>
                                    <TableHead className="text-center border-r border-collapse">Gastos</TableHead>
                                    <TableHead className="text-center border-r border-collapse">Faturamento</TableHead>
                                    <TableHead className="text-center border-r border-collapse">Lucro</TableHead>
                                    <TableHead className="text-center border-r border-collapse">Roas</TableHead>
                                    <TableHead className="text-center border-r border-collapse">Margem</TableHead>
                                    <TableHead className="text-center border-r border-collapse">ROI</TableHead>
                                    <TableHead className="text-center border-r border-collapse">IC</TableHead>
                                    <TableHead className="text-center border-r border-collapse">CPI</TableHead>
                                    <TableHead className="text-center border-r border-collapse">CPC</TableHead>
                                    <TableHead className="text-center border-r border-collapse">CTR</TableHead>
                                    <TableHead className="text-center border-r border-collapse">CPM</TableHead>
                                    <TableHead className="text-center border-r border-collapse">Impressões</TableHead>
                                    <TableHead className="text-center">Cliques</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody className="shadow-md  ">
                                <TableRow className="">
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center border-r">N/A</TableCell>
                                    <TableCell className="text-center ">N/A</TableCell>
                                </TableRow>   
                            </TableBody>
                        </Table>
                    </div>
                    {children}
                </div>
            </div>
    )
}