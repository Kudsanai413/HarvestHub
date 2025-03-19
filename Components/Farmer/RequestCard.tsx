import { View, Text, Image, StyleSheet, Appearance } from 'react-native'
import { styling as global } from "@/assets/styles/global"
import React, { useEffect, useState } from 'react'
import CustomButton from '../CustomButton'
import { app_colors } from '@/assets/styles/colors'
import { Request, Response } from '@/Context/types'
import { createObject, database, Request as GetName } from '@/assets/reusable/api'

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
    GetName(`${ database }/update/Requests`).then( (response : Response) =>
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
    const [ buyerName, setBuyerName ] = useState<string>();
    useEffect(() =>
    {
        fetch(`${ database }/get/Buyers/BuyerName/${ request.buyer }`).then( response =>
        {
            if (!response.ok) throw new Error("Failed To Fetch Farmer Name")
            return response.json()
        }).then( (response : Response) =>
        {
            setBuyerName(response.data)
        }).catch(error => console.error(error))
    },[])
  return (
    <View style={ requests.card }>
        <Image source={ require("@/assets/images/GC.png") } style={ requests.image }/>
        <Text style={{ flexGrow: 1 }}>{ buyerName }</Text>
        <View style={ requests.cart }>
            <View style={ requests.cart_info }>
                <Text style={ requests.cart_title }>
                    crop name:
                </Text>
                <Text style={ requests.cart_text }>{ request.crop }</Text>
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
            <CustomButton text='Accept' color={ app_colors.primary } handleClick={ () => handlaAccept(request.request)}/>
            <CustomButton text='Reject' color="red" handleClick={ () => handlaReject(request.request)}/>
        </View>
    </View>
  )
}

const requests = StyleSheet.create(
    {
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
        }
    }
)