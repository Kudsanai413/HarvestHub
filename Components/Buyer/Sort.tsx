import { View, Text, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { styling } from '@/assets/styles/custom';
import { app_colors } from '@/assets/styles/colors';

type props = {
    setVisible: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function Sort({ setVisible } : props ) {
    const [ascending, setAscending] = useState<boolean>(true);
    const [sortBy, setSortBy] = useState<"title" | "date" | "location">("date");
  return (
    <View style={ [styling.filter_container, { flexDirection: "column", height: 180 }] }>
        <Pressable
			style={ styling.modal_close }
			onPress={ () => setVisible(false) }
		>
			<Ionicons name='close' color={app_colors.black} size={28} />
		</Pressable>

        <Text style={ styling.filter_title }>Sort By</Text>
        <Pressable style={{ width: "80%", height: 35, marginBottom: 7, marginTop: 12 }}
            onPress={ () => setSortBy("title") }
        >
            <Text style={ styling.filter_text }>
                Title
                {
                    sortBy === "title" ?
                        <MaterialCommunityIcons name={ ascending ? 'arrow-up' : 'arrow-down' }/>
                            : <></>
                }
            </Text>
        </Pressable>

        <Pressable style={{ width: "80%", height: 35, marginVertical: 7.5}}
            onPress={ () => setSortBy("date") }
        >
            <Text style={ styling.filter_text }>
                Date
                {
                    sortBy === "date" ?
                        <MaterialCommunityIcons name={ ascending ? 'arrow-up' : 'arrow-down' }/>
                            : <></>
                }
            </Text>
        </Pressable>

        <Pressable style={{ width: "80%", height: 35, marginVertical: 7.5}}
            onPress={ () => setSortBy("location") }
        >
            <Text style={ styling.filter_text }>
                Location
                {
                    sortBy === "location" ?
                        <MaterialCommunityIcons name={ ascending ? 'arrow-up' : 'arrow-down' }/>
                            : <></>
                }

            </Text>
        </Pressable>
    </View>
  )
}