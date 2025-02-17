import TabIcon from "@/Components/TabIcon";
import { Tabs } from "expo-router";

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
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#067c00',
                    height: 60,
                },

            }}
        >
            <Tabs.Screen
                name="[id]"
                options={{
                    title: 'product',
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
        </Tabs>
    );
}