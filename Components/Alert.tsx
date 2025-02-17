import { View, Text, FlatList, StyleSheet, Modal } from 'react-native'
import React from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { app_colors, font } from '@/assets/styles/colors'
import CustomButton from './CustomButton'
import { AlertProps, button } from '@/Context/types'
import useGenerateAlert from '@/Context/AlertContext'


export default function Alert() {
    const { state, dispatch } = useGenerateAlert();
    const defaultButton : button =
    {
        text: "OK",
        onClick: () => dispatch({ type: "show-alert", payload: false})
    };
  return (
    <Modal visible={state.visible} transparent animationType="fade">
        <View style={ styling.container }>
            <View style={ styling.title_strip }>
                <MaterialCommunityIcons name={ state.icon } size={ 22 } color={ app_colors.tetiary }/>
                <Text style={ styling.type }> { state.type }</Text>
            </View>
            <Text style={ styling.message }>{ state.message }</Text>
            <FlatList
                data={ state.buttons ? [ ...state.buttons, defaultButton] : [defaultButton] }
                renderItem={ ({ item }) => <CustomButton text={ item.text } handleClick={ item.onClick } />}
                horizontal
                showsHorizontalScrollIndicator={ false }
                contentContainerStyle={{
                    width: "80%",
                    justifyContent: !state.buttons? "center" : "space-between",
                    alignItems: "center",
                    marginHorizontal: "auto",
                    flexDirection: "row"
                }}
            />
        </View>
    </Modal>
  )
}

const styling = StyleSheet.create(
    {
        container:
        {
            width: "75%",
            height: 200,
            borderRadius: 10,
            backgroundColor: app_colors.black,
            marginHorizontal: "auto",
            marginVertical: "auto",
        },

        title_strip:
        {
            width: "95%",
            height: 50,
            flexDirection: "row",
            marginHorizontal: "auto",
            marginTop: 5,
            color: app_colors.tetiary
        },

        type:
        {
            fontFamily: font.family,
            fontSize: 18,
            color: app_colors.tetiary
        },

        message:
        {
            flexGrow: 1,
            textAlign: "center",
            textAlignVertical: "center",
            color: app_colors.tetiary
        },
    }
)