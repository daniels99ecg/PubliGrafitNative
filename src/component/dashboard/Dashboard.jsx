import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableHighlight, ScrollView  } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import FooterAbajo from "../nav/FooterAbajo"

// import { BarChart, PieChart } from "react-native-gifted-charts";
// import PieChart from 'react-native-pie-chart'
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";


// import { useNavigate } from "react-router-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from "../../context/usuario/userContext";
import { useDashboard } from "../../context/dashboard/dashboardContext";
import Nav from "../nav/Nav";
import axios from 'axios'; // Importa axios


const Tab = createBottomTabNavigator();

const Dashboard = () => {



  const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar la visibilidad del menú
  // const navigation = useNavigate();
  const { username } = useUser();
  const {datos,datos2,fetchData, fetchData2} = useDashboard();

// console.log("El nombre es: "+ username)
const widthAndHeight = 250
const sliceColor = ['blue', 'red']

const chartConfig = {
 
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: "white",
  decimalPlaces: 0,

  formatYLabel: (value) => new Intl.NumberFormat('es-ES').format(value),

  color: (opacity = 1) => `rgba(1, 1, 1, ${opacity})`,


};
const [datos3, setDatos3] = useState([]);
const [datos4, setDatos4] = useState([]);

const [datos5, setDatos5] = useState([]);
const [datos6, setDatos6] = useState([]);

const [datos7, setDatos7] = useState([]);
const [datos8, setDatos8] = useState([]);

const [datos9, setDatos9] = useState([]);
const [datos10, setDatos10] = useState([]);

const fetchData3 = async () => {
  try {
    const response = await axios.get("https://danielg99.alwaysdata.net/fichatecnica/ordenmes");
    const jsonData3 = response.data;


    const labels = jsonData3.map(item => item.mes);
    const valores = jsonData3.map(item => item.totalVentasMes);

    setDatos3(labels); 
    setDatos4(valores)
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};



const fetchData4 = async () => {
  try {
    const response = await axios.get("https://danielg99.alwaysdata.net/compras/compradeldia");
    const jsonData4 = response.data;

    const labels = jsonData4.map(item => item.mes);
    const valores = jsonData4.map(item => item.totalComprasMes);

    setDatos5(labels); 
    setDatos6(valores)
   
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


const fetchData5 = async () => {
  try {
    const response = await axios.get("https://danielg99.alwaysdata.net/fichatecnica/ordensemana");
    const jsonData5 = response.data;

    const labels = jsonData5.map(item => item.diaSemana);
    const valores = jsonData5.map(item => item.totalVentasDia);

    setDatos7(labels); 
    setDatos8(valores)
   
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const fetchData6 = async () => {
  try {
    const response = await axios.get("https://danielg99.alwaysdata.net/compras/comprasemana");
    const jsonData5 = response.data;

    const labels = jsonData5.map(item => item.diaSemana);
    const valores = jsonData5.map(item => item.totalComprasDia);

    setDatos9(labels); 
    setDatos10(valores)
   
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};


useEffect(() => {
  const fetchDataAll = async () => {
    try {
      await fetchData();
      await fetchData2();
      await fetchData3();
      await fetchData4();
      await fetchData5();
      await fetchData6();
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };
  fetchDataAll();
}, []);



  const ventas = parseFloat(datos) || 0;
  const compras = parseFloat(datos2) || 0;



  const dataNuevo = [
    {
      name: "Ventas",
      population: ventas,
      color: "rgba(131, 167, 234, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 16
    },
    {
      name: "Compras",
      population: compras,
      color: "rgba(255, 99, 132, 1)",
      legendFontColor: "#7F7F7F",
      legendFontSize: 16
    }
  ];

 
  const datosParaGrafica = {
           
    labels: datos3,
    datasets: [
      {
        data: datos4
      }
    ]
  
  };

  const datosParaGraficaDia = {
           
    labels: datos5,
    datasets: [
      {
        data: datos6
      }
    ]
  
  };

  const datosParaGraficaDiasemana = {
           
    labels: datos7,
    datasets: [
      {
        data: datos8
      }
    ]
  
  };

  const datosParaGraficaDiasemanaCompra = {
           
    labels: datos9,
    datasets: [
      {
        data: datos10
      }
    ]
  
  };


  function formatearValores(amount) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  return (
    <View style={styles.container}>
<Nav title="Dashboard" /> 

<ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.container}>

      <View style={styles.content}>
    <Text></Text>
        <View style={styles.card}>
            <Text>Ventas: {formatearValores(ventas)}</Text>
            <Text>Compras: {formatearValores(compras)}</Text> 
            <PieChart
  data={dataNuevo}
  width={300}
  height={220}
  chartConfig={chartConfig}
  accessor={"population"}
  backgroundColor={"transparent"}
  paddingLeft={"15"}
  
/>
  
        </View>

         <View>
  <View style={styles.card} accessibilityLabel="Ventas">
    <Text>Ventas Mes</Text>

    <ScrollView horizontal={true}>
    <BarChart
      data={datosParaGrafica}
      width={650} // Ancho del gráfico
      height={350} // Alto del gráfico
      yAxisLabel="$"
      yAxisSuffix=""
      chartConfig={chartConfig}
    />
    
  </ScrollView>   
   
  </View> 

  <View style={styles.card} accessibilityLabel="Ventas">
    <Text>Compras Mes</Text>

    <ScrollView horizontal={true}>
    <BarChart
      data={datosParaGraficaDia}
      width={650} // Ancho del gráfico
      height={350} // Alto del gráfico
      yAxisLabel="$"
      chartConfig={chartConfig}
    />
  </ScrollView>   
   
  </View> 
  

  <View style={styles.card} accessibilityLabel="Ventas">
    <Text>Ventas Semana</Text>

    <ScrollView horizontal={true}>
    <BarChart
      data={datosParaGraficaDiasemana}
      width={650} // Ancho del gráfico
      height={350} // Alto del gráfico
      yAxisLabel="$"
      chartConfig={chartConfig}

    />
   
  </ScrollView>   
   
  </View>


  <View style={styles.card} accessibilityLabel="Ventas">
    <Text>Compras Semana</Text>

    <ScrollView horizontal={true}>
    <BarChart
      data={datosParaGraficaDiasemanaCompra}
      width={650} // Ancho del gráfico
      height={350} // Alto del gráfico
      yAxisLabel="$"
      chartConfig={chartConfig}
    />
  </ScrollView>   
   
  </View>
</View> 



      </View>
      </View>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      <Text></Text>
      </ScrollView>


      <FooterAbajo/> 
      </View>
     
  );
};

const styles = StyleSheet.create({
  container: {
    flex:1,
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
  },
  
scrollContainer: {
  flexGrow: 1,
},
});

export default Dashboard;
