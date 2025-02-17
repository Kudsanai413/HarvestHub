import { Appearance, StyleSheet } from "react-native";
import { app_colors, font } from "./colors";

export const styling = StyleSheet.create(
    {
        body:
        {
            flex: 1,
            alignItems: "center",
            width: "100%",
            height: "100%"
        },
        blurry_container:
        {
            width: "100%",
            height: "100%",
            backdropFilter: "blur(30px)",
        },
        invisibleTextBox:
        {
            borderWidth: 0,
            outlineColor: "transparent",
            flexGrow: 0.85,
            height: 40,
            backgroundColor: "transparent",
            fontSize: 16,
            color: app_colors.fade,
            paddingLeft: 5,
            paddingBottom: 5
        },

        container:
        {
            flex: 1,
            alignSelf: "stretch",
            alignItems: "center",
        },

        title:
        {
            marginVertical: 10,
            marginHorizontal: "auto",
            // borderBottomColor: app_colors.fade,
            // borderBottomWidth: 2,
            fontFamily: font.family,
            fontSize: 16,
            fontWeight: 700
        },

        images_container:
        {
            width: "90%",
            maxWidth: 350,
            paddingHorizontal: 5,
            flexDirection: "row",
            height: "70%",
            maxHeight: "60%",
        },

        contained_image:
        {
            minWidth: "100%",
            maxWidth: "100%",
            minHeight: "100%",
            maxHeight: "100%",
            marginHorizontal: 25,
            borderRadius: 5,
        },

        basic_image:
        {
            width: "100%",
            height: 250,
            marginHorizontal: "auto",
        },

        modal:
        {
            width: "95%",
            height: "75%",
            borderRadius: 10,
            marginVertical: "auto",
            marginHorizontal: "auto",
            backgroundColor: app_colors.white,
            justifyContent: "flex-start",
            paddingRight: 25,
            position: "relative"
        },

        modal_button:
        {
            width: "30%",
            height: 50,
            backgroundColor: app_colors.fade,
            color: app_colors.fade,
            borderRadius: 5,
            borderColor: app_colors.fade,
            borderWidth: 1,
            position: "absolute",
            bottom: 40,
            left: "5%",
            justifyContent: "center",
            alignItems: "center",
        },

        modal_button_text:
        {
            fontFamily: font.family,
            fontSize: 16,
            color: app_colors.tetiary,
            marginLeft: 10,
        },

        profile_image:
        {
            width: 35,
            height: 35,
            borderRadius: "50%",
            backgroundColor: app_colors.tetiary,
            position: "absolute",
            left: 5,
            top: 5,
            borderWidth: 2,
            borderColor: app_colors.fade
        },

        produce_card:
        {
            width: 150,
            height: 205,
            borderRadius: 8,
            borderWidth: 0.5,
            borderColor: app_colors.fade,
            justifyContent: "flex-start",
            alignItems: "center",
            position: "relative",
            marginVertical: 20,
            marginHorizontal: 10,
            backgroundColor: Appearance.getColorScheme() == "dark" ? app_colors.dark_cardbg : app_colors.white
        },

        card_image:
        {
            width: "80%",
            height: 95,
            borderRadius: 5,
            marginTop: 22,
            marginBottom: 10,
        },

        card_text:
        {
            fontFamily: font.family,
            fontSize: 15,
            color: app_colors.fade,
            textAlignVertical: "bottom",
            marginTop: 10,
            textAlign: 'right',
            paddingLeft: 20,
        },

        header:
        {
            width: "98%",
            height: 55,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginHorizontal: "auto",
        },
        background_image:
        {
            width:"100%",
            height: "100%",
            flex: 1,
            resizeMode: "cover",
            justifyContent: "center",
            alignItems: "center",
        },
        round_corner:
        {
            borderRadius: 100,
        },

        left_title:
        {
            marginHorizontal: "2%",
            fontSize: 20,
            textAlign: "left",
            width: "fit-content",

        }
    }
)