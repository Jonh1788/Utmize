import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Facebook } from 'lucide-react';
import { useEffect } from 'react';
import { fbLogin, fbLogout, initFacebookSDK } from '@/utils/FacebookSDK';
import axios from 'axios';

function login(auth){
    console.log('Logando1');
             fbLogin().then(response => {  
                axios.post(route('facebook.store'), {
                    data: response,
                    user: auth.user
                }).then(response => {
                    console.log(response);
                })
            })
            
   
}
export default function Dashboard({ auth }) {


    return (
        <AuthenticatedLayout
            user={auth.user}            
        >
            <Head title="Integrações" />

            <div className="py-12 px-6 md:px-0 mt-4 md:mt-0">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-4 justify-center">
                    <div className="bg-card border border-border gap-4 text-card-foreground overflow-hidden w-fit shadow-sm sm:rounded-lg flex flex-col items-start  justify-center p-8">
                        <div className="flex gap-2">
                            <Facebook color='blue'/>
                            <p className='text-card-foreground text-xl'>Meta Ads</p>
                        </div>
                        <div className='flex flex-col gap-3 items-center justify-center'>
                            <p className='text-sm text-muted-foreground'>Adicione perfis por aqui:</p>
                            <Button onClick={() => login(auth)}>Adicionar perfil +</Button>
                        </div>
                    </div>

                    <div className="bg-card border border-border gap-4 overflow-hidden w-fit shadow-sm sm:rounded-lg flex flex-col items-start text-card-foreground justify-center p-8">
                        Contas de Anúncios
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
