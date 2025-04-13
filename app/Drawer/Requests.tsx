import { View, Text, Image, Pressable, Appearance, ScrollView, FlatList, StyleSheet } from 'react-native';
import React, { SetStateAction, useEffect, useReducer, useRef, useState } from 'react';
import { Drawer } from "expo-router/drawer"
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import useGetLoginContext from '@/Context/LoginContext';
import { app_colors, font } from '@/assets/styles/colors';
import { styling } from '@/assets/styles/global';
import { ActionType, Request, Response } from '@/Context/types';
import { createObject, database, Request as GetRequests, socket } from '@/assets/reusable/api';
import RequestCard from '@/Components/Farmer/RequestCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles as stylez} from './(buyers)/Search';
import useGenerateAlert from '@/Context/AlertContext';
import useGetFileContext from '@/Context/FileContext';

interface buyer_requests
{
	unread: Request[],
	accepted: Request[],
	rejected: Request[]
}



const filter_options : string[] = ["All", "Accepted", "Rejected", "Expired"];
const icons : string[] = ["location", "leaf", "logo-usd", "earth", "documents"]

const filters = {
    options: filter_options,
    icons: icons
};

let key = 0;



const Filter_Opt = ( text : string, selected_filters : string[], dispatch : React.Dispatch<ActionType>, ShowFilters : React.Dispatch<SetStateAction<boolean>> ) : React.JSX.Element =>
{

    const filter = StyleSheet.create(
        {
            tablet:
            {
                alignItems: "center",
                paddingHorizontal: 5,
                maxWidth: 115,
                height: 30,
                borderRadius: 30,
                backgroundColor: selected_filters?.indexOf(text) >= 0 ? app_colors.tetiary : app_colors.skeleton,
                boxShadow: selected_filters?.indexOf(text) >= 0 ? `0 0 5px ${ app_colors.tetiary }` : "0",
                marginHorizontal: 9,
                marginVertical: 2.5,
                justifyContent : "center"
            },

            text:
            {
                fontFamily: font.family,
                color: selected_filters ? app_colors.black : Appearance.getColorScheme() === "dark" ? app_colors.white : app_colors.black,
                textAlignVertical: "center"
            },

            fill:
            {
                alignSelf: "stretch",
                height: "100%",
            }
        }
    )
    return(
        <View style={ text !== "close" ? filter.tablet : { ...filter.tablet, backgroundColor: "transparent"}}>
            <Pressable
                onPress={
                    () => {
                        if (selected_filters?.includes(text))
                        {
                            dispatch({ type: "ignite", payload: selected_filters?.filter(item => item !== text )})
                        }

                        else if (text === "close") ShowFilters(false)

                        else {
                            dispatch({ type: "ignite", payload: [...selected_filters, text]})
                        }
                    }
                }
                style={ text !== "close" ? filter.tablet : { ...filter.tablet, backgroundColor: "transparent"}}
            >
                {
                    text !== "close" ?
                        <Text><Ionicons name={ icons[filter_options.indexOf(text)] } /> { text }</Text>
                            : <Ionicons name='close' size={ 25 } color={ Appearance.getColorScheme() === "dark" ? app_colors.tetiary : app_colors.black }/>
                }
            </Pressable>
        </View>
    );
}

const initState = { selected: [], results: [], Alert: ({}:any) => {} };

const reducer = (state : typeof initState, action : ActionType) : typeof initState | any =>
{
    switch(action.type)
    {
        case "ignite":
            AsyncStorage.setItem("filters",JSON.stringify(action.payload))
            return { ...state, selected:  action.payload  }

        case "search":
             return GetRequests(`${ database }/search/${ action.payload }`)
                .then((results : Response) =>
                {
                    if ( results.data !== null)
                    {
                        return { ...state, results: results.data }
                    }
                })

        default:
            alert("Unrecognized Action")
    }
}




export default function Requests() {
	const navigation = useRouter();
	const { state } = useGetLoginContext();
	const [home, setHome] = useState<string>("");
	const [requests, setRequests] = useState<buyer_requests>();
	const [all_requests, setAllRequests] = useState<Request[]>([]);
	const [items, dispatch] = useReducer(reducer,initState);
	const { dispatch : alert, Alert } = useGenerateAlert();
	const [filtersVisible, setFiltersVisible] = useState<boolean>(false);
	const [selected, setSelected] = useState<string[] | any>([]);

	useEffect(() =>
	{
		if ( state.user_type && state.user.userID?.length )
		{
			const object = createObject("POST", {
				id: state.user.userID,
				column: state.user_type
			});

			GetRequests(`${ database }/admin/myRequests`, object)
						.then((requests: Response) => {
							setAllRequests(requests.data);
						})

			state.user_type === "Buyers" ?
				setHome("(buyers)/BuyerHome")
					: state.user_type === "Farmers" ?
						setHome("(farmer)/FarmerHome")
							: navigation.replace("/")
		}



		// else navigation.replace("/")

	}, [])

	useEffect(() => {
		socket.on("update-request", (things : any) => {
			alert(JSON.stringify(things))
		})
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
				<View style={{ ...styles.filters, display: filtersVisible ? "flex" : "none", width: "100%", marginTop: 10 }}>
                    <FlatList
                        data={ [...filter_options, "close"] }
                        keyExtractor={ (item) => item}
                        renderItem={ ({item}) => Filter_Opt(item, selected, dispatch, setFiltersVisible)}
                        horizontal
                        contentContainerStyle={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={ false }
                    />
                </View>

				<FlatList
					data={ all_requests }
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

const styles = StyleSheet.create(
    {
        textbox:
        {
            width: "85%",
            height: 50,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: app_colors.fade,
            backgroundColor: app_colors.tetiary,
            marginVertical: 5,
        },

        header:
        {
            width: "99%",
            justifyContent: "flex-start",
            height: 70,
            alignItems: "center",
            paddingVertical: 7,
            position: "fixed",
            top: 0,
        },

        headerTitle:
        {
            fontFamily: font.family,
            fontSize: 22,
            color: Appearance.getColorScheme() === "light" ? app_colors.black : app_colors.white,
            fontWeight: 500
        },

        filters:
        {
            width: "98%",
            marginHorizontal: "auto",
            position: "relative",
        },

        close:
        {
            position: "absolute",
            right: 0,
            top: 0,
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center"
        },

        filter_text:
        {
            fontFamily: font.family,
            fontSize: 18,
            fontWeight: 300,
            color: Appearance.getColorScheme() === "dark" ? app_colors.white : app_colors.black
        },

        tile:
        {
            width: 135,
            height: 150,
            backgroundColor: app_colors.tetiary,
            marginHorizontal: 25,
            marginVertical: 15,
            borderRadius: 10,

        },

        "tile-title":
        {
            fontWeight: 600,
            fontSize: 20,
            color: Appearance.getColorScheme() === "dark" ? app_colors.white : app_colors.dark_bg
        },

        error:
        {
            width: "90%",
            fontStyle: "italic",
            fontSize: 20,
            fontWeight: 400,
            textAlign: "center"
        },

        line:
        {
            width: "40%",
            height: 2,
            backgroundColor: app_colors.secondary,
        }



	}
);