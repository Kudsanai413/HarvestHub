import { View, Text, StyleSheet, Appearance, Pressable } from 'react-native'
import React, { useState } from 'react'
import { app_colors } from '@/assets/styles/colors'

interface props
{
    type: string,
    selected: number,
    setSelected: React.Dispatch<React.SetStateAction<number>>
}

const farmers : string[] = ["  All  ", "  Public Requests  ", "  Personal Requests  ", "  My Contracts  " ];
const buyers : string[] = ["  All  ", "  Pending  ", "  My Contracts  "]

function curvy(index: number)
{
    if (index === 0) return { borderBottomLeftRadius: 8 }

    if (index === 3) return { borderBottomRightRadius: 8 }

}

export default function FilterBand( { type, selected, setSelected } : props)
{
    const colorScheme = Appearance.getColorScheme();
  return (
    <View style={ styles.band }>
    {
        type && type === "Farmers" ?
            farmers.map( filter => (
                <Pressable
                    style={{
                        ...styles.filter,
                        borderBottomWidth: selected === farmers.indexOf(filter) ? 3 : 0 ,
                        ...curvy(farmers.indexOf(filter))
                    }}
                    onPress={ () => setSelected(farmers.indexOf(filter))}
                >
                    <Text>{ filter }</Text>
                </Pressable>
            ))
                : type && type === "Buyers" ?
                    buyers.map(filter => (
                        <Pressable
                            style={{ ...styles.filter, borderBottomWidth: selected === buyers.indexOf(filter) ? 3 : 0 }}
                            onPress={ () => setSelected(buyers.indexOf(filter))}
                        >
                            <Text>{ filter }</Text>
                        </Pressable>
                    ))
                        : <Text> No One Logged In</Text>
    }
    </View>
  )
}

const styles = StyleSheet.create(
    {
        band:
        {
            width: "99.8%",
            height: 50,
            backgroundColor: Appearance.getColorScheme() == "dark" ? app_colors.secondary : app_colors.white,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            marginHorizontal:"auto",
            boxShadow: "0 2px 1px black"
        },

        filter:
        {
            minWidth: 60,
            width: "auto",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
            borderBottomColor: Appearance.getColorScheme() === "dark" ? app_colors.skeleton: app_colors.secondary,
            // borderRadius: 3,
            borderWidth: 0,
        }
    }
)