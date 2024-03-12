import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableHighlight, ScrollView  } from "react-native";
import { useNavigate } from "react-router-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from "../context/userContext";


const Nav = ({ menuVisible, toggleMenu }) => {
    const navigation = useNavigate();
    const { username } = useUser();
  
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#177AD5" barStyle="light-content" translucent={true} height={80} />
        {/* Appbar */}
        <View style={styles.appbar}>
          {/* Botón de menú */}
          <TouchableHighlight onPress={toggleMenu} style={styles.menuButton}>
            <Icon name="menu" size={30} color="#fff" />
          </TouchableHighlight>
          {/* Título */}
          <Text style={styles.title}>PubliGrafit</Text>
        </View>
        {/* Menú desplegable */}
        {menuVisible && (
          <View style={styles.menuContainer}>
            {/* Contenido del menú */}
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
            <TouchableHighlight onPress={() => { toggleMenu(); navigation("/Venta") }}>
              <View style={styles.menuItem}>
                <Icon name="point-of-sale" size={30} color="#fff" />
                <Text style={styles.menuText}>Ventas</Text>
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
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 2

    },
    appbar: {
      position: "fixed", 
      backgroundColor: "#177AD5",
      height: 50,
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
    },
    title: {
      fontSize: 25,
      fontWeight: "bold",
      color: "#fff",
      flex: 1,
      textAlign: "center",
    },
    menuButton: {
      marginRight: 10,
    },
    menuContainer: {
        position: "absolute",
        top: 50, // La posición inicial del menú debe ser la misma que la altura del appbar
        left: 0,
        backgroundColor: "#177AD5",
        width: "70%",
        height: "100%",
        zIndex: 1,
        padding: 20,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 10,
    },
    menuText: {
      color: "#fff",
      fontSize: 20,
      marginLeft: 10,
    },
  });
  

export default Nav;
