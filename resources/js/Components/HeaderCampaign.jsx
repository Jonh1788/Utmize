import { CampaignItems } from "./CampaingItems"
import { CircleUser, Album, SquarePlus, Megaphone} from "lucide-react";
export const HeaderCampaign = () => {

    return (
        <div className="flex justify-between w-full px-2 md:px-24 bg-card border-b border-border h-24 items-center mt-14 md:mt-0">
            <CampaignItems href={route('campanhas.contas')} icon={<CircleUser className="size-4 md:size-5"/>} name={"Contas"}/>
            <CampaignItems href={route('campanhas.campanhas')} icon={<Album className="size-4 md:size-5"/>} name={"Campanhas"}/>
            <CampaignItems href={route('campanhas.conjuntos')} icon={<SquarePlus className="size-4 md:size-5"/>} name={"Conjuntos"}/>
            <CampaignItems href={route('campanhas.anuncios')} icon={<Megaphone className="size-4 md:size-5"/>} name={"Anúncios"}/>
        </div>
    )
}
