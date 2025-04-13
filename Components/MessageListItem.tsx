import { View, Text,  StyleSheet} from 'react-native';
import React from 'react';
import { chat } from '@/Context/types';
import { app_colors } from '@/assets/styles/colors';
import { formatDate } from '@/assets/reusable/constants';

interface props
{
    update: chat
}

export default function MessageListItem({ update } : props) {
  return (
    <View style={ item.container }>
      <Text style={ item.id }>{ update._id }</Text>
      <Text style={ [item.message, { color: update.read ? "grey" : "green" }] }>{ update.text }</Text>
      <Text style={ item.people }>{ update.sender } To { update.receiver }</Text>
      <Text style={ item.time }>{ formatDate(update.createdAt) }</Text>
    </View>
  )
}

const item = StyleSheet.create(
    {
        container: {
            width: "95%",
            height: 80,
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: "auto",
            borderWidth: 2,
            borderColor: app_colors.primary,
            flexWrap: "wrap",
            position: "relative",
            marginVertical: 15,
        },

        id:
        {
            width: "100%",
            height: 10,
            fontSize: 13,
            fontStyle: "italic",
            fontWeight: "100",
            position: "absolute",
            top: 0,
        },

        people:
        {
            width: "100%",
            height: 15,
            position: "absolute",
            bottom: 1.5,
            textAlign: "right",
            fontSize: 11,
            fontWeight: "100",

        },

        message:
        {
            width: "50%",
            height: 50,
            fontSize: 15,
            fontWeight: "700",
        },

        time:
        {
            width: 150,
            height: 10,
            fontSize: 10,
            fontWeight: "300",
            position: "absolute",
            top: 35,
            right: 25,
        },


    }
)