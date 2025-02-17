import { app_colors } from "@/assets/styles/colors";
import TabIcon from "@/Components/TabIcon";
import { Tabs } from "expo-router";
import { Appearance } from "react-native";

type props = {
    userType: string
}

export default function Layout()
{
    return(
        <Tabs
            screenOptions={{
                // tabBarActiveBackgroundColor: "rgba(6, 122, 0, 0.45)",
                tabBarActiveTintColor: '#067c00',
                tabBarInactiveTintColor: 'gray',
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Appearance.getColorScheme() === "dark" ? app_colors.dark_bg : app_colors.white,
                    borderTopWidth: 1,
                    borderTopColor: '#067c00',
                    height: 60,
                },

            }}
        >
            <Tabs.Screen
                name="Home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <TabIcon color={ color } size={26} icon="home" iconType='fontawesome'/>,
                }}
            />

            <Tabs.Screen
                name="FarmerProduce"
                options={{
                    title: "My Produce",
                    tabBarIcon: ({ color }) => <TabIcon color={ color } size={26} icon="leaf" iconType="fontawesome"/>
                }}
            />

            <Tabs.Screen
                name="Search"
                options={{
                    title: "Search",
                    tabBarIcon: ({ color }) => <TabIcon color={color} size={26} icon="search" iconType="fontawesome"/>
                }}
            />

        </Tabs>
    );
}