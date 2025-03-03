import { View, Text, TextInput, StyleSheet, Appearance, Pressable, FlatList, ScrollView } from 'react-native'
import React, { SetStateAction, useEffect, useReducer, useRef, useState } from 'react'
import { app_colors, font } from '@/assets/styles/colors';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { styling as global, styling } from '@/assets/styles/global';
import { ActionType, Response } from '@/Context/types';
import { database, Request } from '@/assets/reusable/api';
import useGenerateAlert from '@/Context/AlertContext';
import useGetLoginContext from '@/Context/LoginContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSession as get, createSession as post, type_of } from '@/assets/reusable/constants';
import ImageBackgroundComponent from '@/Components/ImageBackgroundComponent';
import useGetFileContext from '@/Context/FileContext';
import ProduceListItem from '@/Components/Buyer/produce-list-item';
import Profile_card from '@/Components/profile_card';


const filter_options : string[] = ["Location", "Produce", "Buyers", "Farmers", "Contracts"];
const icons : string[] = ["location", "leaf", "logo-usd", "earth", "documents"]

const filters = {
    options: filter_options,
    icons: icons
};

let key = 0;



const Filter_Opt = ( text : string, selected_filters : string[], dispatch : React.Dispatch<ActionType>, ShowFilters : React.Dispatch<SetStateAction<boolean>> ) : React.JSX.Element =>
{

    // if (get("filters").then( filters =>{ return filters}) !== null)
    // {
    //     const filters = get("filters").then( filters =>{ return filters});
    // }

    // else
    // {
    //     post(undefined, "filters", selected_filters);
    // }



    const filter = StyleSheet.create(
        {
            tablet:
            {
                alignItems: "center",
                paddingHorizontal: 5,
                maxWidth: 115,
                height: 30,
                borderRadius: 30,
                backgroundColor: selected_filters?.indexOf(text) >= 0 ? app_colors.tetiary : app_colors.skeleton,
                boxShadow: selected_filters?.indexOf(text) >= 0 ? `0 0 5px ${ app_colors.tetiary }` : "0",
                marginHorizontal: 9,
                marginVertical: 2.5,
                justifyContent : "center"
            },

            text:
            {
                fontFamily: font.family,
                color: selected_filters ? app_colors.black : Appearance.getColorScheme() === "dark" ? app_colors.white : app_colors.black,
                textAlignVertical: "center"
            },

            fill:
            {
                alignSelf: "stretch",
                height: "100%",
            }
        }
    )
    return(
        <View style={ text !== "close" ? filter.tablet : { ...filter.tablet, backgroundColor: "transparent"}}>
            <Pressable
                onPress={
                    () => {
                        if (selected_filters?.includes(text))
                        {
                            dispatch({ type: "ignite", payload: selected_filters?.filter(item => item !== text )})
                        }

                        else if (text === "close") ShowFilters(false)

                        else {
                            dispatch({ type: "ignite", payload: [...selected_filters, text]})
                        }
                    }
                }
                style={ text !== "close" ? filter.tablet : { ...filter.tablet, backgroundColor: "transparent"}}
            >
                {
                    text !== "close" ?
                        <Text><Ionicons name={ icons[filter_options.indexOf(text)] } /> { text }</Text>
                            : <Ionicons name='close' size={ 25 } color={ Appearance.getColorScheme() === "dark" ? app_colors.tetiary : app_colors.black }/>
                }
            </Pressable>
        </View>
    );
}

const initState = { selected: [], results: [], Alert: ({}:any) => {} };

const reducer = (state : typeof initState, action : ActionType) : typeof initState | any =>
{
    switch(action.type)
    {
        case "ignite":
            AsyncStorage.setItem("filters",JSON.stringify(action.payload))
            return { ...state, selected:  action.payload  }

        case "search":
             return Request(`${ database }/search/${ action.payload }`)
                .then((results : Response) =>
                {
                    if ( results.data !== null)
                    {
                        return { ...state, results: results.data }
                    }
                })

        default:
            alert("Unrecognized Action")
    }
}


export default function Search() {
    const {  Image : image } = useGetFileContext()
    const { dispatch : alert, Alert } = useGenerateAlert();
    const { state : login } = useGetLoginContext();
    const [filtersVisible, setFiltersVisible] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("");
    const Filters = useRef<typeof filters>(filters);
    const [selected, setSelected] = useState<string[] | any>([]);
    const [state, dispatch] = useReducer(reducer,{ ...initState, Alert: Alert });
    const [results, setResults] = useState<any[]>([]);
    useEffect(() => {
        alert({type : "error-type", payload: "User Information"});
        alert({type: "error-message", payload: JSON.stringify(login.user)});
        alert({type: "show-alert", payload: true});
    }, [])

    useEffect(() =>
    {
        get("filters").then((filters) => {
            if (filters !== null){
                setSelected(filters)
            }
        }
        ).catch( error => console.error(error));

    }, [state.selected])

    useEffect(() =>
    {
        if (query.length)
        {
            Request(`${ database }/search/${ query }`)
                .then((results : Response) =>
                {
                    if ( results.data !== null)
                    {
                        const records = results.data.filter( (result:any) => typeof result[0] === "object");
                        setResults(records);
                    }

                    else
                    {
                        setResults([]);
                    }
                })
        }
    }, [query]);

    const line =
    <View style={{
        width: "95%",
        height: "auto",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        marginHorizontal: "auto"
    }}>
        <View style={ styles.line }/>
        <Ionicons name='leaf' size={ 25 } color={ app_colors.secondary }/>
        <View style={ styles.line }/>
    </View>
	return (
		<View style={ styling.body }>
            <View style={styles.header }>
                <View style={{
                        ...styles.textbox,
                        width: "94%"
                    } }>
                    <MaterialIcons name="search" size={ 28 }/>
                    <TextInput
                        placeholder='What Are Looking For Today'
                        placeholderTextColor="black"
                        value={ query }
                        onChangeText={(text) =>
                            {
                                setQuery(text);
                            }
                        }
                        style={global.invisibleTextBox}
                        onFocus={ () => setFiltersVisible(true) }


                    />
                </View>

                <View style={{ ...styles.filters, display: filtersVisible ? "flex" : "none", width: "100%", marginTop: 10 }}>
                    <FlatList
                        data={ [...Filters.current.options, "close"] }
                        keyExtractor={ (item) => item}
                        renderItem={ ({item}) => Filter_Opt(item, selected, dispatch, setFiltersVisible)}
                        horizontal
                        contentContainerStyle={{
                            justifyContent: "flex-start",
                            alignItems: "center",
                        }}
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={ false }
                    />
                </View>
            </View>

                {
                    results.length && query.length ?
                        <View style={{
                            width: "100%",
                            position: "relative",
                            top: 110
                        }}>
                            <FlatList
                                data={ results }
                                ItemSeparatorComponent={ line }
                                scrollEnabled={ true }
                                showsVerticalScrollIndicator={ false }
                                showsHorizontalScrollIndicator={ false }
                                contentContainerStyle={{
                                    maxHeight: 570,
                                }}
                                keyExtractor={(item) => `$${results.indexOf(item)}` }
                                renderItem={({ item }) =>
                                        <FlatList
                                            data={ item }
                                            keyExtractor={ (item) => `item${ key += 1}` }
                                            renderItem={({ item }) =>
                                                type_of(item, "produceType") ?
                                                    <ProduceListItem produce={ item }/>
                                                        : type_of(item, "agreement") ?
                                                            <Text style={{ color: "red" }}>{ JSON.stringify(item) }</Text>
                                                                : <Profile_card user={ item }/>
                                            }
                                            maxToRenderPerBatch={ 2 }
                                            removeClippedSubviews
                                        />
                                    }
                                />
                        </View>

                            :<View style={ {
                                width: "100%",
                                flexDirection: "row",
                                flexWrap: "wrap",
                                justifyContent: "center",
                                alignItems: "center",
                                position: "relative",
                                top: 110
                            } }>
                                {
                                    results.length < 1 && query.length <= 1 ? "" :
                                    <Text style={ styles.error }>{`No Results Found For %${ query }%`}</Text>
                                }

                                <View style={ styles.tile }>
                                    <ImageBackgroundComponent
                                        curtain='rgba(0,0,0,0.75)'
                                        image_source={ image.with }
                                    >
                                        <Text style={ styles['tile-title']}>Produce</Text>
                                    </ImageBackgroundComponent>
                                </View>
                                <View style={ styles.tile }>
                                    <ImageBackgroundComponent
                                        curtain='rgba(0,0,0,0.75)'
                                        image_source={ require("@/assets/images/with.jpg") }
                                    >
                                        <Text style={ styles['tile-title']}>Produce</Text>
                                    </ImageBackgroundComponent>
                                </View>
                                <View style={ styles.tile }>
                                    <ImageBackgroundComponent
                                        curtain='rgba(0,0,0,0.75)'
                                        image_source={ image.with }
                                    >
                                        <Text style={ styles['tile-title']}>Produce</Text>
                                    </ImageBackgroundComponent>
                                </View>
                                <View style={ styles.tile }>
                                    <ImageBackgroundComponent
                                        curtain='rgba(0,0,0,0.75)'
                                        image_source={ image.farm }
                                    >
                                        <Text style={ styles['tile-title']}>Produce</Text>
                                    </ImageBackgroundComponent>
                                </View>
                            </View>
                }
		</View>
  )
}

const styles = StyleSheet.create(
    {
        textbox:
        {
            width: "85%",
            height: 50,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            borderRadius: 8,
            borderWidth: 1.5,
            borderColor: app_colors.fade,
            backgroundColor: app_colors.tetiary,
            marginVertical: 5,
        },

        header:
        {
            width: "99%",
            justifyContent: "flex-start",
            height: 70,
            alignItems: "center",
            paddingVertical: 7,
            position: "fixed",
            top: 0,
        },

        headerTitle:
        {
            fontFamily: font.family,
            fontSize: 22,
            color: Appearance.getColorScheme() === "light" ? app_colors.black : app_colors.white,
            fontWeight: 500
        },

        filters:
        {
            width: "98%",
            marginHorizontal: "auto",
            position: "relative",
        },

        close:
        {
            position: "absolute",
            right: 0,
            top: 0,
            width: 40,
            height: 40,
            justifyContent: "center",
            alignItems: "center"
        },

        filter_text:
        {
            fontFamily: font.family,
            fontSize: 18,
            fontWeight: 300,
            color: Appearance.getColorScheme() === "dark" ? app_colors.white : app_colors.black
        },

        tile:
        {
            width: 135,
            height: 150,
            backgroundColor: app_colors.tetiary,
            marginHorizontal: 25,
            marginVertical: 15,
            borderRadius: 10,

        },

        "tile-title":
        {
            fontWeight: 600,
            fontSize: 20,
            color: Appearance.getColorScheme() === "dark" ? app_colors.white : app_colors.dark_bg
        },

        error:
        {
            width: "90%",
            fontStyle: "italic",
            fontSize: 20,
            fontWeight: 400,
            textAlign: "center"
        },

        line:
        {
            width: "40%",
            height: 2,
            backgroundColor: app_colors.secondary,
        }



	}
);