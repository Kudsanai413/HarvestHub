import { View, Pressable, Text, StyleSheet } from 'react-native'
import React from 'react'
import { ContractType } from '@/Context/types'
import { formatDate, formatNameInitials } from '@/assets/reusable/constants'
import { app_colors } from '@/assets/styles/colors'

interface props
{
    type: string,
    contract: ContractType
}


export default function ContractCard({ contract, type } : props)
{

    const forFarmers =
    <>
        <View style={ card.body }>
            <Text style={ card.info }>{ contract.buyerID }</Text>
            <Text style={{ ...card.status, color: contract.status ? "green" : "red" }}>status: { contract.status ? "Active" : "Pending Vacant" }</Text>
            <Text style={ card.date }> starts: { formatDate(contract.startDate) } </Text>
            <Text style={ card.initials }> { formatNameInitials(contract.farmerID) } </Text>
        </View>
    </>

    const forBuyers =
    <>
        <View style={ { ...card.body, flexDirection: "column" } }>
            { forFarmers }
            <View>
                <Pressable>Delete</Pressable>
                <Pressable>Edit</Pressable>
            </View>
        </View>
    </>
    return type === "Farmers" ? forFarmers : forBuyers
}

const card = StyleSheet.create(
    {
        body:
        {
            width: "95%",
            height: 65,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            marginHorizontal: "auto",
            position: "relative",
        },

        info:
        {
            minWidth: 100,
            height: "98%",
            marginLeft: 50,
            marginTop: 10,
            fontSize: 15,
            fontWeight: "600"
        },

        initials:
        {
            width: 45,
            height: 45,
            fontSize: 12,
            fontStyle: "italic",
            textAlign: "center",
            textAlignVertical: "center",
            marginVertical: "auto",
            borderRadius: 45,
            backgroundColor: app_colors.secondary,
            position: "absolute",
            paddingTop: 13,
            fontWeight: "500",
            boxShadow: "0 0 5px black"
        },

        status:
        {
            position: "absolute",
            fontSize: 10,
            right: 10,
            bottom: 5,
            fontStyle: "italic"
        },

        date:
        {
            position: "absolute",
            bottom: 5,
            fontSize: 10,
            left: 50
        }

    }
)