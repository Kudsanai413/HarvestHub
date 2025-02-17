import { View, Text, TextInput, StyleSheet, Pressable, Appearance } from 'react-native';
import React, { useEffect, useState } from 'react';
import { EvilIcons, FontAwesome6 } from "@expo/vector-icons"
import { useRouter } from 'expo-router';
import useGetLoginContext from '@/Context/LoginContext';
import useGenerateAlert from '@/Context/AlertContext';
import { app_colors } from '@/assets/styles/colors';

type props = {
  setVisible: React.Dispatch<React.SetStateAction<boolean | "login" | "sign-up">>
}
export default function Login({ setVisible } : props) {
  	const { state : user, dispatch } = useGetLoginContext();
	const { dispatch : alert } = useGenerateAlert();

	useEffect(() => {
		if (user.error.type != null)
		{
			alert({ type: "error-type", payload: user.error.type})
			alert({ type: "error-message", payload: user.error.message })
			alert({	type: "show-alert", payload: true})
		}
	})
  return (
    <View style={ styling.body }>
      <Text
        style={ styling.header }
      >
        Login
      </Text>
		<View style={ [styling.input, { marginTop: 65 }] }>
			<FontAwesome6 name='user' color='#067c00' size={ 20 } style={{ marginLeft: 8 }}/>
			<TextInput
				placeholder='Username'
				value={ user.user_id }
				onChangeText={ (text) => dispatch({ type: "user-id", payload: text}) }
				style={ styling.hide }

			/>
		</View>
		<View style={ styling.input }>
			<EvilIcons name='lock' size={30} color="#067c00"/>
			<TextInput
				placeholder='Password'
				value={ user.password }
				onChangeText={ (text) => dispatch({ type: "password", payload: text }) }
				style={ styling.hide }
			/>
		</View>
		<Pressable onPress={ () =>
		{
			if (user.user_id.length && user.password.length) dispatch({ type: "login", payload: true });

			else
			{
				alert({ type: "error-type", payload: "Fill Login Form"})
				alert({ type: "error-message", payload: "ID Field or Password Field Should'nt be Empty"})
				alert({	type: "show-alert", payload: true})
			}

      setVisible(false);

		}}
		style={ styling.button }>
			<Text style={{ color: "white" }}>Login</Text>
		</Pressable>
    </View>
  )
}

export const styling = StyleSheet.create({
    body:
    {
		height: "75%",
		width: "100%",
		borderTopRightRadius: 60,
		borderTopLeftRadius: 60,
		backgroundColor: Appearance.getColorScheme() === "light" ? app_colors.white : app_colors.dark_bg,
		position: "absolute",
		bottom: 0,
		alignItems: "center"
    },

    hide: {
        outlineColor: "transparent",
        width: "60%",
        height: 30,
        textAlign: "left",
        marginLeft: 15,
        borderWidth: 0,
        color: app_colors.secondary
    },

    input:
    {
        width: "60%",
        height: 40,
        borderRadius: 10,
        borderColor: "#067c00",
        borderWidth: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        marginVertical: 20,
    },

    button :
    {
        width: 90,
        height: 40,
        borderRadius: 8,
        backgroundColor: "#067c00",
        marginVertical: 20,
        justifyContent: "center",
        alignItems: "center",
        color: "white"
    },
    header:
    {
        width: "100%",
        textAlign: "center",
        fontFamily: "DengXian",
        fontSize: 30,
        fontWeight: "bold",
        color: "#067c00",
        marginTop: 15,
    },
})



