import React from "react";
import { View } from "react-native";
import Constants from 'expo-constants';
import { Routes, Route } from "react-router-native";
import Login from "./Login.jsx";
// Importa otros componentes que desees usar como páginas
import RepoList from './RepositoryList.jsx';
import Dashboard from "./Dashboard.jsx";
import Venta from "./Venta.jsx";
import { UserProvider } from "../context/userContext.jsx"; // Importa tu UserProvider desde donde lo tengas definido
import { DashboardProvider } from "../context/dashboardContext.jsx";
const Main = () => {
  return (
    <View style={{ marginTop: Constants.statusBarHeight, flexGrow: 1 }}>
     <DashboardProvider>
       <UserProvider>
        <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/Dashboard" element={<Dashboard/>} />
        <Route path="/Usuarios" element={<RepoList/>} />
        <Route path="/Venta" element={<Venta/>} />
        </Routes>
        </UserProvider>
        </DashboardProvider> 
    </View>
  );
};

export default Main;