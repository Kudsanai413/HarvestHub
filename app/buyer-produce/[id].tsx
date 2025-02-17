import { View, Text, ScrollView, Image, ImageBackground, TextInput, Pressable, FlatList, StyleSheet, Modal } from 'react-native';
import React, { useState } from 'react';
// import { getImage } from '@/Components/Buyer/produce-list-item';
import { Stack, useLocalSearchParams as useParams } from "expo-router";
import useGetProduceContext from '@/Context/ProductContext';
import { ProduceType, UserType } from '@/Context/types';
import { base_url, database } from '@/assets/reusable/api';
import useGetFileContext from '@/Context/FileContext';
import { styling as order } from '@/assets/styles/OrderProduce';
import CustomButton from '@/Components/CustomButton';
import Select from '@/Components/Select';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { app_colors, font } from '@/assets/styles/colors';
import AdditionListItem from '@/Components/Buyer/addition-crop-item';
import { styling as global } from '@/assets/styles/global';
import AdditionalCropImages from '@/Components/Buyer/AdditionalCropImages';
import useGetLoginContext from '@/Context/LoginContext';
import useGenerateAlert from '@/Context/AlertContext';

const opts = ["1kg", "2kg", "3kg", "4kg", "5kg"];
let key = 0;


export default function IndividualPage() {

    const [farmer, setFarmer] = useState<UserType>({ userID: '',Name: '',date_birth: '',contact: '',location: '',main_crop: '',Additional_crops: null });
    const [modalTitle, setModalTitle] = useState<string>("Crop Type");
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [visibleCrop, setVisibleCrop] = useState<number>(0);
    const { Alert } = useGenerateAlert();
    const { id } = useParams();
    const [cart, setCart] = useState<string>("Everything In Cart")
    const { state } = useGetProduceContext();
    const { Image : images, getImage } = useGetFileContext();
    const { state: logged } = useGetLoginContext();
    const currProduce : ProduceType = state.produces.filter( (produce : ProduceType) => produce.produceID === id)[0];

    //  AN IIFE To fetch the Farmer Who Owns Crop
    (() =>
    {
        fetch(`${ database }/get/Farmers/*/${ id }`)
            .then(response =>
                {
                    if (!response.ok) throw new Error(`Failed To Fetch Farmer - ${ id }`);

                    return response.json()
                }).then( data =>
                    {
                        if ( data.length !== 1) throw new Error(`Failed To Fetch Farmer - ${ id }`)

                        return data[0];
                    }).then( farmer =>
                        {
                            setFarmer(farmer)
                            Alert({
                                type: "Farmer Fetch",
                                message: JSON.stringify(farmer)
                            })
                        }).catch( error => console.log(error.message))
    })()

  return (
    <>
        <Stack.Screen options={{ title: farmer.Name, headerShown: false }}/>
        <ScrollView>
            <ImageBackground source={ getImage(currProduce.produceType)  } style={ order.container }>

                <Image source={ require("@/assets/images/person-2.jpg") }  style={ order.crop_image } />

            </ImageBackground>

            <Text style={ order.crop_type } >{ currProduce.produceType }</Text>

            <View style={ order.buttons_strip }>
                <CustomButton icon='bell' text='alert' button_type='circle'/>
                <CustomButton icon='chat' text='Message' button_type='circle'/>
                <CustomButton icon='cart' text='cart' button_type='circle'/>
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
                    value={` I would like to buy -> ${ cart }\n Is It Still Available`}
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
    </>
  )
}

