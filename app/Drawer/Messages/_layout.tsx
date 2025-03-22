import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { ChatContextProvider } from '@/Context/ChatContext'

export default function _layout() {
  return (
    <ChatContextProvider>
        <Stack
            screenOptions={{
                headerShown: false
            }}
            >
            <Stack.Screen name="chats" />
            <Stack.Screen name="[id]"/>
        </Stack>
    </ChatContextProvider>

  )
}