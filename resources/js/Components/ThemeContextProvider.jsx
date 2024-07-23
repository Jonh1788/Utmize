import { createContext, useContext, useEffect, useState } from "react";

const initialState = {
    theme: 'light',
    setTheme: () => null
}

const ThemeContext = createContext(initialState);

export function ThemeProvider({children, defaultTheme = "system", storageKey = "utmize-ui-theme", ...props}){
    
    const [theme, setTheme] = useState(() =>
        localStorage.getItem(storageKey) || defaultTheme
    );

    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("light", "dark");

        if(theme === "system"){
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(systemTheme);
            return
        }

        root.classList.add(theme);
    }, [theme]);

    const value = {
        theme,
        setTheme: (theme) => {
            localStorage.setItem(storageKey, theme)
            setTheme(theme)
        }
    }

    return (
        <ThemeContext.Provider value={value} {...props}>
            {children}
        </ThemeContext.Provider>
    )

}

export const useTheme = () => {

    const context = useContext(ThemeContext);

    if(!context){
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
}