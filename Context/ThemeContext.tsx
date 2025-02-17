import React, { useState, createContext, useContext } from "react";
import { Appearance } from "react-native";
import { Themes } from "@/assets/styles/colors";
import { ChildrenType } from "./types";

type ThemeContextType =
{
    colorScheme: any,
    setColorScheme: React.Dispatch<React.SetStateAction<any>>,
    theme: any,
};

const ThemeContext = createContext<ThemeContextType>({
    colorScheme: "",
    setColorScheme: () => {},
    theme: ""
});

export function ThemeContextProvider({ children } : ChildrenType)
{
    const [colorScheme, setColorScheme] = useState(Appearance.getColorScheme());

    const theme = colorScheme === "light" ? Themes.light : Themes.dark
    return(
        <ThemeContext.Provider
            value={{
                colorScheme: colorScheme,
                setColorScheme: setColorScheme,
                theme:theme
            }}
        >
            { children }
        </ThemeContext.Provider>
    )
}


export default function useGetThemeContext(): ThemeContextType { return useContext(ThemeContext)}
