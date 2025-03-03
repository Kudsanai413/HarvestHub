import { ThemeProvider } from '@react-navigation/native';
import { LoginContextProvider } from "@/Context/LoginContext";
import { ProductContextProvider } from "@/Context/ProductContext";
import { app_colors, DarkTheme, DefaultTheme } from '@/assets/styles/colors';
import { UserContextProvider } from "@/Context/UserContext";
import { Stack, useRouter } from "expo-router";
import React from 'react';
import { useColorScheme } from 'react-native';
import { AlertContextProvider } from '@/Context/AlertContext';
import { createDrawerNavigator, DrawerContent, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";

export default function StackLayout() {
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
                                        <Stack.Screen name="index" />
                                        <Stack.Screen name="(Drawer)/"/>
                                    </Stack>
							</AlertContextProvider>
						</ProductContextProvider>
					</LoginContextProvider>
				</UserContextProvider>
			</ThemeProvider>
	);
}

