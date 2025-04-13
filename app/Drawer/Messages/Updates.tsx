import { View, Text, FlatList } from 'react-native'
import React , { useEffect, useState } from 'react'
import useGetChatContext from '@/Context/ChatContext'
import { chat } from '@/Context/types';
import MessageListItem from '@/Components/MessageListItem';

export default function Updates() {
    const { chatMessageUpdates } = useGetChatContext();
    const [updates, setUpdate] = useState<chat[]>([]);
    useEffect(() => {
        setUpdate([...chatMessageUpdates])
    }, [chatMessageUpdates])
  return (
    <>
    {
        updates.length ?
            <FlatList
                data={ updates }
                renderItem={({ item }) => <MessageListItem update={ item }/>}
            />
                :
                <View>
                    <Text
                        style={{
                            fontFamily: "Lucida Caligraphy",
                            fontSize: 22,
                            fontWeight: "100"
                        }}
                    >No Updates Available</Text>
                </View>
    }
    </>
  )
}