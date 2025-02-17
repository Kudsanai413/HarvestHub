import { View, Text, Image, StyleSheet, Appearance } from 'react-native'
import React from 'react'
import { app_colors } from '@/assets/styles/colors'
import { UserType } from '@/Context/types'

interface props
{
    user: UserType
}

export default function Profile_card({ user } : props) {
  return (
    <View style={ styles.card }>
        <Image source={ require("@/assets/images/wit-ball.jpg") } style={{
                width: 90,
                height: "99.9%",
                borderTopLeftRadius: "inherit",
                borderBottomLeftRadius: "inherit",
            }}

        />
        <View style={ styles.text_things }>
            <Text style={ styles.name }>{ user.Name }</Text>
            <Text style={ styles.email }>{ user.contact }</Text>
            <Text>{ user.main_crop }</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create(
    {
        card:
        {
            width:  "90%",
            height: 80,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            backgroundColor: Appearance.getColorScheme() === "dark" ? app_colors.dark_cardbg : app_colors.white,
            borderRadius: 10,
            marginHorizontal: "auto",
            marginVertical: 10
        },

        text_things:
        {
            width: "50%",
            height: 70,
            justifyContent: "space-between",
            alignItems: "center",
        },

        name:
        {
            fontSize: 20,
            fontWeight: 500,
            textOverflow: "ellipsis"
        },

        email:
        {
            fontStyle: "italic",
            fontWeight: 100
        }

    })