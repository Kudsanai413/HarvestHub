import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { app_colors } from '@/assets/styles/colors'

interface headerProps
{
	title : string,
	search: string,
	menu: string[]
}

export default function CustomSimpleHeader({ title, search, menu} : headerProps)
{
	const navigator = useRouter();
	return (
		<View style={ header.body }>
			<Pressable
				onPress={ () => {
					navigator.back();
				}}
			>
				<MaterialCommunityIcons name="arrow-left-thin" color={ app_colors.fade } size={ 25 } />
			</Pressable>
			<Text>{ title }</Text>
			<MaterialCommunityIcons name="ellipse"/>
		</View>
	)
}

const header = StyleSheet.create(
	{
		body:
		{
			width: "100%",
			height: 50,
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
		},

		title:
		{
			fontSize: 16,
			fontWeight: 400,
		}



	}
)