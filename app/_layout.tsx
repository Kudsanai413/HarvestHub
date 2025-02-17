import { ThemeProvider } from '@react-navigation/native';
import { LoginContextProvider } from "@/Context/LoginContext";
import { ProductContextProvider } from "@/Context/ProductContext";
import { app_colors, DarkTheme, DefaultTheme } from '@/assets/styles/colors';
import { UserContextProvider } from "@/Context/UserContext";
import { Stack, useRouter } from "expo-router";
import React from 'react';
import { Appearance, Pressable, Linking, useColorScheme } from 'react-native';
import { AlertContextProvider } from '@/Context/AlertContext';
import { createDrawerNavigator, DrawerContent, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();
// const navigation = useRouter()


function CustomDrawerContent() {
  return (
    <Pressable
      onPress={() => {
        // Navigate using the `navigation` prop that you received
        alert("/")
      }}
    >
      Go somewhere
    </Pressable>
  );
}


export default function RootLayout() {
	const colorScheme = useColorScheme();

	return(

			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<UserContextProvider>
					<LoginContextProvider>
						<ProductContextProvider>
							<AlertContextProvider>
								<Stack
									screenOptions={{
										headerShown: false
									}}
								>
									<Drawer.Navigator
										defaultStatus="open"
										screenOptions={{
											drawerType:"slide",
											drawerStyle: {
												width: 250
											},
											overlayColor: Appearance.getColorScheme() === "dark" ? app_colors.dark_bg : app_colors.white
										}}
										drawerContent={ (props) =>
											<DrawerContentScrollView>
												<DrawerItemList {...props} />
												<DrawerItem
													label="Help"
													onPress={() => Linking.openURL('https://mywebsite.com/help')}
												/>
											</DrawerContentScrollView>
										}
									>
										<Stack.Screen name="index" />
										<Stack.Screen name="(farmer)/" />
										<Stack.Screen name="(buyers)/"/>
										<Stack.Screen name="buyer-produce/"/>
									</Drawer.Navigator>
								</Stack>
							</AlertContextProvider>
						</ProductContextProvider>
					</LoginContextProvider>
				</UserContextProvider>
			</ThemeProvider>
	);
}
