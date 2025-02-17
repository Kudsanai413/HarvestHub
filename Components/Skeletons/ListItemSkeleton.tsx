import { View, Text } from 'react-native'
import React from 'react'
import { styling as skeleton} from '@/assets/styles/skeletons'

type props = { title : string }

export default function ListItemSkeleton({ title } : props) {
  return (
    <>
        <Text style={ skeleton.title } >{ title }</Text>
        <View style={ skeleton.container }>
            <View style={ skeleton.line } />
            <View style={ skeleton.line } />
            <View style={ skeleton.line } />
            <View style={ skeleton.square } />
        </View>
        <View style={ skeleton.container }>
            <View style={ skeleton.line } />
            <View style={ skeleton.line } />
            <View style={ skeleton.line } />
            <View style={ skeleton.square } />
        </View>
        <View style={ skeleton.container }>
            <View style={ skeleton.line } />
            <View style={ skeleton.line } />
            <View style={ skeleton.line } />
            <View style={ skeleton.square } />
        </View>
        <View style={ skeleton.container }>
            <View style={ skeleton.line } />
            <View style={ skeleton.line } />
            <View style={ skeleton.line } />
            <View style={ skeleton.square } />
        </View>
        <View style={ skeleton.container }>
            <View style={ skeleton.line } />
            <View style={ skeleton.line } />
            <View style={ skeleton.line } />
            <View style={ skeleton.square } />
        </View>
    </>
  )
}