import { View, Text, Image, Modal, Alert, StyleSheet, Pressable, FlatList, Appearance } from 'react-native';
import React, { useReducer, useRef } from 'react';
import { useEffect, useState } from "react";
import { ActionType, button, ProduceType, Response, UserType } from '@/Context/types';
import { createObject, database, Request } from '@/assets/reusable/api';
import useGetFileContext from '@/Context/FileContext';
import { styling as global } from '@/assets/styles/global';
import { app_colors, font } from '@/assets/styles/colors';
import CustomButton from '@/Components/CustomButton';
import Select from '@/Components/Select';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import CustomTextBox from '@/Components/CustomTextbox';
import useGetLoginContext from '@/Context/LoginContext';
import useGenerateAlert from '@/Context/AlertContext';
import { useRouter } from 'expo-router';
import ProduceListItem from '@/Components/Farmer/ProduceListItem';
import ImageBackgroundComponent from '@/Components/ImageBackgroundComponent';
import useGetUserContext from '@/Context/UserContext';
import { getSession } from '@/assets/reusable/constants';
const logged_user = getSession().then( user => { return user }).catch( error => console.error(error));
const produces : ProduceType[] = []

const initReducerState =
{
	visible: false,
	produce: "",
	price: "",
	units: "",
	stock: 1,
	in_store: produces
};

const info =
{
	user: {
		main_crop: "Tomatoes",
		Additional_crops: [],
	}
}

const reducerActions = ( state : typeof initReducerState, action : ActionType) : typeof initReducerState =>
	{
		switch(action.type)
		{
			case "visibility":
				return { ...state, visible: action.payload };

			case "produce":
				return { ...state, produce: action.payload };

			case "price":
				return { ...state, price: action.payload };

			case "stock":
				return {...state, stock: action.payload};

			case "unit":
				return { ...state, units: action.payload }

			case "in-store":
				return { ...state, in_store: action.payload };

			default:
				Alert.alert("Unnrecognnizezd Action");
				return state
		}
	}


export default function ProductListings() {
	const { dispatch : alert, Alert } = useGenerateAlert()
	const { state : login } = useGetLoginContext();
	const { state : user} = useGetUserContext();
	const { getImage } = useGetFileContext();
	const [modal2Visible, setModalVisible] = useState<boolean>(false);
	const [items, dispatch] = useReducer(reducerActions, initReducerState);
	const navigate_to = useRouter();
	const [ crops, setCrops ] = useState<string[]>([]);
	const [ logged, setLogin ] = useState<UserType>();
    const [listStyle, setListStyle] = useState<"grid" | "list">("grid");

	useEffect(() =>
		{
			if ( login.user.userID )
			{
				const method_object = createObject("POST", {
					id : login.user.userID
				});
				Request(`${ database }/get/Produce`, method_object )
						.then((data : Response) =>
						{
							if ( data.data )
							{
								dispatch({ type: "in-store", payload: data.data });
							}

							else
							{
								alert({ type: "error-message", payload: data.message})
								alert({ type: "show-alert", payload: true })
							}
						})
			}

			else if (logged_user !== null)
			{
				window.alert(JSON.stringify(logged_user))
				Alert({
					type: "Session Found",
					message: JSON.stringify(logged_user)
				})
			}

			else
			{
				alert({ type: "error-type", payload: "Login Error" });
				alert({ type: "error-message", payload: "Please Login To Harvest, Your Data Is Unavailable"});
				const the_button : button=
					{
						text: "Login",
						onClick: () => {
							navigate_to.push("/");
							alert({ type: "show-alert", payload: false})
						}
					}

				alert({ type: "alert-button", payload: the_button });
				alert({ type: "show-alert", payload: true })

			}
		}
	, [])

  return (
		<>
			<View style={[ styling.body , { width: "100%" }]}>
				<Image source={ require("@/assets/images/user.jpg")} style={{ width: 150, height: 150, borderRadius: 150}}/>
				<View style={ styling["filter-view"] }>
					<MaterialCommunityIcons name="sort" size={ 25 } color={ Appearance.getColorScheme() === "dark" ? app_colors.tetiary : app_colors.fade }/>
					<Pressable onPress={ () => setListStyle( listStyle === "grid" ? "list" : "grid" )}>
						<Ionicons name="grid-outline" size={ 25 } color={ Appearance.getColorScheme() === "dark" ? app_colors.tetiary : app_colors.fade }/>
					</Pressable>
				</View>
				<View style={ styling.line }/>
				{
					items.in_store.length ?
						<>
							<FlatList
								data={ items.in_store }
								keyExtractor={ (key) => key.produceID }
								renderItem={ ({ item }) => <ProduceListItem produce={ item } style={ listStyle }/>}
								contentContainerStyle={{
									width: "100%",
									flexDirection: "row",
									flexWrap: "wrap",
									justifyContent: "center",
									alignItems: "center"
								}}
								showsHorizontalScrollIndicator={ false }
								showsVerticalScrollIndicator={ false }
							/>
						</>
							:
							<>
								<MaterialCommunityIcons name="store-alert" color={app_colors.tetiary} size={ 75 }/>
								<Text style={{ color: app_colors.tetiary, marginBottom: 200 }}>It Appears You Don't Have Items in Produce Store</Text>
							</>
				}

				<CustomButton
					icon='plus' text=''
					button_type='circle'
					handleClick={ () => {
						if (login.user.Additional_crops.length)
						{
							setCrops([...login.user.Additional_crops, login.user.main_crop])
							dispatch({type:"visibility", payload : true })
						}

						else
						{
							dispatch({ type: "produce", payload: login.user.main_crop });
							setModalVisible(true)
						}
					}}
					style={ styling.button }
				/>

				<Modal visible={ items.visible } transparent >
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center"
						}}
					>
						<Select options={ crops } size={300} master={'farmer-add'} dispatch={ dispatch } modal={ setModalVisible }/>
					</View>
				</Modal>
			</View>

			<Modal transparent visible={ modal2Visible } onLayout={ () => dispatch({ type: "visibility", payload: false })} animationType='slide'>
				<View style={ styling.modal }>
					<ImageBackgroundComponent
						image_source={ getImage(items.produce) }
						glassy={25}
					>

						<View style={{
							...global.body,
							width: "100%",
							position: "relative",
							borderRadius: "inherit"

						}}>
							<Pressable onPress={ () => setModalVisible(false) }>
								<Ionicons name='close' size={ 26 } color={ app_colors.black }/>
							</Pressable>
							<Text style={ styling.modal_title }>{ items.produce }</Text>
							<CustomTextBox title='price/$' contents={ items.price } typing={ dispatch } action="price"  width="80%" />
							<CustomTextBox title='Units for Price' contents={ items.units } typing={ dispatch } action="unit"  width="80%" />
							<CustomTextBox title='In-Stock' contents={ items.stock.toString() } typing={ dispatch } action="stock"  width="80%" />
							<CustomButton
								text='send'
								icon='upload'
								style={ styling.button_margin }
								handleClick={() => {
									const method_object = createObject(
										"POST",
										{
											user_id: login.user.userID,
											produce: items.produce,
											price: parseFloat(items.price),
											units: items.units,
											stock: items.stock,
										}
									);
									window.alert(JSON.stringify(method_object))
									Request(`${ database }/produce-add`, method_object)
											.then( (response : Response ) =>
												{
													alert({ type: "error-message", payload: response.error });
													alert({ type: "error-message", payload: response.message });
													alert({ type: "show", payload: true });
												}).catch( error =>
													{
														alert({ type: "error-message", payload: error.message });
														alert({ type: "show", payload: true });
													});

									setModalVisible(false)
								}}
							/>
						</View>
					</ImageBackgroundComponent>
				</View>
			</Modal>
		</>
  )
}

const styling = StyleSheet.create(
	{
		body:
		{
			flex: 1,
			alignItems: "center",
			paddingTop: 20,
			position: "relative",
		},

		line:
		{
			height: 1,
			width: "90%",
			backgroundColor: app_colors.primary,
			marginVertical: 25,
		},

		button:
		{
			position: "absolute",
			right: 15,
			bottom: 45,
		},

		modal:
		{
			width: "100%",
			height: "70%",
			backgroundColor: "red",
			position: "fixed",
			bottom: 0,
			borderTopRightRadius: 50,
			borderTopLeftRadius: 50,
			marginHorizontal: "auto"
		},

		modal_title:
		{
			fontFamily: font.family,
			fontSize: font.size + 4,
			color: app_colors.white,
			marginVertical: 20,
		},
		button_margin:
		{
			position: "absolute",
			bottom: 80,
		},

		"filter-view":
		{
			width: 100,
			height: 50,
			position: "absolute",
			right: 0,
			top: 200,
			flexDirection: "row",
			justifyContent: "space-evenly"

		}


	}
);