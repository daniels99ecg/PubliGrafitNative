import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
// import { useNavigate, useLocation } from "react-router-native";
import { useNavigation } from "@react-navigation/native"; // Importa la función useNavigation

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RepositoryItem from "../RepositoryItem";
const Tab = createBottomTabNavigator();

const FooterAbajo = () => {
    const navigation = useNavigation();
  

    const handleDashboardTabPress = () => {
      
        navigation.navigate("MainDashboard");
      
  };

  const handleOrdenTabPress = () => {
      
    navigation.navigate("MainOrden");
  
};

const handleVentaTabPress = () => {
      
    navigation.navigate("MainVenta");
  
};


    return (
        <View style={styles.container}>
            <Tab.Navigator>
 

<Tab.Screen
    name="Dashboard"
    component={RepositoryItem} // O utiliza <Text> o cualquier otro componente básico de React
    listeners={() => ({
        tabPress: event => {
            // Cancela la acción de navegación predeterminada si está activo
            
                event.preventDefault();
                // Ejecuta tu función personalizada si está activo
                handleDashboardTabPress();
            
        },
    })}
    options={{
        tabBarIcon: ({ color, size }) => (
            <Icon name="dashboard" size={size}  />
        ),
    }}
/>

<Tab.Screen
    name="Órdenes"
    component={RepositoryItem} // O utiliza <Text> o cualquier otro componente básico de React
    listeners={() => ({
        tabPress: event => {
            // Cancela la acción de navegación predeterminada si está activo
            
                event.preventDefault();
                // Ejecuta tu función personalizada si está activo
                handleOrdenTabPress();
            
        },
    })}
    options={{
        tabBarIcon: ({ color, size }) => (
            <Icon name="receipt" size={size} />
        ),
    }}
/>

<Tab.Screen
    name="Ventas"
    component={RepositoryItem} // O utiliza <Text> o cualquier otro componente básico de React
    listeners={() => ({
        tabPress: event => {
            // Cancela la acción de navegación predeterminada si está activo
            
                event.preventDefault();
                // Ejecuta tu función personalizada si está activo
                handleVentaTabPress();
            
        },
    })}
    options={{
        tabBarIcon: ({ color, size }) => (
            <Icon name="point-of-sale" size={size}/>
        ),
    }}
/>


            </Tab.Navigator>   
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        
    },
});

export default FooterAbajo;
