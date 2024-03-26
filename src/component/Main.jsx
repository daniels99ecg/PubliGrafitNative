import React from "react";
import { View, StyleSheet } from "react-native";
import Constants from 'expo-constants';
import { Routes, Route } from "react-router-native";
import Login from "./login/Login.jsx";
import RepoList from './usuario/RepositoryList.jsx';
import Dashboard from "./dashboard/Dashboard.jsx";
import Orden from "./ordenes/Orden.jsx";
import Home from "./home/Home.jsx"
import Venta from "./venta/Venta.jsx";
import { UserProvider } from "../context/usuario/userContext.jsx";
import { DashboardProvider } from "../context/dashboard/dashboardContext.jsx";
import { createStackNavigator } from '@react-navigation/stack';
import FooterAbajo from "./nav/FooterAbajo.jsx";
import Nav from "./nav/Nav.jsx";
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

const Main = () => {

  return (
    <View style={styles.container}>
    <DashboardProvider>
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} options={{ 
              headerShown: false,
              headerBackVisible: false
            }} />
            
            <Stack.Screen name="MainStack" component={MainStack} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </DashboardProvider> 
  </View>
);
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Constants.easConfig,
    flexGrow: 1
  }
});
const MainStack = () => {
  return (
    <View style={{ flex: 1 }}>
      <Nav/>
    <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} />

      <Stack.Screen name="MainDashboard" component={Dashboard} options={{ 
        headerShown: false,
        headerBackVisible: false
      }} />
      <Stack.Screen name="Usuarios" component={RepoList} />
      <Stack.Screen name="MainOrden" component={Orden} options={{ 
        headerShown: false,
        headerBackVisible: false
      }} />
      <Stack.Screen name="MainVenta" component={Venta} options={{ 
        headerShown: false,
        headerBackVisible: false
      }} />
      <Stack.Screen name="Footer" component={FooterAbajo} />
      
    </Stack.Navigator>
    
    </View>
  );
};
export default Main;
