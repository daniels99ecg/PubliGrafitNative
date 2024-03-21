import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableHighlight, ScrollView  } from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { useNavigate } from "react-router-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from "../../context/usuario/userContext";
import { useDashboard } from "../../context/dashboard/dashboardContext";
import Nav from "../nav/Nav";

const Dashboard = () => {

  const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar la visibilidad del menú
  const navigation = useNavigate();
  const { username } = useUser();
  const { datos,datos2,datos3,datos4 ,fetchData,fetchData2,fetchData3,fetchData4 } = useDashboard();
  
console.log("El nombre es: "+ username)

  useEffect(() => {
    fetchData();
    fetchData2();
    fetchData3();
    fetchData4()
  }, []);


  const ventas = parseFloat(datos) || 0;
  const compras = parseFloat(datos2) || 0;


  const total = ventas + compras;
  const ventasPorcentaje = (ventas / total) * 100;
  const comprasPorcentaje = (compras / total) * 100;
  
  

  const dataNuevo = [
    { value: ventasPorcentaje, color: "#02b2af", text: `(${ventasPorcentaje.toFixed(1)}%)` },
    { value: comprasPorcentaje, color: "#2e96ff", text: `(${comprasPorcentaje.toFixed(1)}%)` }
  ];



  const toggleMenu = () => {
    setMenuVisible(!menuVisible); // Cambiar el estado de visibilidad del menú
  };

  return (
   
      <ScrollView >
        <View style={styles.container}>
<Nav menuVisible={menuVisible} toggleMenu={toggleMenu} />
      <View style={styles.content}>
    <Text></Text>
        <Text style={styles.titleDash}>Dashboard</Text>
        <View style={styles.card}>
            <Text>Ventas: {ventasPorcentaje.toFixed(1)}</Text>
            <Text>Compras: {comprasPorcentaje.toFixed(1)}</Text>
          <PieChart
            data={dataNuevo}
            textColor="white"
            showText
          />
        </View>

        <View>
  <View style={styles.card} accessibilityLabel="Ventas">
    <Text>Ventas Mes</Text>
    <BarChart
      frontColor="#02b2af"
      data={datos3}
      width={280}
      height={300}
    />
  </View>

  <View style={styles.card} accessibilityLabel="Compras">
    <Text>Compras Mes</Text>
    <BarChart
      frontColor="#2e96ff"
      data={datos4}
      width={280}
      height={300}
    />
  </View>
</View>



      </View>
      </View>

      </ScrollView>
      
   
     
  );
};

const styles = StyleSheet.create({
  container: {
    
    backgroundColor: "#fff"
  },
 
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10
  },
  card: {
   width: "90%", // O considera un valor fijo si es necesario
    backgroundColor: "#fff",
    padding: 10, // Ajusta el padding para dar más espacio
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
    justifyContent: 'center', // Asegura que el contenido se centre verticalmente
    alignItems: 'center',
  },
 

  titleDash:{
    fontSize:30,
    fontWeight:'bold',
    marginTop:30
  }
});

export default Dashboard;
