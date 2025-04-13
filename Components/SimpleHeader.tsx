import { View, Text, Pressable, StyleSheet, Appearance } from 'react-native'
import React from 'react'
import FontAwesome6 from '@expo/vector-icons/build/FontAwesome6'
import { app_colors } from '@/assets/styles/colors'

interface props
{
    title: string,
    avatar?: string,
    back: () => void ,
    style?: any
}

export default function SimpleHeader({ title, avatar, back, style } : props) {
  return (
    <View style={ header.bar }>
        <Pressable
            onPress={back}
            style={ header.back }
        >
            <FontAwesome6 name="arrow-left-long" size={24} color="black" />
        </Pressable>
        <Text style={ header.title }>{ title }</Text>
    </View>
  )
}

const header = StyleSheet.create(
    {
        bar:
        {
            width: "100%",
            height: 65,
            flexDirection: "row",
            alignItems: "center",
            borderBottomColor: app_colors.fade,
            borderBottomWidth: 0.25,
        },
        title:
        {
            fontSize: 20,
            fontWeight: 700,
        },
        back:
        {
            width: 50,
            height: 50,
            borderRadius: "50%",
            justifyContent: "center",
            alignItems: "center",
        },

    }
)