import { Button } from '@/Components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';



export default function Dashboard({ auth }) {
     return (
        <AuthenticatedLayout
            user={auth.user}            
        >
            <Head title="Avançado" />

            <div className="py-12 bg-background mt-4 md:mt-0">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg border border-border flex flex-col">
                        <div className='border-b border-border'>
                            <h1 className="p-6 text-card-foreground">Dashboards</h1>
                        </div>
                        <div>
                            <p className='p-6 text-muted-foreground text-sm'>Gerencie os dashboards da sua aplicação:</p>
                        </div>

                        <div className='w-full h-64 flex gap-2 p-6'>
                            <div className='border border-border w-52 rounded-md py-4 px-4'>
                                <div className='flex justify-between'>
                                    <h1 className='mb-4'>Principal</h1>
                                    <p className='text-2xl rotate-90 cursor-pointer'>...</p>
                                </div>
                                <p className='text-muted-foreground'>Faturamento Normal</p>
                                <p className='text-muted-foreground'>GMT-3 | Brasília</p>
                                <p className='text-muted-foreground'>Real Brasileiro (R$)</p>
                            </div>

                        </div>
                        <div className='p-6'>
                            <Button className="w-52">Novo dashboard</Button>
                        </div>
                    </div>
                </div>
            </div>  
        </AuthenticatedLayout>
    );
}
