import { StyleSheet } from "react-native";
import { app_colors } from "./colors";

export const styling = StyleSheet.create(
    {
        container:
        {
            width: "90%",
            height: 75,
            borderRadius: 10,
            position: "relative",
            marginVertical: 15,
            marginHorizontal: "auto",
            justifyContent: "space-around"
        },

        line:
        {
            width: "78%",
            height: 15,
            borderRadius: 15,
            backgroundColor: app_colors.fade,
            marginLeft: 10,
        },

        square:
        {
            position: "absolute",
            width: 65,
            height: 65,
            borderRadius: 5,
            backgroundColor: app_colors.fade,
            top: 5,
            right: 5,
        },

        title:
        {
            width: "100%",
            textAlign: "center",
            fontFamily: "Bodoni MT Condensed",
            fontSize: 25
        }


    }
);