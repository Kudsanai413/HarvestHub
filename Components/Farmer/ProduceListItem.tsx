import { View, Text, StyleSheet, Appearance, Image } from 'react-native'
import React, { useState } from 'react'
import ImageBackgroundComponent from '@/Components/ImageBackgroundComponent'
import { ProduceType } from '@/Context/types'
import useGetFileContext from '@/Context/FileContext'
import CustomButton from '@/Components/CustomButton'
import { app_colors } from '@/assets/styles/colors'
import { styling } from '@/assets/styles/global'
import { database, socket } from '@/assets/reusable/api'

interface props
{
    produce: ProduceType,
    style: "grid" | "list"
}

function handleDelete(id: string)
{
    // fetch(`${ database }/delete-produce/${ id }`).then(response => response.ok ? window.alert("Delete Successful") : window.alert("Delete Failed"));
    socket.emit("delete-from-store", id)
}

export default function ProduceListItem({ produce, style } : props) {
    const { getImage } = useGetFileContext();
  return (
    <>
        <View style={[
            style === "grid" ? card.container : card.liststylecontainer,
            {
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative",
                marginVertical: 10,
            }
        ]}>
            {
                style === "grid"?
                    <ImageBackgroundComponent
                        image_source={ getImage( produce.produceType )}
                        styles={
                            style === "grid" ? card.image : card.list_image
                        }
                        curtainOptions={{
                            justifyContent: "center",
                            alighItems: "center"
                        }}

                        curtain="rgba(0,0,0,0.15)"
                    >
                        <Text style={ style === "grid" ? card.quantity : card.list_quantity }>{ produce.produceType }</Text>
                        <View style={ card.buttons }>
                            <CustomButton text={ 'Edit' } icon='store-edit' style={ card.button } button_type="circle"/>

                            <CustomButton text={ 'Remove' } icon='delete' style={ card.button } button_type="circle" handleClick={ () => handleDelete(produce.produceID)}/>
                        </View>

                    </ImageBackgroundComponent>
                        :
                        <>
                            <Image source={ getImage( produce.produceType ) } style={ card.list_image } />
                            <Text style={ card.list_quantity }>{ produce.produceType }</Text>
                        <View style={ card.list_buttons }>
                            <CustomButton text={ ""} icon='store-edit' style={ card.list_button } button_type="circle"/>

                            <CustomButton text={""} icon='delete' style={ card.list_button } button_type="circle" handleClick={ () => handleDelete(produce.produceID) }/>
                        </View>
                        </>
            }
        </View>
    </>

  )
}

const card = StyleSheet.create(
    {
        container:
        {
            minWidth: 165,
            width: "40%",
            height: 200,
            borderRadius: 15,
            marginHorizontal: 10,
        },

        liststylecontainer:
        {
            minWidth: 375,
            height: 75,
            flexDirection: "row",
            borderRadius: 10,
            paddingRight: 10,
            borderWidth: 0,
            borderColor: "none",
            marginHorizontal: "auto"
        },

        quantity:
        {
            color: Appearance.getColorScheme() === "dark" ? app_colors.tetiary : app_colors.dark_bg,
            fontSize: 18,
            fontWeight: 500,
        },

        button:
        {
            backgroundColor: Appearance.getColorScheme() === "dark" ? app_colors.tetiary : app_colors.dark_bg,
            marginHorizontal: "auto",
            minWidth: 45,
            minHeight: 45,
            maxWidth: 45,
            maxHeight: 45,
            borderRadius: "50%",
            width: 45,
        },

        image:
        {
            width: "100%",
            height: "65%",
            borderTopRightRadius: "inherit",
            borderTopLeftRadius: "inherit",
            resizeMode: "stretch",
        },

        list_image:
        {
            width: 60,
            height: 60,
            marginVertical: "auto",
            borderRadius: "50%"
        },

        list_quantity:
        {
            fontSize: 18,
            fontWeight: 500,
            textAlign: "center"
        },

        list_button:
        {
            borderRadius: "50%",
            height: 30,
            width: 30,
            marginVertical: "auto",
            marginHorizontal: 0,
        },
        buttons:
        {
            width: "100%",
            height: "auto",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 20
        },
        list_buttons:
        {
            width: "33%",
            height: "100%",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
        }
    }
)