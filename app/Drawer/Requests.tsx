import { View, Text, Image, Pressable, Appearance, ScrollView, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Drawer } from "expo-router/drawer"
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useGetLoginContext from '@/Context/LoginContext';
import { app_colors } from '@/assets/styles/colors';
import { styling } from '@/assets/styles/global';
import { Request, Response } from '@/Context/types';
import { createObject, database, Request as GetRequests } from '@/assets/reusable/api';
import RequestCard from '@/Components/Farmer/RequestCard';

interface buyer_requests
{
	unread: Request[],
	accepted: Request[],
	rejected: Request[]
}

export default function Requests() {
	const navigation = useRouter();
	const { state } = useGetLoginContext();
	const [home, setHome] = useState<string>("");
	const [requests, setRequests] = useState<buyer_requests>()
	useEffect(() =>
	{
		if ( state.user_type && state.user.userID?.length )
		{
			const object = createObject("POST", {
				"id": state.user.userID,
				column: state.user_type === "Farmers" ? "FarmerID" : "BuyerID"
			});

			GetRequests(`${ database }/get/Requests`, object)
						.then( (req : Response) => {
							if ( req.data )
							{
								const read = req.data.filter( (request : Request) => request.status === "Accepted");
								const rejects = req.data.filter( (request : Request) => request.status === "Rejected");
								const  unread = req.data.filter( (request : Request) => request.status === "Pending");

								setRequests({
									accepted: read,
									rejected: rejects,
									unread: unread
								})
							}
						})


			state.user_type === "Buyers" ?
				setHome("(buyers)/BuyerHome")
					: state.user_type === "Farmers" ?
						setHome("(farmer)/FarmerHome")
							: navigation.replace("/")
		}



		// else navigation.replace("/")

	}, [])
  return (
    <>
		<Drawer.Screen
			options={{
				headerShown: true,
				headerLeft: () => <Ionicons name="arrow-back" size={ 24 } onPress={ () => {
						navigation.replace(`/Drawer/${ home }`)
					} }
					color={ Appearance.getColorScheme() === "dark" ? app_colors.tetiary : app_colors.black }
				/>,
				headerTitleAlign: "center",
				headerTintColor: Appearance.getColorScheme() === "dark" ? app_colors.tetiary : app_colors.black
			}}

		/>
			<ScrollView
				contentContainerStyle={{
					maxHeight: "auto"
				}}
			>
				<FlatList
					data={ requests?.unread }
					renderItem={ ({ item }) => <RequestCard request={ item }/> }
					ItemSeparatorComponent={ <View style={{
						width: "90%",
						height: 1,
						backgroundColor: app_colors.fade,
						marginHorizontal: "auto"
					}}/> }
					showsVerticalScrollIndicator={ false }
				/>
			</ScrollView>
    </>
  )
}