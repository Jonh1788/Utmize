import { CampanhasContent } from '@/Components/CampanhasContent'
import Campanhas from './Campanhas'

export default function Contas({auth}) {
    return(
        <Campanhas auth={auth}>
            <CampanhasContent />
        </Campanhas>
    )
}