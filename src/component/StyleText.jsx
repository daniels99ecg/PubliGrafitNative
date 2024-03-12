import React from "react";
import { Text, StyleSheet } from "react-native";



const style=StyleSheet.create({
    text:{
        fontSize:13,
        color:'grey'
    },
    bold:{
        fontWeight:'bold'
    },
    blue:{
        color:'blue'
    },
    big:{
        fontSize:20
    },
    small:{
        fontSize:10
    }
})

export default function StyteleText({blue, bold,children, big, small, text}){
    const textStyles=[
        style.text,
        blue && style.blue,
        bold && style.bold,
        big && style.big,
        small && style.small,
        text && style.text
    ]
    return(
        <Text style={textStyles}>
{children}
        </Text>
    )
}