import { Button } from '@/Components/ui/button';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';


export default function Dashboard({ auth }) {
     return (
        <AuthenticatedLayout
            user={auth.user}          
        >
            <Head title="Taxas" />

            <div className="py-12 bg-background mt-4 md:mt-0">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-4">
                    <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg border border-border">
                        <div className='p-6 flex flex-col gap-4 border-b border-border'>
                            <div className="text-card-foreground">Impostos</div>
                        </div>
                        <p className='p-6 text-muted-foreground'>Configure o imposto dos seus produtos:</p>
                        <div className='p-6 pt-20'>
                            <Button className="w-52">Adicionar Imposto</Button>
                        </div>
                    </div>

                    <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg border border-border">
                    <div className='p-6 flex flex-col gap-4 border-b border-border'>
                            <div className="text-card-foreground">Taxas</div>
                        </div>
                        <p className='p-6 text-muted-foreground'>Configure a taxa dos seus produtos:</p>
                        <div className='p-6 pt-20'>
                            <Button className="w-52">Adicionar Taxa</Button>
                        </div>
                    </div>
                </div>
            </div>  
        </AuthenticatedLayout>
    );
}
