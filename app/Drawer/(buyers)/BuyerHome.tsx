import { View, Text, Image, FlatList, ScrollView, Pressable, StyleSheet } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Stack } from 'expo-router'
import useGetLoginContext from '@/Context/LoginContext';
import useGetFileContext from '@/Context/FileContext';
import useGetProduceContext from '@/Context/ProductContext';
import { ProduceType, UserType } from '@/Context/types';
import ProduceCard from '@/Components/Buyer/ProduceCard';
import axios from "axios"
import { base_url } from '@/assets/reusable/api';
import ProduceCardSkeleton from '@/Components/Skeletons/ProduceCardSkeleton';
import { styling } from '@/assets/styles/global';
import { useNavigation } from 'expo-router';
import { app_colors } from '@/assets/styles/colors';
import { DrawerActions } from "@react-navigation/native"
import { MaterialCommunityIcons } from '@expo/vector-icons';

const state = {
    contracts: 3,
    notifications: 15,
    deliveries: 25,
    pending: 0
}
export default function Home() {
    const { state } = useGetLoginContext();
	const { state: prod_state } = useGetProduceContext();
	const navigation = useNavigation();


	const getThirdProduce = () : ProduceType[] =>
	{
		const things = prod_state.produces.length;
		const produces: ProduceType[] = []
		for ( let i = 0; i < Math.floor(things / 3) ; i++)
		{
			produces.push(prod_state.produces[i]);
		}
		return produces
	}

	return (
	<>
		<View style={ styling.header}>
			<Pressable
				onPress={() => {
					navigation.dispatch(DrawerActions.openDrawer())
				}}
			>
				<MaterialCommunityIcons name="menu" size={35} color={ app_colors.secondary }/>
			</Pressable>
			<Image source={ require("@/assets/images/user.jpg")} style={{ width: 50, height: 50, borderRadius: 50, marginVertical: "auto" }}/>
		</View>

		<ScrollView>
			<View style={ styles.tiles_container }>
				<View style={ styles.tile }>
					<MaterialCommunityIcons name="bell-ring" color={ app_colors.tetiary } size={ 28 }/>
					<Text style={ styles.num_bubble }>{ state.deliveries }</Text>
					<Text> Notifications</Text>
				</View>
				<View style={ styles.tile }>
					<MaterialCommunityIcons name="truck-delivery" color={ app_colors.tetiary } size={ 28 }/>
					<Text style={ styles.num_bubble }>{ state.deliveries }</Text>
					<Text> Deliveries</Text>
				</View>
				<View style={ styles.tile }>
					<MaterialCommunityIcons name="handshake" color={ app_colors.tetiary } size={ 28 }/>
					<Text style={ styles.num_bubble }>{ 39 }</Text>
					<Text> Contracts</Text>
				</View>
				<Pressable style={ styles.tile }
					onPress={ () => navigation.push("/Drawer/Requests")}
				>
					<MaterialCommunityIcons name="email-receive-outline" color={ app_colors.tetiary } size={ 28 }/>
					<Text style={ styles.num_bubble }>{ 9 }</Text>
					<Text> Buyer Requests </Text>
				</Pressable>
			</View>
			<Text style={ styling.title }>{ state.user ? JSON.stringify(state.user) : "Hello World" }</Text>
			{
				prod_state.produces && prod_state.produces.length ?
					<FlatList
						keyExtractor={ ( item : ProduceType ) => item.produceID}
						data={ getThirdProduce() }
						renderItem={ ({ item }) => <ProduceCard crop={item.produceType} farmer={item.farmerID} type={''}/> }
						horizontal
						showsHorizontalScrollIndicator={ false }
					/>
					:
					<>
						<ScrollView horizontal showsHorizontalScrollIndicator={ false }>
							<ProduceCardSkeleton/>
							<ProduceCardSkeleton/>
							<ProduceCardSkeleton/>
						</ScrollView>
					</>
			}
		</ScrollView>
	</>
  )
}

const styles = StyleSheet.create(
    {
        textbox:
        {
            width: "80%",
            height: 40,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            borderRadius: 40,
            borderWidth: 1.5,
            borderColor: app_colors.fade,
            backgroundColor: app_colors.tetiary,
            marginHorizontal: "auto",
            marginVertical: 5,


        },

        tiles_container:
        {
            width: "95%",
            height: 300,
            flexDirection: "row",
            flexWrap: "wrap",
            margin: "auto",            marginTop: 20
        },

        tile :
        {
            width: "45%",
            height: "45%",
            margin: "auto",
            backgroundColor: app_colors.secondary,
            borderRadius: 20,
            position: "relative",
            justifyContent: "center",
            alignItems: "center"
        },

        num_bubble:
        {
            width: 25,
            height: 25,
            borderRadius: 25,
            position: "absolute",
            backgroundColor: "red",
            right: -8,
            top: -8,
            textAlign: "center",
            textAlignVertical: "center"
        }
    }
);