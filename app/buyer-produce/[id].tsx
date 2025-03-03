import { View, Text, ScrollView, Image, ImageBackground, TextInput, Pressable, FlatList, StyleSheet, Modal } from 'react-native';
import React, { useEffect, useReducer, useState } from 'react';
// import { getImage } from '@/Components/Buyer/produce-list-item';
import { Stack, useLocalSearchParams as useParams } from "expo-router";
import useGetProduceContext from '@/Context/ProductContext';
import { ActionType, ProduceType, Response, UserType } from '@/Context/types';
import { base_url, createObject, database, Request } from '@/assets/reusable/api';
import useGetFileContext from '@/Context/FileContext';
import { styling as order } from '@/assets/styles/OrderProduce';
import CustomButton from '@/Components/CustomButton';
import Select from '@/Components/Select';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { app_colors, font } from '@/assets/styles/colors';
import AdditionListItem from '@/Components/Buyer/addition-crop-item';
import { styling as global } from '@/assets/styles/global';
import AdditionalCropImages from '@/Components/Buyer/AdditionalCropImages';
import useGetLoginContext from '@/Context/LoginContext';
import useGenerateAlert from '@/Context/AlertContext';
import ImageBackgroundComponent from '@/Components/ImageBackgroundComponent';
import CustomTextBox from '@/Components/CustomTextbox';

const opts = ["1kg", "2kg", "3kg", "4kg", "5kg"];
let key = 0;

const initState = {
    quantity: "",
    price: "",
    product: "",
    visibleModal: false
}

const reducer = (state : typeof initState, action : ActionType) : typeof initState | any=>
{
    switch( action.type)
    {
        case "quantity":
            return { ...state, quantity: action.payload };

        case "price":
            return { ...state, price: action.payload };

        case "produce":
            return { ...state, product: action.payload };

        case "visible":
            return { ...state, visibleModal: action.payload };

        case "default":
            return initState
    }
}



export default function IndividualPage() {
    const [farmer, setFarmer] = useState<UserType>({ userID: '',Name: '',date_birth: '',contact: '',location: '',main_crop: '',Additional_crops: null });
    const [modalTitle, setModalTitle] = useState<string>("Crop Type");
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [visibleCrop, setVisibleCrop] = useState<number>(0);
    const { Alert, dispatch : alert } = useGenerateAlert();
    const { id } = useParams();
    const [cart, setCart] = useState<string>("Everything In Cart")
    const { state } = useGetProduceContext();
    const { Image : images, getImage } = useGetFileContext();
    const { state: logged } = useGetLoginContext();
    const currProduce : ProduceType = state.produces.filter( (produce : ProduceType) => produce.produceID === id)[0];
    const [ quantity, setQuantity ] = useState<number>(0);
    const [items, dispatch] = useReducer(reducer, initState);
    //  AN IIFE To fetch the Farmer Who Owns Crop


    useEffect(() =>
    {
        fetch(`${ database }/get/Farmers/*/${ currProduce.farmerID }`)
            .then(response =>
                {
                    if (!response.ok) throw new Error(`Failed To Fetch Farmer 1 - ${ currProduce.farmerID }`);

                    return response.json()
                }).then( data =>
                    {
                        if ( data.length !== 1) throw new Error(`Failed To Fetch Farmer 2 - ${ currProduce.farmerID } => ${ data.data }`)

                        return data[0];
                    }).then( farmer =>
                        {
                            setFarmer(farmer)
                            Alert({
                                type: "Farmer Fetch",
                                message: JSON.stringify(farmer)
                            })
                        }).catch( error => console.log(error.message))

        dispatch({ type: "produce", payload: currProduce.produceType })
        dispatch({ type: "price", payload: currProduce.price })

    }, [])

  return (
    <>
        <Stack.Screen options={{ title: farmer.Name, headerShown: false }}/>
        <ScrollView>
            <ImageBackground source={ getImage(currProduce.produceType)  } style={ order.container }>

                <Image source={ require("@/assets/images/person-2.jpg") }  style={ order.crop_image } />

            </ImageBackground>

            <Text style={ order.crop_type } >{ currProduce.produceType }</Text>

            <View style={ order.buttons_strip }>
                <CustomButton icon='bell' text='alert' button_type='circle' />
                <CustomButton icon='chat' text='Message' button_type='circle'/>
                <CustomButton icon='cart' text='cart' button_type='circle' handleClick={ () => dispatch({ type: "visible", payload: true})}/>
                <CustomButton icon='file-contract' text='Contract' type="FA" button_type='circle' />
            </View>

            <View>

                <Text style={ order.gallery_title }>Gallery</Text>
                <View style={ order.gallery_container }>
                    <Image source={ require("@/assets/images/beet2.jpg")} style={ order.gallery_image }/>
                    <Image source={ require("@/assets/images/beet4.jpg")} style={ order.gallery_image }/>
                    <Image source={ require("@/assets/images/Beet.jpg")}  style={ order.gallery_image }/>
                    <Image source={ require("@/assets/images/beet3.jpg")} style={ order.gallery_image }/>
                </View>

            </View>

            <View style={ order.message_container }>
                <View style={ order.message_top }>
                    <MaterialCommunityIcons
                        name="message-bulleted"
                        size={25}
                        color={ app_colors.fade }
                    />
                    <Text style={ order.message_top_text }>Message { farmer.Name } My Cart</Text>
                </View>
                <TextInput
                    value={`Hi, Would You Be Interested In Making A Contract With Me`}
                    multiline
                    onChangeText={ (txt) => setCart(txt) }
                    style={ order.message_textbox }
                />
                <Pressable style={ order.message_button }>
                    <Text style={{ fontFamily: font.family, color: app_colors.white }}> Send </Text>
                </Pressable>
            </View>
            <View style={{ display: "none"}}>

                <Select options={ opts } size={ 200 } master='Quantity'/>

            </View>
            <Text style={ global.title }>{ farmer.Name} Is Also Selling </Text>
            {
                farmer.Additional_crops?.length ?
                    <FlatList
                        data={ farmer.Additional_crops }
                        renderItem={ ({ item }) => <AdditionListItem item={ item } setVisible={ setModalVisible }/>}
                        ItemSeparatorComponent={ <View style={{
                                width: "88%",
                                height: 1,
                                backgroundColor: app_colors.fade,
                                marginHorizontal: "auto"
                            }}/>
                        }
                    />
                        : <Text> No Additional Crops </Text>
            }
        </ScrollView>
        <Modal visible={ modalVisible } transparent animationType='fade'>
            <View style={ global.blurry_container }>
                <Pressable
                    style={{
                        width: 50,
                        height: 50,
                        position: "absolute",
                        right: -5,
                        top: 10
                    }}
                    onPress={ () => setModalVisible(false)}
                >
                    <MaterialCommunityIcons name="close" size={ 35 } color={ app_colors.black }/>
                </Pressable>

                <AdditionalCropImages title={ modalTitle } produce_id={ currProduce.produceID} farmer_id={ currProduce.farmerID }/>


            </View>
        </Modal>
        <Modal visible={ items.visibleModal } animationType='slide' transparent>
            <View style={ styling.modal }>
					<ImageBackgroundComponent
						image_source={ getImage(items.product) }
						glassy={25}
					>

						<View style={{
							...global.body,
							width: "100%",
							position: "relative",
							borderRadius: "inherit"

						}}>
							<Pressable onPress={ () => dispatch({ type: "visible", payload: false }) }>
								<Ionicons name='close' size={ 26 } color={ app_colors.black }/>
							</Pressable>
							<Text style={ styling.modal_title }>Create { items.product } Cart</Text>
							<CustomTextBox title='price/$' contents={ items.price } typing={ dispatch } action="price"  width="80%" />
							<CustomTextBox title='quantity' contents={ items.quantity } typing={ dispatch } action="quantity"  width="80%" />
							<CustomButton
								text='send'
								icon='upload'
								style={ styling.button_margin }
								handleClick={() => {
                                    dispatch({ type: "default", payload: false })
                                    const object = createObject("POST",
                                        {
                                            buyer: logged.user?.userID,
                                            farmer: currProduce.farmerID,
                                            crop: items.product,
                                            quantity: items.quantity,
                                            price: items.price,
                                            status: "Pending"
                                        })
                                    Request(`${ database }/admin/requests`, object)
                                    .then((response : Response) =>
                                    {
                                        if (response.error)
                                        {
                                            alert({ type: "error-type", payload: "Request To Farmer"})
                                            alert({ type: "error-message", payload: `${response.message} to ${ farmer.Name }` })
                                            alert({ type: "show-alert", payload: true })
                                        }
                                    })
                                }}
                                color='white'
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
			height: "80%",
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
            width: 90,
            height: 40,
            backgroundColor: app_colors.white
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