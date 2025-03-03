import { font, app_colors } from "@/assets/styles/colors";
import { ActionType } from "@/Context/types";
import { View, TextInput, StyleSheet, Text } from "react-native";

type props =
{
    title: string,
    contents: string,
    typing: React.Dispatch<ActionType>,
    action: string,
    width?: number | any,
    numbers?: boolean,
    password?: boolean,
};

export default function CustomTextBox( {title, contents, typing, action, width} : props )
{
    return(
        <>
            <View style={ {...box.container, width: width} }>
                <Text style={ box.title }>{ title }</Text>
                <TextInput
                    value={ contents }
                    placeholder={ title }
                    onChangeText={ (text) => typing({ type: action, payload: text})}
                    style={ box.textfield }
                    textAlignVertical='center'
                    textAlign="center"
                />
            </View>
        </>
    )
}

    const box = StyleSheet.create(
        {
            container:
            {
                width: "45%",
                height: 45,
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                marginVertical: 20,
            },

            title:
            {
                position: "absolute",
                top: -15,
                fontFamily: font.family,
                fontSize: 10,
                color: app_colors.black,
                left: 0,
            },

            textfield:
            {
                width: "80%",
                height: 35,
                borderStyle: "solid",
                borderBottomColor: app_colors.primary,
                borderBottomWidth: 1.5,
                outlineColor: "transparent",
                textAlignVertical: "center",
                textAlign: "center",
                textOverflow: "ellipsis"
            }



        }
);

