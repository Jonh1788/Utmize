import { createContext, useState } from "react"
export const DropdownContext = createContext();

export const Dropdown = ({children, mudou = () => {}}) => {
    
    const [value, setValue] = useState(null);

    const toggleValue = (newValue) => {
        mudou(newValue);
        setValue(newValue);
    }
    return (
        <DropdownContext.Provider value={{value, setValue, toggleValue}}>
            {children}
        </DropdownContext.Provider>
    )
}