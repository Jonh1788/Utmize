import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Facebook } from 'lucide-react';
import { useEffect, useState } from 'react';
import { initFacebookSDK, fbLogin } from '@/utils/FacebookSDK';
import axios from 'axios';

export default function Dashboard({ auth, existingProfile }) {
    const [profileInfo, setProfileInfo] = useState(existingProfile);
    const [sdkInitialized, setSdkInitialized] = useState(false);

    useEffect(() => {
        initFacebookSDK().then(() => {
            setSdkInitialized(true);
        }).catch(error => {
            console.error('Erro ao inicializar o SDK do Facebook:', error);
        });
    }, []);

    useEffect(() => {
        if (!profileInfo && sdkInitialized) {
            axios.get(route('facebook.profile.info'))
                .then(response => {
                    if (response.data.profile) {
                        setProfileInfo(response.data.profile);
                    }
                })
                .catch(error => {
                    console.error('Erro ao obter informações do perfil:', error);
                });
        }
    }, [profileInfo, sdkInitialized]);

    const handleLogin = () => {
        if (!sdkInitialized) {
            console.error('SDK do Facebook não está inicializado.');
            return;
        }

        fbLogin().then(response => {
            axios.post(route('facebook.store'), {
                data: response,
                user: auth.user
            }).then(response => {
                setProfileInfo(response.data.profile);
            }).catch(error => {
                console.error('Erro ao armazenar dados do Facebook:', error);
            });
        }).catch(error => {
            console.error('Erro no login do Facebook:', error);
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Integrações" />

            <div className="py-12 px-6 md:px-0 mt-4 md:mt-0">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-4 justify-center">
                    <div className="bg-card border border-border gap-4 text-card-foreground overflow-hidden w-fit shadow-sm sm:rounded-lg flex flex-col items-start justify-center p-8">
                        <div className="flex gap-2">
                            <Facebook color='blue' />
                            <p className='text-card-foreground text-xl'>Meta Ads</p>
                        </div>
                        <div className='flex flex-col gap-3 items-center justify-center'>
                            {profileInfo ? (
                                <div className='flex gap-2 items-center'>
                                    <img src={profileInfo.picture.data.url} alt="Profile" className="rounded-full"/>
                                    <p className="text-sm">Nome: {profileInfo.name}</p>
                                </div>
                            ) : (
                                <div>
                                    <p className='text-sm text-muted-foreground'>Adicione perfis por aqui:</p>
                                    <Button onClick={handleLogin}>Adicionar perfil +</Button>
                                </div>
                            )}
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