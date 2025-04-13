import { View, Text, Image, StyleSheet, Appearance, Modal, Button, TextInput } from 'react-native'
import { styling as global } from "@/assets/styles/global"
import React, { useEffect, useState } from 'react'
import CustomButton from '../CustomButton'
import { app_colors } from '@/assets/styles/colors'
import { Request, Response } from '@/Context/types'
import { createObject, database, Request as GetName, socket } from '@/assets/reusable/api';
import { nanoid } from "nanoid";
import { formatISO } from 'date-fns'
import useGetLoginContext from '@/Context/LoginContext';

interface props
{
    request: Request
}

const handlaAccept = (id : string) => {
    const object =  createObject("POST", {
        column: "status",
        "new-value": "Accepted",
        id: id
    })
    GetName(`${ database }/update/Requests`, object).then( (response : Response) =>
    {
        alert(response.message)
    })
}
const handlaReject = (id : string) => {
    const object =  createObject("POST", {
        column: "status",
        "new-value": "Rejected",
        id: id
    })
    GetName(`${ database }/update/Requests`, object).then( (response : Response) =>
    {
        alert(response.message)
    })
}

export default function RequestCard({ request } : props) {
    const [justification, setJustification] = useState<string>("");
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const { state } = useGetLoginContext();
  return (
    <>
        <View style={ requests.card }>
            <Image source={ require("@/assets/images/GC.png") } style={ requests.image }/>
            <Text style={{ flexGrow: 1 }}>{ request.buyerORfarmer }</Text>
            <View style={ requests.cart }>
                <View style={ requests.cart_info }>
                    <Text style={ requests.cart_title }>
                        crop name:
                    </Text>
                    <Text style={ requests.cart_text }>{ request.crop }</Text>
                </View>
                <View style={ requests.cart_info }>
                    <Text style={ requests.cart_title }>
                        crop grade:
                    </Text>
                    <Text style={ requests.cart_text }>{ request.grade }</Text>
                </View>
                <View style={ requests.cart_info }>
                    <Text style={ requests.cart_title }>
                        quantity:
                    </Text>
                    <Text style={ requests.cart_text }>{ request.quantity }</Text>
                </View>
                <View style={ requests.cart_info }>
                    <Text style={ requests.cart_title }>
                        price:
                    </Text>
                    <Text style={ requests.cart_text }>{ request.price }</Text>
                </View>
                <View style={ requests.cart_info }>
                    <Text style={ requests.cart_title }>Total price:</Text>
                    <Text style={ requests.cart_text }>${ request.price * request.quantity }</Text>
                </View>
            </View>
            <View style={ requests.buttons }>
                <CustomButton text='Accept' color={ app_colors.primary } handleClick={ () => {
                    setModalVisible(true)
                    handlaAccept(request.request)
                }}/>
                <CustomButton text='Reject' color="red" handleClick={ () =>{
                    setModalVisible(true)
                    handlaReject(request.request)
                }}/>
            </View>
        </View>
        <Modal transparent visible={ modalVisible }>
            <View style={ requests.form }>
                <Text style={ requests.title}>Reason For Rejection</Text>
                <TextInput
                    multiline
                    value={ justification }
                    placeholder='example: I Only Have 7 Crate Lefts'
                    style={{
                        width: "90%",
                        height: 275,
                        borderRadius: 2,
                        borderWidth: 0.5,
                        borderColor: app_colors.fade,
                        textAlign: "center",
                        padding: 5
                    }}
                    placeholderTextColor="grey"
                    onChangeText={(text) => setJustification(text)}
                />
                <View style={{ width: "85%", height: 50}}>
                    <Button color={ app_colors.primary } title='Send'
                        onPress={() => {
                            setModalVisible(false)
                            socket.emit("send-message", {
                                receiver: request.perpID,
                                message: {
                                    _id: nanoid(6),
                                    user:{
                                        _id: state.user.userID,
                                        text: justification,
                                        createdAt: formatISO(new Date())
                                    }

                                }
                            })
                        }}
                    />
                </View>
            </View>
        </Modal>
    </>
  )
}

const requests = StyleSheet.create(
    {
        form:
        {
            width: 375,
            height: 400,
            borderRadius: 10,
            boxShadow: "0 0 5px black",
            marginHorizontal:"auto",
            marginVertical:"auto",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "white",
            padding: 5

        },
        card:
        {
            width: "96%",
            height: 250,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent:"flex-start",
            alignItems: "center",
            padding: 10,
            marginHorizontal:  "auto",
            boxShadow: Appearance.getColorScheme() === "dark" ? " 0 0 5px black": "0 0 2px black",
            marginVertical: 10,
            borderRadius: 5
        },

        image:
        {
            width: 40,
            height: 40,
            borderRadius: "50%",
        },
        cart:
        {
            width: "90%",
            height: 110,
            borderRadius: 5,
            justifyContent:"space-evenly",
            alignItems: "center",
            marginHorizontal:  "auto",
        },
        cart_info:
        {
            flexDirection: "row",
            width: "75%",
            justifyContent: "space-between",
        },
        cart_title:
        {
            fontSize: 10,
            fontWeight: "light",
            fontStyle: "italic",
            textAlign: "left",
            textAlignVertical: "center",
            width: "75%",
            color: Appearance.getColorScheme() === "dark" ? "white" : app_colors.fade
        },
        cart_text:
        {
            fontSize: 14,
            fontStyle: "normal",
            fontWeight: "400",
            textAlign: "right",
            marginLeft: 100
        },

        buttons:
        {
            width: "80%",
            minHeight: 40,
            justifyContent: "space-around",
            alignItems: "center",
            flexDirection: "row",
            marginHorizontal: "auto"
        },
        title:
        {
            fontSize: 22,
            fontWeight: 400,

        }
    }
)