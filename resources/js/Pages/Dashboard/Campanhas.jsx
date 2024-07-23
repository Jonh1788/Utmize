import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { HeaderCampaign } from '@/Components/HeaderCampaign';


export default function Dashboard({ auth }) {
     return (
        <AuthenticatedLayout
            user={auth.user}   
            header={<HeaderCampaign />}         
        >
            <Head title="Campanhas" />

            <div className="py-12 bg-background">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg border border-border">
                        <div className="p-6 text-card-foreground">Campanhas</div>
                    </div>
                </div>
            </div>  
        </AuthenticatedLayout>
    );
}
