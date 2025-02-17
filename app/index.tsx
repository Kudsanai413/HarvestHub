import Login from "@/Components/Login";
import Register from "@/Components/Register";
import useGenerateAlert from "@/Context/AlertContext";
import useGetFileContext from "@/Context/FileContext";
import useGetLoginContext from "@/Context/LoginContext";
import { useEffect, useRef, useState } from "react";
import { Appearance, Image, Modal, Pressable, StyleSheet, Text, View, } from "react-native";


export default function Index() {
	const [visible, setVisible] = useState<boolean | "login" | "sign-up">(false);
	const { Image : Logo } = useGetFileContext();
	const { state : user, dispatch } = useGetLoginContext();
	const { dispatch : alert } = useGenerateAlert();
	const done = useRef<boolean>(false);
	const [image, setImage] = useState<string>("");

	useEffect(() =>
	{
		if (user.error.type != null && !done.current)
		{
			alert({ type: "error-type", payload: user.error.type})
			alert({ type: "error-message", payload: user.error.message })
			setTimeout(() => alert({	type: "show-alert", payload: true}), 500)
			done.current = true;
			dispatch({type: "clear"})

		}
}, [user.error])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#067c00",
      }}
    >
      <Image source={ Appearance.getColorScheme() === "dark" ? Logo.dark_logo : Logo.logo } style={ styling.logo }/>
      <Pressable style={ styling.button } onPress={ () => setVisible("login") }><Text>Log in</Text></Pressable>
      <Pressable style={ styling.button } onPress={ () => setVisible("sign-up")} ><Text>Sign Up</Text></Pressable>
      <Modal visible={ !visible ? false : true } transparent={ true } animationType="slide">
      {
        visible == "login" ? <Login setVisible={ setVisible }/> : <Register/>
      }
      </Modal>
    </View>
  );
}


const styling = StyleSheet.create({
  button:
  {
    width: 100,
    height: 40,
    borderRadius: 5,
    backgroundColor: "white",
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    fontFamily: " DengXianLight"
  },

  logo :
  {
    maxWidth: 165,
    maxHeight: 160,
    top:0,
    position: "absolute"
  }
})
