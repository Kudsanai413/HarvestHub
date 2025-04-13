import { View, Text, FlatList, Button, Pressable, Appearance, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import useGetLoginContext from '@/Context/LoginContext'
import { chatItem, Response } from '@/Context/types';
import { database } from '@/assets/reusable/api';
import ChatListItem from '@/Components/ChatListItem';
import { app_colors } from '@/assets/styles/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useGetChatContext from '@/Context/ChatContext';
import SimpleHeader from '@/Components/SimpleHeader';
import { useRouter } from 'expo-router';

export default function Chats() {
    const { state: login } = useGetLoginContext();
    const [chatItems, setChatItems] = useState<chatItem[]>([]);
    const { chatMessageUpdates } = useGetChatContext()
    const navigate = useRouter();

    useEffect(() => {
        fetch(`${ database }/getChatItem/${ login.user.userID }/${ login.user_type }`)
            .then( (response) => {
                if (!response.ok) throw new Error("Failed To Fetch All The Chats");
                return response.json()
            }).then((data : Response) => {
                setChatItems(data.data)
            })
    }, [chatMessageUpdates])
  return (
    <>
        <SimpleHeader
            title={ "Messages" }
            back={() => {
                const retreat  = login.user_type === "Buyers" ? "(buyers)/BuyerHome" : "(farmer)/FarmerHome";
                navigate.push(`/Drawer/${ retreat }`);
            }}
        />
        <ScrollView>
        {
            chatItems.length ?
                <FlatList
                    data={ chatItems }
                    renderItem={ ({item}) => <ChatListItem chat={item} masterKey={''}/> }
                />
                    :
                    <View style={{
                        width: "90%", height: 80,
                        position: "fixed",
                        bottom: 0,
                        left: "5%"
                    }}><Button title='Add Conversation' color={ app_colors.primary }/></View>
        }

            <Pressable
                style={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    position: "fixed",
                    bottom: 50,
                    right: 15,
                    backgroundColor: app_colors.primary,
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onPress={() => navigate.push("/Drawer/Messages/Updates")}
            >
                <MaterialCommunityIcons name="message-plus" color={ Appearance.getColorScheme() === "dark"? app_colors.dark_bg : app_colors.white } size={ 25 }/>
            </Pressable>

        </ScrollView>
    </>
  )
}