import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Nav from "../nav/Nav";
import FooterAbajo from "../nav/FooterAbajo"
// import { useNavigation } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  // const navigation = useNavigation();
  const navigation = useNavigation();

  useEffect(() => {
    // Ocultar la barra de navegación predeterminada
    navigation.setOptions({
      headerShown: false
    });
  }, []);


  return (
 
       <View style={styles.container}>
   <Nav title="Bienvenido"/>
    <View style={styles.container} >
    <View style={styles.content}>
      <View >
        <Image source={require('../../../public/img/roco.png')} style={styles.logo} />
      </View>
      <Text style={styles.text}>Una tradición familiar de treinta años le ha dado forma y alma a este proyecto que concibe el papel como lienzo y la tinta como ese trazo fino y delicado que constituye el arte litográfico. Rocco trasciende el rótulo de empresa y se convierte en un equipo sólido, comprometido con la calidad de sus productos y servicios.</Text>

</View>
      <FooterAbajo />

    </View>
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  
  },
  logo: {
    width: 360,
    height: 150,
    resizeMode: 'stretch',

  },text: {
    fontSize: 15, // Ajusta el tamaño del texto a tu preferencia
    textAlign: 'left', // Alinea el texto a la izquierda
    margin: 10, // Añade un poco de margen alrededor del texto para que no esté pegado a los bordes de la pantalla
  }, content: {
    flex:1,// Para que ocupe todo el espacio disponible
   justifyContent: "center",
   alignItems: "center",
   paddingHorizontal: 16, // Ajusta según sea necesario
   paddingBottom: 80, 
   margin: 12,
 
 },
  
});

export default Home;
