import Campanhas from './Campanhas'
import { CampanhasContent } from '@/Components/CampanhasContent'
export default function Contas({auth}) {
    return(
        <Campanhas auth={auth}>
            <CampanhasContent />
        </Campanhas>
    )
}