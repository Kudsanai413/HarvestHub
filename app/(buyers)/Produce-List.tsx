import { Text, FlatList, View, StyleSheet, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import useGetProduceContext from '@/Context/ProductContext';
import Separator from '@/Components/separator';
import ProduceListItem from '@/Components/Buyer/produce-list-item';
import { Stack } from 'expo-router';
import Header from '@/Components/Buyer/Header';
import ListItemSkeleton from '@/Components/Skeletons/ListItemSkeleton';
import { ProduceType } from '@/Context/types';
import Animated, {  LinearTransition, FadingTransition } from "react-native-reanimated";


export default function ProduceList() {
    const { state } = useGetProduceContext();
    const [focused, setFocused] = useState<boolean>(false)

    // useEffect(() => console.log("Started"), [state.search_results])
  return (
    <>
        <Header page='Produces' user='Emily White' setFocus={ setFocused }/>
        <ScrollView>
        {
            state.search_results.length ?

                <Animated.FlatList

                        keyExtractor={ (item : ProduceType) => item.produceID }
                        data={ state.search_results }
                        renderItem={ ({item}) =>   <ProduceListItem produce={ item }/>}
                        ItemSeparatorComponent={ <Separator/> }
                        itemLayoutAnimation={ FadingTransition }

                />

                    :focused ? <ListItemSkeleton title={`No Results Found`}/>
                    :state.produces.length ?
                            <Animated.FlatList
                                keyExtractor={ (item : ProduceType) => item.produceID }
                                data={ state.produces }
                                renderItem={ ({item}) =>   <ProduceListItem produce={ item }/>}
                                ItemSeparatorComponent={ <Separator/> }
                                itemLayoutAnimation={ LinearTransition }
                            />


                        : <ListItemSkeleton title={'Loading'}/>
        }
        </ScrollView>
    </>
  )
}

const styles = StyleSheet.create(
    {
        container:
        {
            justifyContent: "flex-start",
            alignItems: "center",
            backgroundColor: "#525252"
        },
    }
)
