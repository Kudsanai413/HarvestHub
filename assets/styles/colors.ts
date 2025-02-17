import { fonts } from "@react-navigation/native/src/theming/fonts";
import { Theme } from "@react-navigation/native/src/types";
const app_colors =
{
    primary: "#067c00",
    secondary: "#034400",
    tetiary: "#81a47f",
    black: "#000",
    white: "#fff",
    fade: "#2a4528",
    dark_bg: "rgb(25, 26, 25)",
    dark_cardbg: "rgb(20, 22, 20)",
    skeleton: "#6f7b72"
}

const font =
{
    family: "Segoe UI",
    size: 18,
    color: app_colors.black,
    align: "center",
}

const Themes =
{
    dark:
    {
        text: app_colors.white,
        background: "rgb(24, 26, 24)",
        button: app_colors.secondary,
    },

    light:
    {
        text: app_colors.black,
        background: app_colors.white,
        button: app_colors.fade,
    }
}

const DarkTheme : Theme = {
    dark: true,
    colors: {
        primary: app_colors.primary,
        background: app_colors.dark_bg,
        card: app_colors.dark_cardbg,
        text: app_colors.tetiary,
        border: app_colors.fade,
        notification: 'rgb(255, 69, 58)',
    },
    fonts
};

const DefaultTheme : Theme = {
    dark: false,
    colors: {
        primary: app_colors.primary,
        background: app_colors.white,
        card: app_colors.white,
        text: app_colors.black,
        border: app_colors.fade,
        notification: 'rgb(255, 59, 48)',

    },
    fonts
};


export { app_colors, font, Themes, DefaultTheme, DarkTheme }