import { View, Text, Image, StyleSheet, Pressable, Appearance } from 'react-native'
import React, { useState } from 'react'
import useGetFileContext from '@/Context/FileContext'
import { ProduceType, Response, UserType } from '@/Context/types'
import { useRouter } from 'expo-router'
import { database } from '@/assets/reusable/api';
import { Entypo, Octicons } from '@expo/vector-icons';
import { app_colors } from '@/assets/styles/colors'

type props = {
    produce: ProduceType
}

const images =
[
    "Onions",
    "Tomatoes",
    "Radish",
    "cabbage",
    "Broccoli",
    "carrots",
    "cauliflower",
    "Cucumber",
    "Pepper",
    "Beet",
    "Lettuce",
    "Spinach",
    "Sweet",
    "Chili",
    "Potato"

]


let n : number = 0;

export default function ProduceListItem({ produce } : props) : React.JSX.Element {
    const { Image: imgs, getImage } = useGetFileContext();
    const [location, setLocation] = useState<string>("Bulawayo");
    const [in_stock, setInStock] = useState<boolean>(false);
    const navigate_to = useRouter();

    const getFarmer = (id : string) : string =>
    {
        fetch(`${ database }/get/Farmers/Location/${id}`)
                .then(response =>
                    {
                        if (!response.ok) throw new Error("Failed To Fetch Selling Farmer");

                        n += 1;
                        return response.json()
                    }).then( (farmer : Response) =>
                        {
                            setLocation(farmer.data)
                        }).catch(error => console.log(error.message));


        return " | "
    }

  return (
    <>
        <Pressable
            style={ [styles.list_item] }
            onPress={ () =>{ alert(produce.produceID), navigate_to.push(`/buyer-produce/${produce.produceID}`)}}
        >
            <Text style={ styles.text }>{ produce.produceType }</Text>
            <Text>${ produce.price}/{produce.unit_type}</Text>
            <View style={ styles.locationBand }>
                <Text style={ styles.locationText }><Octicons name='graph' color={"#034400"} size={14}/> { produce.quantity <= 0 ? "Out Of Stock" : "In Stock" } </Text>
                <Text>{ getFarmer(produce.farmerID) }</Text>
                <Text style={ styles.locationText } ><Entypo name='location' color={"#034400"} size={14}/> { location }</Text>
            </View>
            <Image source={ getImage(produce.produceType) } style={ styles.produce }/>
        </Pressable>
        {/* <View style={ styles.separator }>.</View> */}
    </>
  )
}

const styles = StyleSheet.create(
    {
        list_item:
        {
            width: "90%",
            height: 80,
            borderRadius: 10,
            marginHorizontal: "auto",
            flexDirection: "row",
            position: "relative",
            marginVertical: 10,
            // boxShadow: "0 0 2px #034400",
            borderStyle: "solid",
            borderColor: "#034400",
            borderWidth: 1.25,
            backgroundColor: Appearance.getColorScheme() === "dark" ? app_colors.dark_cardbg : app_colors.white
        },

        produce:
        {
            width: 90,
            height: 80,
            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,
            position: "absolute",
            right: 0,
        },

        text:
        {
            fontFamily: "Fira Code",
            fontSize: 18,
            marginLeft: 10,
            marginTop: 10,
        },

        separator:
        {
            minWidth: 200,
            minHeight: 10,
            borderRadius: 10,
            backgroundColor: "mediumspringgreen",
            marginVertical: 5,
        },

        locationBand:
        {
            width: "50%",
            height: 15,
            flexDirection: "row",
            position: "absolute",
            bottom: 10,
            left: "25%",
            alignItems: "center",
            justifyContent: "space-evenly"
        },

        locationText:
        {
            fontSize: 10,
        }
    }
);