import { View, Text, TextInput, Modal, Pressable } from 'react-native'
import React, { useState } from 'react'
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { app_colors } from '@/assets/styles/colors';
import { styling as header } from '@/assets/styles/header';
import { styling as global } from '@/assets/styles/global';
import useGetProduceContext from '@/Context/ProductContext';
import Filter from './Filter';
import { styling as custom } from '@/assets/styles/custom';
import Sort from './Sort';
type props = {
    user: string,
    page: string,
    setFocus?: React.Dispatch<React.SetStateAction<boolean>>,
}
export default function Header({ user, page, setFocus } : props) {
    const [input, setInput] = useState<string>("");
    const { search, dispatch } = useGetProduceContext();
    const [filterVisible, setFilterVisible ] = useState<boolean>(false);
    const [sortVisible, setSortVisible] = useState<boolean>(false);
    const initials : string[] = user.split(" ");
  return (
    <View style={ header.header }>
        <View style={ header.headerTextBand }>
            <Text style={ header.headerTitle }>{ page }</Text>
        <View style={ header.headerProfile }>
            {
                initials.map(initial => (
                    <Text style={ header.profileLetters }>
                        { initial.charAt(0) }
                    </Text>
                ))
            }
        </View>
        </View>
        <View style={ header.headerLowerBand }>
            <View style={ header.headerButtons }>

                <Pressable
                    onPress={ () => setFilterVisible(true) }
                >
                    <MaterialCommunityIcons name='filter' color={ app_colors.white } size={24}/>
                </Pressable>

                <Pressable
                    onPress={ () => setSortVisible(true) }
                >
                    <MaterialCommunityIcons name='sort' color={ app_colors.white } size={24}/>
                </Pressable>
            </View>
        </View>
        <Modal
            style={ custom.filter_modal }
            visible={ filterVisible }
            transparent
        >
            <Filter setInvisible={ setFilterVisible } />
        </Modal>
        <Modal
            transparent
            visible={ sortVisible }
        >
            <Sort setVisible={ setSortVisible } />
        </Modal>
    </View>
  )
}