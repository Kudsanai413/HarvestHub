import { StyleSheet } from "react-native";
import { app_colors } from "./colors";

export const styling = StyleSheet.create(
    {
        header:
        {
            alignSelf: "stretch",
            height: 120,
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: app_colors.primary,
            position: "relative"
        },

        headerTextBand:
        {
            width: "100%",
            height: "40%",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row"
        },

        headerLowerBand:
        {
            alignSelf: "stretch",
            height: "60%",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "flex-end",
            paddingBottom: 5,
        },

        headerTextBox:
        {
            width: "60%",
            height: 45,
            justifyContent: "flex-start",
            alignItems: "center",
            flexDirection: "row",
            marginLeft: 10,
        },

        headerButtons:
        {
            width: 80,
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
            marginRight: 10,
        },

        headerProfile:
        {
            width: 50,
            height: 50,
            backgroundColor: app_colors.white,
            borderRadius: 60,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            right: 5,
            top: 7,
        },

        profileLetters:
        {
            color: app_colors.tetiary,
            fontSize: 18,
            fontWeight: "bold",
            fontFamily: "Fira"
        },

        headerTitle:
        {
            fontSize: 22,
            fontFamily: "Fira Code",
            color: app_colors.white
        }


    }
);