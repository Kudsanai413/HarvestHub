import { View, Text, TextInput, Pressable, Modal, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import { styling as form } from './Login';
import { EvilIcons, FontAwesome6 } from '@expo/vector-icons';
import useGetUserContext from '@/Context/UserContext';
import Select from './Select';
import { styling as global, styling } from '@/assets/styles/global';
import { styling as custom } from "@/assets/styles/custom"
import { app_colors, font } from '@/assets/styles/colors';
import { ActionType } from '@/Context/types';
import { base_url, createObject, Request } from '@/assets/reusable/api';
import CustomTextBox from './CustomTextbox';

const user_types : ("farmer" | "buyers-contractor")[] = ["farmer", "buyers-contractor"]


export default function Register() {
    const { state, dispatch } = useGetUserContext();
    const [confirm, setConfirm] = useState<boolean>(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [additional_crops, setAditional_Crops] = useState<string>("")

    function Registar()
    {
        Request(`${base_url}/${ state.type }s`, createObject("POST", { userID: state.user_id, Name: state.name,date_birth: state.date_of_birth,contact: state.contact,location: state.base_location,main_crop: state.prefered_crop,Additional_crops: AdditionalCrops(additional_crops),}));
    }

    const AdditionalCrops = (text : string) : string[] =>
    {
        if (text.includes(',')) return text.split(',');

        return [text];
    }
    return (
        <>
            <View style={ form.body }>
            {/* First Stage OF The Registration [Vital User Information] */}
                <Text style={ styles.title }>Register</Text>
                <View style={ [form.input, { marginTop: 65 }] }>
                    <FontAwesome6 name='user' color='white' size={ 20 } style={{ marginLeft: 8 }}/>
                    <TextInput
                        placeholder='National ID Number'
                        value={ state.user_id }
                        onChangeText={ (text) => dispatch({ type: "id", payload: text }) }
                        style={ [form.hide, styles.text] }
                        />
                </View>
                <View style={ form.input }>
                    <EvilIcons name='lock' size={30} color="white"/>
                    <TextInput
                        placeholder='Full Name'
                        value={ state.name }
                        onChangeText={ (text) => dispatch({ type: "name", payload: text }) }
                        style={ [form.hide, styles.text] }
                        />
                </View>
                <View style={ form.input }>
                    <EvilIcons name='calendar' size={30} color="white"/>
                    <TextInput
                        placeholder='Date Of Birth'
                        value={ state.date_of_birth }
                        onChangeText={ (text) => dispatch({ type: "date", payload: text}) }
                        style={ [form.hide, styles.text] }
                        />
                </View>
                <Pressable style={ form.button } onPress={ () => setVisible(true)}><Text style={{ color: "white" }}>Next</Text></Pressable>
            {/* Second Stage Of The Registration [ Crops && Location ]*/}
                <Modal transparent  animationType='fade' visible={ visible }>
                    <View style={ form.body }>

                        <Text style={ styles.title }>Finish Up</Text>
                        <View style={ form.input }>
                            <EvilIcons name='location' size={30} color="white"/>
                            <TextInput
                                placeholder='Location'
                                value={ state.base_location }
                                onChangeText={ (text) => dispatch({ type: "location", payload: text }) }
                                style={ [form.hide, styles.text] }
                                />
                        </View>
                        <View style={ [form.input, { marginTop: 65 }] }>
                            <FontAwesome6 name='user' color='white' size={ 20 } style={{ marginLeft: 8 }}/>
                            <TextInput
                                placeholder='Main Crop'
                                value={ state.prefered_crop }
                                onChangeText={ (text) => dispatch({type: "p-crop", payload: text }) }
                                style={ [form.hide, styles.text] }
                                />
                        </View>
                        <View style={ form.input }>
                            <EvilIcons name='lock' size={30} color="white"/>
                            <TextInput
                                placeholder='Additional Crops '
                                value={ additional_crops }
                                onChangeText={ (text) => setAditional_Crops(text) }
                                style={ [form.hide, styles.text] }
                                />
                        </View>

                        <Select
                            options={ user_types }
                            size={ 300 }
                            master='User Type'
                            dispatch={ dispatch }
                        />

                        <Pressable onPress={ () => setConfirm(true) } style={ form.button }><Text style={{ color: "white" }}>Register</Text></Pressable>

                    </View>
                </Modal>
            </View>
            {/* Confirm That The Information Given Above is Correct  */}
            <Modal visible={ confirm }
                animationType="fade"
            >
                <View style={ {...global.container, backgroundColor: app_colors.white, justifyContent: "flex-start",  } }>
                    {/* <Image source={ require("@/assets/images/hb3.png")} style={{ width: 100, height: 100 }}/> */}
                    <Text style={ {...styling.title, fontSize: 22, marginVertical: 15 } }>Confirm { state.type.toLocaleUpperCase()} Registration Details</Text>
                    <View style={{
                        ...global.container,
                        width: "100%",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: 'space-evenly',
                        alignItems: "flex-start", flexGrow: 1,
                        maxHeight: "70%",
                        marginVertical: 20
                        // display: "none"
                    }}>
                        < CustomTextBox title="National ID"  contents={state.user_id}  typing={dispatch}  action="id" />
                        < CustomTextBox title="Full Name"  contents={state.name}  typing={dispatch}  action="name" />
                        < CustomTextBox title="Date Of Birth"  contents={state.date_of_birth}  typing={dispatch}  action="date" />
                        < CustomTextBox title="Phone/Email"  contents={state.contact}  typing={dispatch}  action="contact" />
                        < CustomTextBox title="Location"  contents={state.base_location}  typing={dispatch}  action="location" />
                        < CustomTextBox title="Preffered Crop"  contents={state.prefered_crop}  typing={dispatch}  action="p-crop" />
                        < CustomTextBox title="Additional Crops"  contents={additional_crops}  typing={dispatch}  action="a-crops" />
                    </View>
                    <Pressable
                        style={ custom.rect_button }
                        onPress={ () => {
                            Registar();
                            setVisible(false);
                            setConfirm(false);
                        }}
                    >
                        <Text>Confirm</Text>
                    </Pressable>
                </View>
            </Modal>
        </>

    );
}

const styles = StyleSheet.create({
    text: {
        textAlign: "center"
    },

    title:
    {
        fontSize: 24,
        fontWeight: "bold",
        color: "#067c00",
    }
})

