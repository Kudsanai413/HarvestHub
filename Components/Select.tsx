import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Animated, { LinearTransition} from "react-native-reanimated";
import { app_colors } from '@/assets/styles/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActionType } from '@/Context/types';
type props =
{
	options: string[],
	size: number,
	master: string,
	colors?: string[],
	Select?: React.Dispatch<React.SetStateAction<number>>,
	dispatch?: React.Dispatch<ActionType>,
	modal?: React.Dispatch<React.SetStateAction<boolean>>,
}



export default function Select({ options, size, master, dispatch, modal }: props) {
	const [selected, setSelected] = useState<string>(`Select ${ master }`);
	const [dropDrown, setDropDown] = useState<boolean>(false);

	const options_list : string[] = options;

  return (
    <View style={ [select.container, { width: size }] }>

		<View style={ master.toLowerCase().includes("user") ? select.selected_opt_outline : select.selected_option }>
			<Text style={ { textAlign: "center", marginHorizontal: "auto" } }>{ selected }</Text>
			<Pressable
				onPress={ () => setDropDown(!dropDrown)}
				style={{
					marginRight: 10
				}}
			>
				<MaterialCommunityIcons name={ !dropDrown ? 'chevron-down' : "close"} color={ app_colors.fade } size={22} />
			</Pressable>
		</View>

		<View style={ {...select.select_body, display: dropDrown ? "flex" : "none" } }>
			<Animated.FlatList
				data={ options }
				renderItem={ ({item}) =>
				<Pressable
					key={ options.indexOf(item) }
					onPress={ () => {
						setSelected(item);
						if (dispatch)
						{
							master === "farmer-add" ? dispatch({ type: "produce", payload: item }) : dispatch({ type: "type", payload: item })
						}
						setDropDown(false);
						if (modal){ modal(true) }
					}}
					style={ select.option }
				>
					<Text style={ select.option_text }>{item }</Text>
				</Pressable> }
			/>
		</View>


    </View>
  )
}

const select = StyleSheet.create(
	{
		container:
		{
			justifyContent: "flex-start",
			alignItems: "center"
		},
		selected_option:
		{
			width: "99%",
			height: 40,
			borderRadius: 5,
			backgroundColor: app_colors.tetiary,
			justifyContent: "space-between",
			alignItems: "center",
			textAlign: "center",
			flexDirection: "row"
		},

		selected_opt_outline:
		{
			width: "99%",
			height: 40,
			justifyContent: "space-between",
			alignItems: "center",
			textAlign: "center",
			flexDirection: "row",
			borderBottomColor: app_colors.primary,
			borderBottomWidth: 1.5
		},

		select_body:
		{
			width: "100%",
			maxHeight: 150,
			backgroundColor: app_colors.tetiary,
			borderRadius: 5,
			justifyContent: "flex-start",
			alignItems: "center"

		},

		option:
		{
			minWidth: "80%",
			height: 30,
			marginHorizontal: "auto",
		},

		option_text:
		{
			width: "100%",
			textAlign: "center",
			color: app_colors.white,
		}
	}
);