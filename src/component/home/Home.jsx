import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import Nav from "../nav/Nav";
import FooterAbajo from "../nav/FooterAbajo"
// import { useNavigation } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";

const Home = () => {
  const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar la visibilidad del menú
  // const navigation = useNavigation();
  const navigation = useNavigation();

  useEffect(() => {
    // Ocultar la barra de navegación predeterminada
    navigation.setOptions({
      headerShown: false
    });
  }, []);
  const toggleMenu = () => {
    setMenuVisible(!menuVisible); // Cambiar el estado de visibilidad del menú
  };

  return (
    <View style={styles.container}>
      <View>
        <Image source={require('../../../public/img/roco.png')} style={styles.logo} />
      </View>
      <Text>Una tradición familiar de treinta años le ha dado forma y alma a este proyecto que concibe el papel como lienzo y la tinta como ese trazo fino y delicado que constituye el arte litográfico. Rocco trasciende el rótulo de empresa y se convierte en un equipo sólido, comprometido con la calidad de sus productos y servicios.</Text>


      <FooterAbajo />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 380,
    height: 150,
    resizeMode: 'stretch',

  },
});

export default Home;
