import { useContext } from "react"
import { useTheme } from "./ThemeContextProvider";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import {twMerge} from "tailwind-merge"

export default function ToggleTheme() {
    const variants = {
        dark: { x: 0},
        light: { x: 30}
    }

    const {theme, setTheme} = useTheme();
    const color = theme === "light" ? "bg-slate-400 shadow-slate-800 border-[#64748b]" : "bg-yellow-200 shadow-yellow-800 border-[#eab308]";
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
        console.log(theme)
    }
    return (
            <div onClick={toggleTheme} className={"w-16 border border-border rounded-full bg-muted"}>
                <motion.button
                    variants={variants}
                    animate={theme === "light" ? "light" : "dark"}
                    
                    className={"bg-card border border-border rounded-full p-2  " + color} 
                >
                    {theme === "light" 
                    ? <Moon size={15} className="text-card-foreground"/> 
                    : <Sun size={15} className={"text-zinc-900"}/>}
                </motion.button>
            </div>
        
    )
}