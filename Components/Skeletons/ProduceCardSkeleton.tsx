import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { app_colors } from '@/assets/styles/colors';

export default function ProduceCardSkeleton() {
  return (
    <View style={ skeleton.container }>
      <View style={ skeleton.circle }/>
      <View style={ skeleton.for_title }/>
      <View style={ skeleton.for_image }/>
      <View style={ skeleton.for_button }/>
    </View>
  )
}

const skeleton = StyleSheet.create(
    {
        container:
        {
            width: 150,
            height: 180,
            backgroundColor: app_colors.tetiary,
            borderRadius: 10,
            boxShadow: `0 5px 10px ${app_colors.fade}`,
            position: "relative",
            justifyContent: "space-evenly",
            alignItems: "center",
            marginVertical: 20,
            marginHorizontal: 15
        },

        circle:
        {
            width: 25,
            height: 25,
            backgroundColor: app_colors.fade,
            borderRadius: "50%",
            position: "absolute",
            top: 5, left: 5,
        },

        for_title:
        {
            width: 90,
            height: 25,
            borderRadius: 10,
            backgroundColor: app_colors.fade,
            alignSelf: "flex-end",
            marginRight: "10%",
        },

        for_image:
        {
            width: "80%",
            height: 90,
            borderRadius: 8,
            backgroundColor: app_colors.fade,
        },

        for_button:
        {
            width: 80,
            height: 35,
            borderRadius: 8,
            backgroundColor: app_colors.fade,
        }
    }
);