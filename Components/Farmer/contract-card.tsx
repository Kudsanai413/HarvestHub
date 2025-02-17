import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import ImageBackgroundComponent from "../ImageBackgroundComponent";
import { ContractType } from "@/Context/types";
import useGetFileContext from "@/Context/FileContext";
import { styling as global } from '@/assets/styles/global';
import { app_colors } from "@/assets/styles/colors";

interface props
{
    contract: ContractType
}
export default function ContractCard({ contract } : props)
{
    const { getImage } = useGetFileContext();
    return(
        <View style={ global.produce_card }>
            <ImageBackgroundComponent
                image_source={require("@/assets/images/user.jpg")}
                glassy={ 1 }
                curtain="rgba(111, 123, 114, 0.25)"
            >
                <Image source={ getImage("Carrots") } style={ global.profile_image }/>
                <Text style={ card.text }>
                    { contract.agreement }
                </Text>
            </ImageBackgroundComponent>
        </View>
    )

}

const card = StyleSheet.create(
    {
        text:
        {
            width: "90%",
            marginVertical: "auto",
            textAlign: "left",
            fontWeight: "100",
            color: app_colors.white,
            fontStyle: "italic"
        }
    }
)