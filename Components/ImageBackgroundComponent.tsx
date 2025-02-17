import { View, Text, Image, StyleSheet, Appearance } from 'react-native'
import React from 'react'

interface props
{
    image_source : any,
    styles?: any,
    curtain?: string,
    children: React.JSX.Element | React.JSX.Element[],
    curtainOptions?: any,
    background?: "cover" | "stretch" | "center" | "contain" | "repeat",
    glassy?: number
}

export default function ImageBackgroundComponent({ image_source, styles, curtain, children, curtainOptions, background, glassy } : props) {
  return (
    <View
        style={ [ styling.container, styles ] }
    >
        <Image source={ image_source } style={ styling.image } resizeMode={ background }/>
        <View
            style={[ styling.container, curtainOptions, { backgroundColor : curtain ? curtain : "transparent", backdropFilter: `blur(${ glassy }px)`}]}
        >
            { children }
        </View>
    </View>
  )
}

const styling = StyleSheet.create(
    {
        image:
        {
            width: "100%",
            height: "100%",
            borderTopLeftRadius : "inherit",
            borderBottomLeftRadius : "inherit",
            borderTopRightRadius : "inherit",
            borderBottomRightRadius : "inherit",
            position: "absolute",
            top: 0,
            left: 0,
        },

        container:
        {
            minWidth: "100%",
            minHeight: "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            alignItems: "center",
            borderTopLeftRadius : "inherit",
            borderBottomLeftRadius : "inherit",
            borderTopRightRadius : "inherit",
            borderBottomRightRadius : "inherit",

        }

    }
);