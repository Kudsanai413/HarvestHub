import { Stack } from "expo-router";
import React from 'react';
import { ChatContextProvider } from '@/Context/ChatContext';

export default function ChatRootLayout() {

	return(
        <ChatContextProvider>
            <Stack
                screenOptions={{
                    headerShown: false
                }}
                >
                <Stack.Screen name="Chats" />
                <Stack.Screen name="[id]"/>
            </Stack>
        </ChatContextProvider>

	);
}

