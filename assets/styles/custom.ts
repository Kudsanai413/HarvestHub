import { StyleSheet } from "react-native";
import { app_colors, font } from "./colors";

export const styling = StyleSheet.create(
    {
        filter_container:
        {
            width: "75%",
            height: 250,
            borderStyle: "solid",
            borderColor: app_colors.fade,
            borderRadius: 5,
            backgroundColor: app_colors.white,
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            position: "fixed",
            top: 140,
            right: 50,
        },

        filter_text:
        {

            fontSize: font.size,
            fontFamily: font.family,
            textAlign: "center",
            color: app_colors.fade

        },

        filter_checkbox:
        {
            width: 25,
            height: 25,
        },

        filter_title:
        {
            width: "100%",
            fontFamily: font.family,
            fontSize: 22,
            textAlign: "center",
            textShadowColor: app_colors.tetiary,
            textShadowOffset: { width: 2, height: 2},
            textShadowRadius: 5,
            textDecorationStyle: "solid",
            textDecorationColor: app_colors.fade,
            textDecorationLine: "underline",
        },

        filter_items:
        {
            width: "35%",
            height: 50,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-evenly",
            margin: "auto",
        },

        filter_modal:
        {
            backdropFilter: "blur(30px)",
            backgroundColor: "rgba(42, 69, 40, 0.45)",
            justifyContent: "center",
            alignItems: "center"
        },

        modal_close:
        {
            position: "absolute",
            top: 5,
            right: 5,
        },

        sort_item:
        {
            width: "80%",
            height: 40,
            borderRadius: 5,

        },

        circular_button:
        {
            width: 50,
            height: 50,
            borderRadius: "50%",
            backgroundColor: app_colors.tetiary,
            alignItems: "center",
            justifyContent: "center"
        },

        rect_button:
        {
            width: 80,
            height: 35,
            backgroundColor: app_colors.white,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            borderRadius: 8,
            boxShadow: "0 0 2px black"
        }
    }
);