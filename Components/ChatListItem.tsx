import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import React from 'react';
import { chatItem } from '@/Context/types';
import { styling } from '@/assets/styles/global'
import useGetFileContext from '@/Context/FileContext';
import { app_colors } from '@/assets/styles/colors';
import useGetChatContext from '@/Context/ChatContext';
import { useRouter } from 'expo-router';


interface props
{
    chat: chatItem
}

export default function ChatListItem({ chat } : props) {
    const { Image : img } = useGetFileContext();
    const { setCurrChatName } = useGetChatContext();
    const navigate = useRouter()
    return (
        <Pressable style={ stylinItem.container } onPress={() => {
            setCurrChatName(chat.user.name);
            navigate.push(`/Drawer/Messages/${ chat.id }`);
        }}>
            <Image source={ img.farmer } style={ stylinItem.profile_image } />
            <View style={ stylinItem.userBand }>
                <Text style={ stylinItem.userName }> { chat.user.name } </Text>
                <Text style={ stylinItem.message }> { chat.last_message.text }</Text>
            </View>
            <Text style={ stylinItem.time }>{ chat.last_message.time }</Text>
            <Text style={ stylinItem.bubble }>99+</Text>
        </Pressable>
    )
}

const stylinItem = StyleSheet.create(
    {
        container:
        {
            width: "95%",
            height: 90,
            flexDirection: "row",
            marginHorizontal: "auto",
            position: "relative"
        },
        profile_image:
        {
            width: 60,
            height: 60,
            borderRadius: "50%",
            marginVertical: "auto"
        },
        userBand:
        {
            height: "98%",
            paddingTop: 15,
        },
        time:
        {
            position: "absolute",
            right: 10,
            bottom: 10,
            fontSize: 10,
            fontStyle: "italic",
        },
        userName:
        {
            fontWeight: 600,
            fontSize: 17
        },
        message:
        {
            paddingLeft: 8,
            fontWeight: "200"
        },
        bubble:
        {
            width: 28,
            height: 28,
            borderRadius: "50%",
            backgroundColor: app_colors.primary,
            textAlign: "center",
            textAlignVertical: "center",
            paddingTop: 3,
            position: "absolute",
            right: 5,
            top: 20
        }
    }
)