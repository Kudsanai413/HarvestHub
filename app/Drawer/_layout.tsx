import { Drawer as SideBar} from "expo-router/drawer"
import "react-native-gesture-handler"
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { DrawerNavigationState, ParamListBase } from "@react-navigation/native"
import { DrawerDescriptorMap } from "@react-navigation/drawer/lib/typescript/commonjs/src/types"
import { useRouter } from "expo-router"
import { Pressable, Text, Image, Appearance }  from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { app_colors } from "@/assets/styles/colors"
import { useState } from "react"
import useGetLoginContext from "@/Context/LoginContext";

interface props
{
	state: DrawerNavigationState<ParamListBase>,
	description: DrawerDescriptorMap
}

const routes : string[] = [
	"index",
	"(farmer)",
	"(buyers)",
	"Layout",
	"buyer-produce",
	"_sitemap",
	"+not-found"
]

const drawerIcon =
{
	Settings: "settings-outline",
	Profile: "person-outline",
	Requests: "mail-unread-outline"
}

function CustomDrawer( { state, description } : props )
{
	const [active, setActive] = useState<"Settings" | "Profile" | "Dashboard">("Dashboard")
	const router = useRouter();
	const { state :  user } = useGetLoginContext();
	const [home, setHome] = useState<"(buyers)/BuyerHome" | "(farmer)/FarmerHome" | "/">(
		user.user_type && user.user_type === "Buyers" ? "(buyers)/BuyerHome"
			: user.user_type === "Farmers" ? "(farmer)/FarmerHome"
				: "/"
	)
	return(
		<ScrollView
			contentContainerStyle={{
				justifyContent: "flex-start",
				alignItems: "center"
			}}
		>
			<Image source={ require("@/assets/images/user.jpg") } style={{ width: 120, height: 120, borderRadius: "50%"}}/>
			<Text> Username </Text>

				<Pressable
					key="DDI-1"
					onPress={ () => router.push(`/Drawer/${ home }`) }
					onPressOut={ () => setActive("Dashboard") }
					style={{
						width: "80%",
						height: 45,
						borderRadius: 45,
						flexDirection: "row",
						alignItems: "center",
						paddingLeft: 20,
						backgroundColor: active === "Dashboard" ? app_colors.fade : Appearance.getColorScheme() === "dark" ? app_colors.secondary : app_colors.black,

					}}
				>
					<Ionicons name="home-outline" size={ 23 }/>
					<Text style={{ marginLeft: 10, color: active === "Dashboard" ? app_colors.fade : "white",}}>Dashboard</Text>
				</Pressable>
		{
			state.routes.filter(( route : any) => !routes.includes(route.name)).map(( route : any, i : number ) => (
				<Pressable
					key={ i }
					onPressOut={ () => setActive(route.name) }
					onPress={ () => router.push(`/Drawer/${ route.name }`) }
					style={{
						width: "80%",
						height: 45,
						borderRadius: 45,
						flexDirection: "row",
						alignItems: "center",
						paddingLeft: 20,
						backgroundColor: active == route.name ? app_colors.tetiary : "transparent",
						marginVertical: 10,

					}}
				>
					<Ionicons name={ drawerIcon[route.name] } size={ 23 }/>
					<Text style={{ marginLeft: 10}}>{ route.name }</Text>
				</Pressable>
			))
		}
		</ScrollView>
	)

}



export default function RootLayout() {
  return (
  	<GestureHandlerRootView>
		<SideBar
			drawerContent={ CustomDrawer }
			screenOptions={{
				headerShown:false,
				drawerStyle:{
					// backgroundColor: app_colors.secondary,
				}
			}}
		>
			<SideBar.Screen name="/(farmer)/Home"/>
			<SideBar.Screen name="/(buyers)/Home"/>
		</SideBar>
	</GestureHandlerRootView>
);
}
