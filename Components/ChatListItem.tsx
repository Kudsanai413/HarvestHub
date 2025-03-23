import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import React from 'react'
import { app_colors } from '@/assets/styles/colors'
import useGetFileContext from '@/Context/FileContext'
import { chatItem } from '@/Context/types'
import { formatDate } from '@/assets/reusable/constants'

interface props
{
    chat: chatItem
}

export default function ChatListItem({ chat }: props) {
    const { Image: img } = useGetFileContext();
  return (
    <Pressable style={ stylingItem.container }>
        <Image source={ img.with } style={ stylingItem.profile_image }/>
        <View style={ stylingItem.InfoBand }>
            <Text style={ stylingItem.Name }>{ chat.user.name }</Text>
            <Text style={ stylingItem.message }>{ chat.last_message.text }</Text>
        </View>
        <Text style={ stylingItem.badge }>99+</Text>
        <Text style={ stylingItem.time }>{ formatDate(chat.last_message.time) }</Text>
    </Pressable>
  )
}

const stylingItem = StyleSheet.create(
    {
        container:
        {
            width: "96%",
            height: 90,
            marginHorizontal: "auto",
            flexDirection: "row",
            alignItems: "center",
            position: "relative",
            borderRadius: 10
        },

        profile_image:
        {
            width: 60,
            height: 60,
            borderRadius: "50%",
        },

        InfoBand:
        {
            width: "70%",
            height: "99%",
        },

        Name:
        {
            textAlignVertical: "center",
            fontWeight: 500,
            fontSize: 18,
            marginTop:15,
            marginLeft: 5
        },

        message:
        {
            fontSize: 14,
            fontWeight: "300",
            marginTop: 7,
            marginLeft: 15
        },

        time:
        {
            position: "absolute",
            top: 10,
            right: 10,
            fontWeight: 100,
            fontSize: 10
        },

        badge:
        {
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: app_colors.primary,
            textAlign: "center",
            textAlignVertical: "center",
            position: "absolute",
            top: 35,
            right: 10,
            paddingTop: 3
        }
    }
)