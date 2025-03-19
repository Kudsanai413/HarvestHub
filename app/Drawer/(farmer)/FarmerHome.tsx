import { View, Text, TextInput, StyleSheet, FlatList, ScrollView, Image, Pressable } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { styling as global } from '@/assets/styles/global';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { app_colors } from '@/assets/styles/colors';
import { ContractType, Response, UserType, Request } from '@/Context/types';
import { createObject, database, Request as GetRequests } from '@/assets/reusable/api';
import ProduceCard from '@/Components/Buyer/ProduceCard';
import ProduceCardSkeleton from '@/Components/Skeletons/ProduceCardSkeleton';
import useGetLoginContext from '@/Context/LoginContext';
import { formatName } from '@/assets/reusable/constants';
import ContractCard from '@/Components/Farmer/contract-card';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerActions } from "@react-navigation/native";
import useGetApplicationContext from '@/Context/ApplicationContext';

const initState =
{
    contracts: 3,
    notifications: 15,
    deliveries: 25,
    pending: 0
}

export default function Home() {
    const { state : user_state } = useGetLoginContext();
    const { requests, produce, contracts } = useGetApplicationContext();
    const [PotentialBuyers, setPotentialBuyers] = useState<UserType[]>([]);
    const [contractRequests, setContractRequests] = useState<ContractType[]>([]);
    const [state, setState] = useState<typeof initState>(initState);
    const [req, setReqs] = useState<number>(0);
    const loaded = useRef<boolean>(false);
    const navigation = useRouter();
    const navigator = useNavigation();
    useEffect(() =>
    {
        if (!loaded.current)
        {
            fetch(`${ database }/get/Buyers`).then( response =>
            {
                if (!response.ok) throw new Error("Unable To Fetch Buyers With The Same Maain Crop");

                return response.json();
            }).then( (data : Response) =>
                {
                    setPotentialBuyers(data.data);
                }).catch( error => alert(error.message));

            loaded.current = true;

            fetch(`${ database }/get/Contracts`).then( response =>
            {
                if (!response.ok) throw new Error("No Contract Reuests This Week");

                return response.json()
            }).then( (contracts : Response) =>
                {
                    setContractRequests(contracts.data);
                }).catch(error => console.log("An Error Occured"))

            const object = createObject("POST", {
				"id": user_state.user.userID,
				column: user_state.user_type === "Farmers" ? "FarmerID" : "BuyerID"
			});

			GetRequests(`${ database }/get/Requests`, object)
						.then( (req : Response) => {
							if ( req.data )
							{
								const read = req.data.filter( (request : Request) => request.status === "Accepted");
								const rejects = req.data.filter( (request : Request) => request.status === "Rejected");
								const  unread = req.data.filter( (request : Request) => request.status === "Pending");
                                const currReqs = requests.filter((request : Request) => request.farmer === user_state.user.userID)
								setReqs(currReqs.length)
							}
						})

        }
    });
    return (
        <>
            <View style={ global.header}>
                <Pressable
                    onPress={() => {
                        navigator.dispatch(DrawerActions.openDrawer())
                    }}
                >
                    <MaterialCommunityIcons name="menu" size={35} color={ app_colors.secondary }/>
                </Pressable>
                <Image source={ require("@/assets/images/user.jpg")} style={{ width: 50, height: 50, borderRadius: 50, marginVertical: "auto" }}/>
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
            >
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
                        <Text style={ styles.num_bubble }>{ req }</Text>
                        <Text> Buyer Requests </Text>
                    </Pressable>
                </View>
                <Text style={ [global.title, global.left_title] }>{ user_state.user.main_crop } Buyers In Your Area</Text>
                {
                    PotentialBuyers.length ?
                        <FlatList
                            keyExtractor={ ( item : UserType ) => item.userID}
                            data={ PotentialBuyers }
                            renderItem={ ({ item }) => <ProduceCard crop={ item.main_crop } farmer={ formatName(item.Name) } type='buyers-contractors'/> }
                            horizontal
                            showsHorizontalScrollIndicator={ false }
                        />
                        :
                        <>
                            <ScrollView horizontal showsHorizontalScrollIndicator={ false }>
                                <Text>{PotentialBuyers.length}</Text>
                                <ProduceCardSkeleton/>
                                <ProduceCardSkeleton/>
                                <ProduceCardSkeleton/>
                            </ScrollView>
                        </>
                }

                <Text style={ [global.title, global.left_title] }> Contract Requests In Your Area</Text>
                {
                    contractRequests.length?
                        <FlatList
                            keyExtractor={ contract => contract.contractID }
                            data={ contractRequests }
                            renderItem={ ({ item }) => <ContractCard contract={ item } />  }
                            horizontal
                            showsHorizontalScrollIndicator={ false }
                        />
                            : <Text> No Contracts </Text>
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