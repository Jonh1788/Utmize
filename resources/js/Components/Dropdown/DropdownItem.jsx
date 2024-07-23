import { useContext } from "react"
import { DropdownContext } from "./Dropdown"

export const DropdownItem = ({value}) => {
    const {toggleValue} = useContext(DropdownContext);
    const handleClick = () => {
        toggleValue(value);
    }
    return (
        <button type="button" onClick={handleClick} className="p-3 text-left bg-card text-card-foreground w-full border-collapse hover:text-primary">
            {value}
        </button>
    )
}