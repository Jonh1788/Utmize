import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import TextInput from '@/Components/TextInput';


export default function PerfectPayIntegration({ auth, integrationExists }) {
    const [accessToken, setAccessToken] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = (e) => {
        e.preventDefault();
        setLoading(true);
        router.post(route('perfectpay.integration.save'), { access_token: accessToken }, {
            onFinish: () => setLoading(false),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Integração Perfect Pay" />
            <div className="max-w-2xl mx-auto mt-8">
                <h1 className="text-2xl font-bold mb-4">Integração com Perfect Pay</h1>
                {integrationExists ? (
                    <p>Integração já configurada.</p>
                ) : (
                    <form onSubmit={handleSave}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Token de Acesso
                            </label>
                            <TextInput
                                type="text"
                                value={accessToken}
                                onChange={(e) => setAccessToken(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </form>
                )}
            </div>
        </AuthenticatedLayout>
    );
}