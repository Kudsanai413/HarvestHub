import { Stack } from "expo-router";
import React from 'react';
import useGetChatContext, { ChatContextProvider } from '@/Context/ChatContext';

export default function ChatRootLayout() {
    const { currChatName } = useGetChatContext()
    return(
        <ChatContextProvider>
            <Stack
                screenOptions={{
                    headerShown: false
                }}
                >
                <Stack.Screen name="index" />
                <Stack.Screen name="[id]" />
            </Stack>
        </ChatContextProvider>

    );
}

