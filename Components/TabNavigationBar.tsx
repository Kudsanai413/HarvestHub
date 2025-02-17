import { Tabs } from "expo-router";
import TabIcon from "./TabIcon";

type props = {
    userType: string
}

export default function Layout()
{
    return(
        <Tabs
            screenOptions={{
            tabBarActiveBackgroundColor: "rgba(6, 122, 0, 0.45)",
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
            tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#067c00',
            height: 60,
            },
            }}
        >
            <Tabs.Screen
                name={`(farmer)/Home`}
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <TabIcon color={ color } size={26} icon="calendar-check-o" iconType='fontawesome'/>,
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}