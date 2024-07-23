import { Dropdown } from '@/Components/Dropdown/Dropdown';
import {  DropdownContent } from '@/Components/Dropdown/DropdownContent';
import { DropdownItem } from '@/Components/Dropdown/DropdownItem';
import Modal from '@/Components/Modal';
import { Button } from '@/Components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Pause, Play, Plus, Trash2, X } from 'lucide-react';
import { rule } from 'postcss';
import {useState, useRef } from 'react';

export default function Dashboard({ auth }) {
    const [action, setAction] = useState('');
    const [rules, setRules] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [conditionsModal, setConditionsModal] = useState(false);
    const [condObject, setConObject] = useState([]);
    const rule_on = useRef(null);
    const rule_m = useRef(null);
    const rule_value = useRef(null);

    console.log(conditionsModal)
    const handleAction = (e) => {
        console.log(e)
        setAction(e);
    }
    const handleConditions = () => {
        setConditionsModal(true);
    }
    const closeModal = () => {
        setModalOpen(false);
        reset();
    }

    const openModal = () => {
        setModalOpen(true);
    }

    const handleConditionsRef = () => {
        const condition = rule_on.current.value + ' ' + rule_m.current.value + ' ' + rule_value.current.value;
        console.log(condition);
        setConditionsModal(false);

    let rule_m_v;
    if(rule_m.current.value === 'Maior que') {
        rule_m_v= '>';
    }
    if(rule_m.current.value === 'Menor que') {
        rule_m_v = '<';
    }
        const obj = {
            rule_on: rule_on.current.value,
            rule_m: rule_m_v,
            rule_value: rule_value.current.value
        }

    console.log(obj)

    setConObject([...condObject, obj]);
    }
    const handleForm = (e) => {
        e.preventDefault();
        let orc;

        var action = e.target.action.value;
        if(action === "Aumentar orçamento em" || action === "Diminuir orçamento em") {

            if(e.target.orc_type.value == 'R$') {
                orc = 'R$' + e.target.orc_value.value;
            } else if(e.target.orc_type.value == '%'){
                orc = e.target.orc_value.value + '%';
            }
            action = action + ' ' + orc;
        }

        const dados = {
            name: e.target.name.value,
            product: e.target.product.value,
            ad_accounts: e.target.ad_accounts.value,
            apply_to: e.target.apply_to.value,
            condition: condObject,
            action: action ,
            period: e.target.period.value,
            frequency: e.target.frequency.value,
        }
        setConObject([]);
        setRules([...rules, dados]);
        setAction('');
        console.log(dados);
        console.log('Form submitted');
        closeModal();
    }

     return (
        <AuthenticatedLayout
            user={auth.user}   
                    
        >
            <Head title="Regras" />

            <div className="py-12 bg-background mt-4 md:mt-0">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-card overflow-x-auto no-scrollbar shadow-sm sm:rounded-lg border border-border">
                        <div className="text-card-foreground flex flex-col">
                            <div className='w-full flex items-center justify-between border-b border-border p-6' >
                                <h1>Regras</h1>
                                <Button onClick={openModal}>Adicionar Regra</Button>
                            </div>
                            <Modal show={modalOpen}>

                                <div className='w-full h-[80vh] overflow-auto bg-card border border-border relative rounded-md'>
                                    <div className='border-b border-border px-3 py-2'>
                                        <h1 className='text-lg font-bold text-card-foreground'>Criar regra personalizada</h1>
                                        <p className='text-muted-foreground text-sm'>Atualize campanhas, conjuntos ou anúncios por meio de regras automatizadas</p>
                                    </div>
                                    <form onSubmit={handleForm}>
                                    <div className='border-b border-border'>
                                        <div className='p-3'>
                                            <label className='text-muted-foreground text-xs'>Nome da regra</label>
                                            <input name='name' type="text" className='focus:ring-ring focus:border-ring w-full border bg-card border-border rounded-md p-2 text-sm'/>
                                        </div>
                                        <div className='p-3'>
                                            <label className='text-muted-foreground text-xs'>Produto</label>
                                           <Dropdown>
                                                <DropdownContent name={"product"} defaultValue={"Qualquer"}>
                                                    <DropdownItem value={"Qualquer"}/>
                                                </DropdownContent>
                                           </Dropdown>
                                        </div>

                                        <div className='p-3'>
                                            <label className='text-muted-foreground text-xs'>Contas de anúncio</label>
                                           <Dropdown>
                                                <DropdownContent defaultValue={"Todas"} name={"ad_accounts"}>
                                                    <DropdownItem value={"Todas"}/>
                                                </DropdownContent>
                                           </Dropdown>
                                        </div>

                                        <div className='p-3'>
                                            <label className='text-muted-foreground text-xs'>Aplicar regra a</label>
                                           <Dropdown>
                                                <DropdownContent defaultValue={"Campanhas Ativas"} name={"apply_to"}>
                                                    <DropdownItem value={"Campanhas Ativas"}/>
                                                    <DropdownItem value={"Conjuntos Ativos"}/>
                                                    <DropdownItem value={"Anúncios Ativos"}/>
                                                    <DropdownItem value={"Campanhas Pausadas"}/>
                                                    <DropdownItem value={"Conjuntos Pausados"}/>
                                                    <DropdownItem value={"Anúncios Pausados"}/>
                                                </DropdownContent>
                                           </Dropdown>
                                        </div>
                                        
                                        <div className='p-3'>
                                            <label className='text-muted-foreground text-xs'>Ação</label>
                                            <div className='flex gap-2'>
                                                <Dropdown mudou={handleAction} className="h-32">
                                                        <DropdownContent  defaultValue={"Ativar"} name={"action"}>
                                                            <DropdownItem value={"Ativar"}/>
                                                            <DropdownItem value={"Pausar"}/>
                                                            <DropdownItem value={"Aumentar orçamento em"}/>
                                                            <DropdownItem value={"Diminuir orçamento em"}/>
                                                        </DropdownContent>
                                                </Dropdown>

                                            {action == "Aumentar orçamento em" && (
                                                <div className='flex gap-2'>
                                                    <input type="number" name='orc_value' placeholder="0,00" className='text-sm w-full border border-border rounded-md bg-card placeholder:text-muted-foreground focus:ring-ring focus:border-ring h-9'/>
                                                    <select name="orc_type" id="" className='w-full border border-border rounded-md  bg-card focus:ring-ring focus:border-ring h-9'>
                                                        <option value="%">%</option>
                                                        <option value="R$">R$</option>
                                                    </select>
                                                </div>
                                            )}

                                            {action == "Diminuir orçamento em" && (
                                                <div className='flex gap-2'>
                                                    <input type="number" name='orc_value' placeholder="0,00" className='text-sm w-full border border-border rounded-md bg-card placeholder:text-muted-foreground focus:ring-ring focus:border-ring h-9'/>
                                                    <select name="orc_type" id="" className='w-full border border-border rounded-md bg-card focus:ring-ring focus:border-ring h-9'>
                                                        <option value="%">%</option>
                                                        <option value="R$">R$</option>
                                                    </select>
                                                </div>
                                            )}

                                            </div>
                                        </div>

                                        {/* Condição */}
                                        <div className='p-3 flex flex-col gap-4'>
                                            <div >
                                                <label className='text-muted-foreground text-xs'>Condições</label>
                                                <div className='flex gap-4 items-center'>
                                                    {condObject.length > 0 && condObject.map((cond, index) => (
                                                        <div key={index} className='flex items-center gap-2'>
                                                            <p className='text-sm text-muted-foreground'>{cond.rule_on} {cond.rule_m} {cond.rule_value}</p>
                                                            <button type="button" onClick={() => setConObject(condObject.filter((_, i) => i !== index))} className='size-6 border border-border rounded-md flex items-center justify-center'>
                                                                <X size={14} strokeWidth={1.3}/>
                                                            </button>
                                                        </div>
                                                    ))}
                                                <button type="button" onClick={handleConditions} className={'size-12 border border-border rounded-md flex items-center justify-center ' + (conditionsModal ? "hidden" : "" )}>
                                                    <Plus strokeWidth={1.3}/>
                                                </button>
                                                </div>
                                            </div>

                                            {conditionsModal && (
                                                <div className='w-full flex items-center justify-center gap-3 p-3 bg-muted rounded-md'>
                                                    <div className='w-full'>
                                                        <label className='text-muted-foreground text-xs'></label>
                                                        <Dropdown>
                                                            <DropdownContent defaultValue={"Gasto"} name={"condition_rule_on"} ref={rule_on}>
                                                                <DropdownItem value={"Gasto"}/>
                                                                <DropdownItem value={"CPA"}/>
                                                                <DropdownItem value={"ROAS"}/>
                                                                <DropdownItem value={"Lucro"}/>
                                                                <DropdownItem value={"Margem de Lucro"}/>
                                                                <DropdownItem value={"Orçamento"}/>
                                                                <DropdownItem value={"CPI"}/>
                                                                <DropdownItem value={"Vendas"}/>
                                                                <DropdownItem value={"ICs"}/>
                                                                <DropdownItem value={"CTR"}/>
                                                                <DropdownItem value={"CPM"}/>
                                                                <DropdownItem value={"Cliques"}/>
                                                            </DropdownContent>
                                                        </Dropdown>
                                                    </div>

                                                    <div className='w-full'>
                                                        <label className='text-muted-foreground text-xs'></label>
                                                        <Dropdown>
                                                            <DropdownContent defaultValue={"Maior que"} name={"condition_rule_m"} ref={rule_m}>
                                                                <DropdownItem value={"Maior que"}/>
                                                                <DropdownItem value={"Menor que"}/>
                                                            </DropdownContent>
                                                        </Dropdown>
                                                    </div>

                                                    <div className='w-full'>
                                                        <label className='text-muted-foreground text-xs'></label>
                                                        <input type='text' name='condition_rule_value' placeholder='R$0,00' className='text-sm border border-border rounded-md w-full bg-card focus:ring-ring focus:border-ring' ref={rule_value}/>
                                                    </div>

                                                    <Button onClick={handleConditionsRef} type="button" variant="outline">Confirmar</Button>

                                                </div>
                                            )}
                                        </div>

                                       <div className='p-3'>
                                            <label className='text-muted-foreground text-xs'>Período de cálculo</label>
                                           <Dropdown>
                                                <DropdownContent defaultValue={"Hoje"} name={"period"}>
                                                    <DropdownItem value={"Máximo"}/>
                                                    <DropdownItem value={"Hoje"}/>
                                                    <DropdownItem value={"Ontem"}/>
                                                    <DropdownItem value={"Últimos 2 dias"}/>
                                                    <DropdownItem value={"Últimos 3 dias"}/>
                                                    <DropdownItem value={"Últimos 4 dias"}/>
                                                    <DropdownItem value={"Últimos 5 dias"}/>
                                                    <DropdownItem value={"Últimos 6 dias"}/>
                                                    <DropdownItem value={"Últimos 7 dias"}/>
                                                    <DropdownItem value={"Últimos 2 dias, incluindo hoje"}/>
                                                    <DropdownItem value={"Últimos 3 dias, incluindo hoje"}/>
                                                    <DropdownItem value={"Últimos 4 dias, incluindo hoje"}/>
                                                    <DropdownItem value={"Últimos 5 dias, incluindo hoje"}/>
                                                    <DropdownItem value={"Últimos 6 dias, incluindo hoje"}/>
                                                    <DropdownItem value={"Últimos 7 dias, incluindo hoje"}/>
                                                </DropdownContent>
                                           </Dropdown>
                                        </div>

                                        <div className='p-3'>
                                            <label className='text-muted-foreground text-xs'>Frequência</label>
                                           <Dropdown>
                                                <DropdownContent down={false} defaultValue={"A cada 15 minutos"} name={"frequency"}>
                                                    <DropdownItem value={"A cada 15 minutos"}/>
                                                    <DropdownItem value={"A cada 30 minutos"}/>
                                                    <DropdownItem value={"A cada hora"}/>
                                                    <DropdownItem value={"A cada 2 horas"}/>
                                                    <DropdownItem value={"A cada 3 horas"}/>
                                                    <DropdownItem value={"A cada 6 horas"}/>
                                                    <DropdownItem value={"Uma vez por dia"}/>
                                                    
                                                </DropdownContent>
                                           </Dropdown>
                                        </div>

                                    </div>

                                    <div className='w-full flex justify-end gap-4 p-4'>
                                        <Button type="submit">Salvar</Button>
                                        <Button type="button" variant="destructive"  onClick={closeModal}>Cancelar</Button>
                                    </div>

                                    </form>
                                </div>

                            </Modal>
                            <div className=''>
                                <Table className="">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="border-r border-border">Status</TableHead>
                                            <TableHead className="border-r border-border">Nome e Produto</TableHead>
                                            <TableHead className="border-r border-border">Aplicada a</TableHead>
                                            <TableHead className="border-r border-border">Ação e condição</TableHead>
                                            <TableHead className="border-r border-border">Frequência e período</TableHead>
                                            <TableHead>Mais</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {rules.length > 0 && rules.map((rule, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="border-r">Ativo</TableCell>
                                                <TableCell className="border-r">{rule.name} - {rule.product}</TableCell>
                                                <TableCell className="border-r">{rule.apply_to}</TableCell>
                                                <TableCell className="border-r">
                                                    {rule.action} Se 
                                                    {rule.condition.map((cond, index) => (
                                                        <span key={index}> {cond.rule_on} {cond.rule_m} {cond.rule_value}</span>
                                                    ))}
                                                </TableCell>
                                                <TableCell className="border-r">{rule.frequency} - {rule.period}</TableCell>
                                                <TableCell className="flex gap-4">
                                                    <Button className="bg-yellow-200 size-12">
                                                        <Pause />
                                                    </Button>

                                                    <Button className="size-12">
                                                        <Play strokeWidth={2} color='white'/>
                                                    </Button>

                                                    <Button variant="destructive" className="size-12">
                                                        <Trash2 strokeWidth={2} color='white'/>
                                                    </Button>
                                                    
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>  
        </AuthenticatedLayout>
    );
}
