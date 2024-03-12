import React from "react";
import { View, Text, StyleSheet } from "react-native";
import StyteleText from "./StyleText";


const RepositoryItem=(props)=>(
        <View key={props.id_usuario} style={style.cantainer}>
            <StyteleText big bold>ID: {props.id_usuario}</StyteleText>
            <StyteleText blue>Nombre: {props.nombres}</StyteleText>
            {/* <StyteleText small>Edad: {props.age}</StyteleText>
            <StyteleText small>Lenguaje: {props.lenguage}</StyteleText> */}
         
        </View>
)

const style= StyleSheet.create({
    cantainer:{
        padding:20,
        paddingBottom:5, 
        paddingTop:5
    },
    strong:{
        color:"#09f",
        fontWeight:"bold"
    }
})
export default RepositoryItem