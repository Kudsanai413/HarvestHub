import { View, Text } from 'react-native'
import React from 'react'
import CustomSimpleHeader from '@/Components/CustomSimpleHeader'
import { Drawer } from "expo-router/drawer"

export default function Settings() {
  return (
	<>
	<Drawer.Screen options={{
		headerShown: true
	}}/>
    <View>
		<CustomSimpleHeader title="Setting" search={'settings'} menu={["Reset Defaults", "Theme"]}/>
		<Text> Settings </Text>
    </View>
	</>
  )
}