import { Button } from '@/Components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';


export default function Dashboard({ auth }) {
     return (
        <AuthenticatedLayout
            user={auth.user}           
        >
            <Head title="Assinatura" />

            <div className="py-12 bg-background mt-4 md:mt-0">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-4">
                    <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg border border-border">
                        <div className='border-b border-border'>
                            <h1 className="p-6 text-card-foreground">Plano Gratuito - R$0,00</h1>
                        </div>

                        <div className='p-6 flex flex-col gap-4'>
                            <p className='text-muted-foreground text-sm'>Reinicia em 30 dias - 22/09/2024</p>
                            <div className='bg-primary/50 w-full h-2 rounded-md'/>
                        </div>
                    </div>

                    <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg border border-border">
                        <div className='border-b border-border'>
                            <h1 className="p-6 text-card-foreground">Webhooks e Contas de Anúncio</h1>
                        </div>

                        <div className='flex flex-col gap-2 py-6'>
                            <div className='flex justify-between px-6 text-muted-foreground text-sm'>
                                <p>Webhooks configurados:</p>
                                <p>0/1</p>
                            </div>

                            <div className='flex justify-between px-6 text-muted-foreground text-sm'>
                                <p>Contas de anúncio configuradas:</p>
                                <p>0/1</p>
                            </div>

                            <div className='flex justify-between px-6 text-muted-foreground text-sm'>
                                <p>Dashboard criados:</p>
                                <p>1/1</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg border border-border">
                        <div className='border-b border-border'>
                            <h1 className="p-6 text-card-foreground">Cobrança</h1>
                        </div>

                        <div className='p-6 flex flex-col gap-2'>
                            <p className='text-muted-foreground text-sm'>Plano Gratuito - R$0,00/mês</p>
                            <Button className="w-52">Fazer Upgrade</Button>
                        </div>
                    </div>
                </div>
            </div>  
        </AuthenticatedLayout>
    );
}
