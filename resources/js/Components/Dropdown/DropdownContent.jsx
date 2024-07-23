import { ChevronDown } from "lucide-react"
import { useState, useContext, forwardRef } from "react"
import { DropdownContext } from "./Dropdown"


export const DropdownContent = forwardRef(({children, name, defaultValue, down = true}, ref) => {

    const [isOpen, setIsOpen] = useState(false);
    const {value, setValue, toggleValue} = useContext(DropdownContext);

    if(value === null) {
        setValue(defaultValue);
    }
    const handleClick = () => {
        setIsOpen(!isOpen);
    }

    return (
        <button type="button" onClick={handleClick} className={"p-2 bg-card text-sm text-card-foreground rounded-md w-full h-9 border border-border flex justify-between items-center relative " 
        + (isOpen ? "border-ring ring-ring text-primary" : "")}>
            <div className="flex justify-between w-full">
                {value ? value : defaultValue}
                <input type="hidden" name={name} value={value} ref={ref}/>
                <ChevronDown className={"text-muted-foreground size-5 " + (isOpen ? "text-primary rotate-180" : "")}/>
            </div>
            <div className={"rounded-md border border-ring divide-y divide-border border-collapse z-10 absolute overflow-hidden h-min w-full flex-col inset-x-0 " + (down ? " inset-y-9 " : " bottom-10 ") + (isOpen ? "flex" : "hidden")}>
                {children}
            </div>
        </button>
    )
})