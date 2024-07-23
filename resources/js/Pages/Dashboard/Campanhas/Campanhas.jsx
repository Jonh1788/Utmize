import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { HeaderCampaign } from '@/Components/HeaderCampaign';


export default function Campanhas({ auth, children}) {
     return (
        <AuthenticatedLayout
            user={auth.user}   
            header={<HeaderCampaign />}         
        >
            <Head title="Campanhas" />

            <div className="py-12 bg-background">
                <div className="max-w-7xl bg-background sm:px-12 lg:px-8">
                    <div className="bg-card overflow-hidden shadow-sm sm:rounded-lg border border-border">
                        {children}
                    </div>
                </div>
            </div>  
        </AuthenticatedLayout>
    );
}
