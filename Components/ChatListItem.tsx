import { View, Text, StyleSheet, Pressable, Image } from 'react-native'
import React from 'react'
import { app_colors } from '@/assets/styles/colors'
import useGetFileContext from '@/Context/FileContext'
import { chatItem } from '@/Context/types'
import { formatDate } from '@/assets/reusable/constants'
import useGetChatContext from '@/Context/ChatContext'
import { useRouter } from 'expo-router'
import { socket } from '@/assets/reusable/api'

interface props
{
    chat: chatItem,
    myLast?: chatItem,
    masterKey: string
}

export default function ChatListItem({ chat, masterKey}: props) {
    const { Image: img } = useGetFileContext();
    const { setCurrChatName } = useGetChatContext();
    const navigate = useRouter()
  return (
    <Pressable style={ stylingItem.container }
        onPress={() => {
            setCurrChatName(chat.user.name);
            setTimeout(() => { navigate.push(`/Drawer/Messages/${ chat.id }`)}, 250)
            if (chat.last_message.count > 0) socket.emit("read-messages", masterKey);
        }}
    >
        <Image source={ img.with } style={ stylingItem.profile_image }/>
        <View style={ stylingItem.InfoBand }>
            <Text style={ stylingItem.Name }>{ chat.user.name }</Text>
            <Text style={ stylingItem.message }>{ chat.last_message.text }</Text>
        </View>
        <Text style={{ ...stylingItem.badge, display: chat.last_message.count > 0 ? "flex" : "none",  }}>{ chat.last_message.count }</Text>
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
            justifyContent: "center",
            position: "absolute",
            top: 35,
            right: 10,
            alignItems: "center",
            fontWeight: "600"
        }
    }
)