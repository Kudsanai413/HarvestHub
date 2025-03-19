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
import { UpdatesContextProvider } from '@/Context/UpdatesContext';
import ApplicationContext, { ApplicationContextProvider } from '@/Context/ApplicationContext';

export default function StackLayout() {
	const colorScheme = useColorScheme();

	return(

			<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
				<UserContextProvider>
					<LoginContextProvider>
						<ProductContextProvider>
							<UpdatesContextProvider>
								<AlertContextProvider>
									<ApplicationContextProvider>
										<Stack
											screenOptions={{
												headerShown: false
											}}
											>
											<Stack.Screen name="index" />
											<Stack.Screen name="(Drawer)/"/>
										</Stack>
									</ApplicationContextProvider>
								</AlertContextProvider>
							</UpdatesContextProvider>
						</ProductContextProvider>
					</LoginContextProvider>
				</UserContextProvider>
			</ThemeProvider>
	);
}

