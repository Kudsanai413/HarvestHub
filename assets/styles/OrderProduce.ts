import { StyleSheet } from "react-native";
import { app_colors, font } from "./colors";


export const styling = StyleSheet.create(
    {
        // Image and Background Image
        container:
        {
            width: "100%",
            height: 225,
            position: "relative",
            marginHorizontal: "auto",
            resizeMode: "cover",
        },

        crop_image:
        {
            width: 80,
            height: 80,
            borderRadius: 100,
            position: "absolute",
            bottom: -40,
            left: 25,
            backdropFilter: "blur(20px)",
            backgroundColor: app_colors.primary
        },

        crop_type:
        {
            width: "100%",
            textAlign: "center",
            fontFamily: font.family,
            fontSize: 22,
            marginVertical: 15,
            textDecorationStyle: "solid",
            textDecorationLine: "underline"
        },


        // Buttons Container
        buttons_strip:
        {
            width: "95%",
            height: 70,
            flexDirection: "row",
            justifyContent: "space-evenly"
        },

        // Gallery

        gallery_title:
        {
            fontFamily: font.family,
            textAlign: "center",
            fontSize: 18,
            marginVertical: 15,
        },

        gallery_container:
        {
            width: "98%",
            minHeight: 200,
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "flex-start",
            marginHorizontal: "auto"
        },

        gallery_image:
        {
            width: "45%",
            height: 180,
            borderRadius: 3,
            marginHorizontal: "auto",
            marginVertical: 7.5
        },

        // Message Form
        message_container:
        {
            width: "90%",
            height: 170,
            justifyContent: "space-between",
            paddingVertical: 5,
            alignItems: "center",
            marginHorizontal: "auto",
            borderStyle: "solid",
            borderWidth: 2,
            borderColor: app_colors.fade,
            borderRadius: 7,
            backgroundColor: app_colors.white
        },

        message_top:
        {
            width: "95%",
            marginHorizontal: "auto",
            flexDirection: "row",
            position: "relative",
            justifyContent: "flex-start"
        },

        message_top_text:
        {
            fontFamily: font.family,
            fontSize: 14,
            color: app_colors.fade,
            marginLeft: 5
        },

        message_textbox:
        {
            width: "90%",
            height: 80,
            backgroundColor: "#eee",
            padding: 5,
        },

        message_button:
        {
            width: 80,
            height: 35,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: app_colors.fade,
            borderRadius: 4,
        }
    }


)