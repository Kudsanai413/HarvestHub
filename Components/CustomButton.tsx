import { Appearance, Pressable, Text, View } from 'react-native';
import React from 'react';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { app_colors } from '@/assets/styles/colors';
import { styling as custom} from '@/assets/styles/custom';
import { ActionType } from '@/Context/types';

type props =
{
	icon?: string,
	text: string,
	handleClick?: (text?: string) => void,
	dispatch?: React.Dispatch<ActionType>,
	type?: string,
	button_type?: "circle" | "rect",
	color?: string,
	style?: any
}

export default function CustomButton({ icon, text, dispatch, handleClick, type, button_type, color, style }: props) {
  return (
    <Pressable
        onPress={ () => {
			if (handleClick) handleClick()
		} }
        style={[
			style,
			button_type ?
				{
					...style,
					maxWidth: 100,
					height: 60,
					alignItems: "center",
				}
					: {...custom.rect_button, backgroundColor: color ? color : Appearance.getColorScheme() === "dark" ? app_colors.tetiary : app_colors.dark_bg}
		]}
    >
    	<View style={ button_type ? [custom.circular_button, {...style, position: "static"}] : [] }>
    	{
				type ? <FontAwesome5 name={ icon } size={24} color={ app_colors.fade }/>
					: <MaterialCommunityIcons name={ icon } size={24} color={ Appearance.getColorScheme() === "dark" ? app_colors.black : app_colors.fade }/>

      }
      </View>
      <Text>{ text }</Text>
    </Pressable>
  )
}