import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import React, { useEffect, useState } from 'react';
import { styling as global } from '@/assets/styles/global';
import { base_url } from '@/assets/reusable/api';
import { ProduceType } from '@/Context/types';
import { app_colors, font } from '@/assets/styles/colors';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

type props = {
    title: string,
    produce_id: string,
    farmer_id : string,
    type?: string
}

const tomatoes = [
    { image: require("@/assets/images/tomatoe.jpg") },
    { image: require("@/assets/images/Tomatoes.jpg") },
    { image: require("@/assets/images/Tomatoess.jpg") },
]

export default function AdditionalCropImages({ title, produce_id, farmer_id, type } : props) {
    const [images, setImages] = useState<typeof tomatoes>(tomatoes);
    const [p_id, setP_ID] = useState<string>("P05-5642389");
    const [extra_produce, setExtraProduce] = useState<ProduceType[]>([]);
    const [visibleCrop, setVisibleCrop] = useState<number>(0);

    useEffect(()=>
    {
        fetch(`${ base_url}/produce?farmerID=${ farmer_id }`)
            .then( response =>
                {
                    if (!response.ok) throw new Error(`Failed To Fetch ${ farmer_id }`);

                    return response.json();
                }).then(data =>
                    {
                        const extra_produce = data.filter( (produce: ProduceType) => produce.produceID !== produce_id);
                        if ( extra_produce.length === 0) throw new Error("No Additional Crop Cuurently Being Sold");

                        return extra_produce;
                    }).then( (extra_produce : ProduceType[]) =>
                        {
                            setExtraProduce(extra_produce);
                        }).catch( error => console.log(error.message));
    }, []);
  return(
        extra_produce.length &&
        extra_produce.map( (produce : ProduceType) => (
            <View style={ {...global.modal, display: extra_produce.indexOf(produce) === visibleCrop ? "flex" : "none" } }>
                <Text style={ {...global.title, fontSize: 22} }>{ produce.produceType }</Text>
                <ScrollView
                    contentContainerStyle={ global.images_container }
                    horizontal
                    showsHorizontalScrollIndicator={ false }
                    // pagingEnabled

                >
                {
                    images.length && images.map( image =>
                        <Image source={ image.image } style={ global.contained_image }/>
                    )
                }
                </ScrollView>

                <Text style={ styling.price_tag }>
                    <MaterialCommunityIcons name="tag" size={ 20 } color={ app_colors.tetiary }/>
                    Price:
                    $
                <Text style={ styling.price }>{ produce.price } / { produce.unit_type }</Text>
                </Text>

                <Pressable style={ global.modal_button }>
                    <MaterialIcons name="add-shopping-cart" size={22} color={ app_colors.tetiary }/>
                    <Text style={ global.modal_button_text }>Add To Cart</Text>
                </Pressable>
            </View>
        ))
  )
}

const styling = StyleSheet.create(
    {
        price_tag:
        {
            fontFamily: font.family,
            fontSize: 18,
            color: app_colors.tetiary,
            position: "absolute",
            bottom: 120,
            left: 10

        },
        price:
        {
            fontSize: 25,
            fontWeight: "bold",
            color: app_colors.secondary
        },
    }
);