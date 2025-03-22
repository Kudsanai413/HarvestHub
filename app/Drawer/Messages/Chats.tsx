import { View, Text, Button, FlatList } from 'react-native';
import React, {
    useState, useEffect, useRef, useMemo
} from 'react';
import useGetLoginContext from '@/Context/LoginContext';
import Drawer from 'expo-router/drawer';
import { socket, database } from '@/assets/reusable/api';
import { Response } from '@/Context/types';
import ChatListItem from '@/Components/ChatListItem';
import useGetChatContext from '@/Context/ChatContext';

export default function Chats() {
    const [chats, setChats] = useState<any[]>([])
    const { state } = useGetLoginContext();

    useEffect(() => {
        fetch(`${ database }/getChatItem/${ state.user.userID }/${ state.user_type }`)
            .then(response => {
                if (!response.ok) throw new Error("Failed To Get Chats");
                return response.json();
            }).then((response: Response) => {
                setChats(response.data)
            })
    }, []);



  return (
    <>
        <Drawer.Screen options={{ headerShown: true }}/>
        <View>
            {
                chats.length ?
                <FlatList
                    data={ chats }
                    keyExtractor={(item) => item.id }
                    renderItem={ ({ item }) => <ChatListItem chat={ item }/> }
                />: <Text>No Chats At The Moment</Text>
            }

        </View>
    </>
  )
}