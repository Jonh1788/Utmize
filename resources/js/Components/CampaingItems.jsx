import { Link } from '@inertiajs/react';
import {cn} from '@/lib/utils';
export const CampaignItems = ({icon, name, ...props}) => {
    const link = props.href === window.location.href;
    var active = link ? 'border-primary text-primary' : '';
    return (

        <Link {...props} 
        className={cn("border-b-2 p-1 md:p-2 text-xs md:text-lg size-full border-transparent hover:border-primary flex gap-2 font-semibold hover:text-primary items-center justify-center cursor-pointer", active)}>
            {icon}
            {name}
        </Link>
    )
}