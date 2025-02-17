import { View, Text, Switch, Pressable } from 'react-native'
import React, { useState } from 'react';
import { styling as custom } from '@/assets/styles/custom';
import { Ionicons } from '@expo/vector-icons';
import { app_colors } from '@/assets/styles/colors';

type props = {
	setInvisible: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function Filter({ setInvisible } : props ) {
  const [all, setALl] = useState<boolean>(true);
  const [location, setLocation] = useState<boolean>(false);
  const [crop, setCrop] = useState<boolean>(false);
  return (
	<View
		style={ custom.filter_container }
	>
		<Pressable
			style={ custom.modal_close }
			onPress={ () => setInvisible(false) }
		>
			<Ionicons name='close' color={app_colors.black} size={28} />
		</Pressable>
		<Text style={ custom.filter_title }>Filter By</Text>

		<View style={ custom.filter_items } >
			<Switch
				value={all}
				disabled
				style={ custom.filter_checkbox }
			/>
			<Text style={ custom.filter_text }>All</Text>
		</View>

		<View style={ custom.filter_items } >
			<Switch
				value={all}
				disabled
				style={ custom.filter_checkbox }
			/>
			<Text style={ custom.filter_text }>Location</Text>
		</View>

		<View style={ custom.filter_items } >
			<Switch
				value={all}
				disabled
				style={ custom.filter_checkbox }
			/>
			<Text style={ custom.filter_text }>Main Crop</Text>
		</View>

		<View style={ custom.filter_items } >
			<Switch
				value={all}
				disabled
				style={ custom.filter_checkbox }

			/>
			<Text style={ custom.filter_text }>All</Text>
		</View>

	</View>
  )
}