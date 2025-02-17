import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { app_colors } from '@/assets/styles/colors';
// import { getImage } from './produce-list-item';
import { GestureHandlerRootView } from "react-native-gesture-handler"
import useGetFileContext from '@/Context/FileContext';

type props = {
    item: string,
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
}


export default function AdditionListItem({ item, setVisible } : props) {
    const { getImage } = useGetFileContext();
  return (
    <Pressable key={ item } style={ additional.container }
        onPress={ () => setVisible(true) }
    >
        <Image source={ getImage(item) } style={ additional.image }/>
        <Text>{ item} </Text>
        <Pressable
            style={ additional.cart_button }
        >
            <MaterialCommunityIcons name='cart-plus' size={ 24 } color={ app_colors.tetiary }/>

        </Pressable>
    </Pressable>
  )
}

const additional = StyleSheet.create(
    {
        container:
        {
            width: "85%",
            height: 50,
            borderRadius: 4,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: "auto",
            borderStyle: "solid",
            borderColor: app_colors.fade,
            marginVertical: 5
        },

        image:
        {
            width: 50,
            height: 50,
            borderTopLeftRadius: 4,
            borderBottomLeftRadius: 4,
            backgroundColor: app_colors.tetiary

        },

        cart_button:
        {
            width: 45,
            height: 40,
            backgroundColor: app_colors.fade,
            alignItems: "center",
            justifyContent: "space-around",
            borderRadius: 5
        }
    }
);