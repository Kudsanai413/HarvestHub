import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import React from "react";

type props = {
    color: string,
    size: number,
    icon: string | any,
    iconType: string,
};

export default function TabIcon({ color, size, icon, iconType } : props) : React.JSX.Element
{
    return(
        <>{
            iconType === "fontawesome" ?
                <FontAwesome name={ icon } size={ size } color={ color }/>
                    : <MaterialIcons name={ icon } size={ size } color={ color }/>
        }</>
    )
}
