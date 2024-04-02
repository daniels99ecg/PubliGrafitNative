import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableHighlight, ScrollView  } from "react-native";
// import { useNavigate } from "react-router-native";
import { useNavigation } from "@react-navigation/native"; // Importa la función useNavigation

import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from "../../context/usuario/userContext";


const Nav = ({ title }) => {
    // const navigation = useNavigate();
    const { username } = useUser();
    const navigation = useNavigation();

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#177AD5" barStyle="light-content" translucent={true} />
        {/* Appbar */}
        <View style={styles.appbar}>
          {/* Botón de menú */}
          <TouchableHighlight onPress={() => { navigation.navigate('Login');
 }}>
              <View style={styles.menuItem}>
                <Icon name="logout" size={25} color="#fff" />
              </View>
            </TouchableHighlight>
          {/* <TouchableHighlight onPress={toggleMenu} style={styles.menuButton}>
            <Icon name="menu" size={30} color="#fff" />
          </TouchableHighlight> */}
          {/* Título */}
          <View style={styles.titleContainer}>
                    <Text style={styles.mainTitle}>PubliGrafit</Text>
                    <Text style={styles.dynamicTitle}>{title}</Text>
                </View>

        </View>
        {/* Menú desplegable */}
        {/* {menuVisible && (
          <View style={styles.menuContainer}>
           
            <Text style={styles.menuText}>Bienvenido: {username}</Text>
            <TouchableHighlight onPress={() => { toggleMenu(); navigation("/Dashboard") }}>
              <View style={styles.menuItem}>
                <Icon name="dashboard" size={30} color="#fff" />
                <Text style={styles.menuText}>Dashboard</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => { toggleMenu(); navigation("/Usuarios") }}>
              <View style={styles.menuItem}>
                <Icon name="account-circle" size={30} color="#fff" />
                <Text style={styles.menuText}>Usuario</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight onPress={() => { toggleMenu(); navigation("/Orden") }}>
              <View style={styles.menuItem}>
                <Icon name="point-of-sale" size={30} color="#fff" />
                <Text style={styles.menuText}>Ordenes</Text>
              </View>
            </TouchableHighlight>
            <View style={{ borderBottomWidth: 1, borderBottomColor: 'white', marginVertical: 10 }} />
            <TouchableHighlight onPress={() => { toggleMenu(); navigation("/") }}>
              <View style={styles.menuItem}>
                <Icon name="logout" size={30} color="#fff" />
                <Text style={styles.menuText}>Cerrar Sesión</Text>
              </View>
            </TouchableHighlight>
          </View>
        )} */}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      position: "relative",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

    },
    appbar: {
      position: "fixed", 
      backgroundColor: "#177AD5",
      height: 90,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
    },
    menuButton: {
      marginRight: 10,
    },
    menuContainer: {
    position: "relative",
    backgroundColor: "#177AD5",
    width: "70%",
    height: "100%",
    zIndex: 1,
    padding: 20,
  
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom:-50
    },
    menuText: {
      color: "#fff",
      fontSize: 20,
      marginLeft: 10,
    },titleContainer: {
      flex: 1, // Toma el espacio disponible
      alignItems: "center", // Centra los títulos horizontalmente
  },
  mainTitle: {
      fontSize:15,
      fontWeight: "bold",
      color: "#fff",
      marginTop:20, // Espacio entre los títulos

  },
  dynamicTitle: {
      fontSize: 25,
      color: "#fff",
      fontWeight: "bold",
  },
  });
  

export default Nav;
