import React, { useState, createContext, useContext, useRef } from "react";
import { ChildrenType } from "./types";
import { imgs } from "@/assets/reusable/Imports";


const images =
[
    "Onions",
    "Tomatoes",
    "Radish",
    "cabbage",
    "Broccoli",
    "carrots",
    "cauliflower",
    "Cucumber",
    "Pepper",
    "Beet",
    "Lettuce",
    "Spinach",
    "Sweet",
    "Chili",
    "Potato"

]



type FileContextType = {
    Image: typeof imgs,
    getImage: ( prod_type: string ) => any
};


    function getImage( prod_type: string) : any
    {
        let found: string = "logo"
        const x = images.map( img => prod_type.toLowerCase().includes(img.toLowerCase()) && prod_type !== "Sweet Potatoes" ? found = img : prod_type === "Sweet Potatoes" ? found = "Sweet" : found )
        switch(images.indexOf(found))
        {
            case 0: return imgs.onion;

            case 1: return imgs.tomato;

            case 2: return imgs.radish;

            case 3: return imgs.cabbage;

            case 4: return imgs.brocolli;

            case 5: return imgs.carrots;

            case 6: return imgs.califlower;

            case 7: return imgs.cucumber;

            case 8: return imgs.pepper;

            case 9: return imgs.beet;

            case 10: return imgs.lettuce;

            case 11: return imgs.spinach;

            case 13: return imgs.chilli;

            case 14: return imgs.potato;

            case 12: return imgs.sw_potatoe;

            default: return imgs.logo;
        }
    }

    const FileContext = createContext<FileContextType>({ Image: imgs, getImage : getImage });

export function FileContextProvider({ children } : ChildrenType) : React.JSX.Element
{
    return(
        <FileContext.Provider value={{
            Image: imgs,
            getImage: getImage
        }}>
            { children }
        </FileContext.Provider>
    );
}

export default function useGetFileContext() : FileContextType { return useContext(FileContext) }