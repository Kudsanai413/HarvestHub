import { View, StyleSheet } from 'react-native';
import React from 'react'

export default function separator() : React.JSX.Element{
  return (
    <View style={styles.separator}/>
  )
}

const styles = StyleSheet.create(
    {
        separator:
        {
            width: "65%",
            height: 5,
            borderRadius: 10,
            backgroundColor: "#81a47f",
            marginVertical: 3,
            marginHorizontal: "auto",
        }
    }
)
