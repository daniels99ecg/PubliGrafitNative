import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableHighlight, ScrollView,Modal, Button, TextInput ,TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigate } from "react-router-native";
import Nav from "../nav/Nav";
import {Picker} from '@react-native-picker/picker';
import { Alert } from 'react-native';
import FooterAbajo from "../nav/FooterAbajo"

const Venta =()=>{  
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [ordenes, setOrdenes] = useState([]);
  const [busqueda, setBusqueda] = useState(''); // Estado para el texto de búsqueda


  const [paginaActual, setPaginaActual] = useState(1);
  const ordenesPorPagina = 4; // La cantidad de órdenes que quieres mostrar por página

 
  async function fetchOrdenes() {
      try {
          const response = await fetch(`${apiUrl}fichatecnica/realizada`);
          const data = await response.json();
          setOrdenes(data);
      } catch (error) {
          console.error("Error ordenes:", error);
      }
  }

  useEffect(() => {
      fetchOrdenes()
  
  }, []);
  const ordenesFiltradas = ordenes.filter(repo =>
    repo.nombre_ficha.toLowerCase().includes(busqueda.toLowerCase()) ||
    repo.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    repo.costo_final_producto.toString().includes(busqueda) ||
    repo.mano_obra.toString().includes(busqueda)
  );

  const indiceFinal = paginaActual * ordenesPorPagina;
const indiceInicial = indiceFinal - ordenesPorPagina;
const ordenesActuales = ordenesFiltradas.slice(indiceInicial, indiceFinal);


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
         <Nav title="Listar Ventas"/>

    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
    <TextInput
              style={styles.inputBusqueda}
              placeholder="Buscar..."
              value={busqueda}
              onChangeText={setBusqueda} // Actualiza el estado de busqueda con el texto del input
            />
      <View style={styles.content}>

        {/*Esta es zona de trabajo*/}
         
        <View>
        <View>
        {ordenesActuales.map(repo => (
            <View key={repo.id_ft} style={styles.card}>
              <Text style={styles.cardText}>Orden: {repo.id_ft}</Text>
              <Text style={styles.cardText}>Nombre: {repo.nombre_ficha}</Text>
              <Text style={styles.cardText}>Cliente: {repo.cliente.nombre}</Text> 
              <Text style={styles.cardText}>Incremento de Venta: {formatearValores(repo.mano_obra)}</Text>
              <Text style={styles.cardText}>Costo: {formatearValores(repo.costo_final_producto)}</Text>
              <Text style={styles.cardText}>Operación:<Text style={{color:"green"}}>{repo.operacion}</Text> </Text>
            </View>
            
          )) }
           

        </View>

     </View>

      </View>

      </View>
    
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
    flex:1,// Para que ocupe todo el espacio disponible
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16, // Ajusta según sea necesario
    paddingBottom: 80, 
    margin: 12,
  
  },
  card: {
   width: "100%", // O considera un valor fijo si es necesario
    backgroundColor: "#fff",
    padding: 10, // Ajusta el padding para dar más espacio
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
    justifyContent: 'center', // Asegura que el contenido se centre verticalmente
    alignItems: 'end',
    minHeight: 150,
   
  },
  

  titleDash:{
    fontSize:30,
    fontWeight:'bold',
    marginTop:30
  },
 

scrollContainer: {
  flexGrow: 1,
}, // Asegura que el ScrollView ocupe todo el espacio disponible en el contenedor

titleDash: {
  fontSize: 30,
  fontWeight: 'bold',
  marginTop: 30
},
inputBusqueda: {
  height: 40,
  borderWidth: 1,
  padding: 10,
  borderColor: 'gray', // Cambia el color del borde si lo deseas
},
botonPagina: {
  padding: 10,
  marginHorizontal: 5,
  backgroundColor: 'lightgray',
},
botonPaginaActivo: {
  backgroundColor: 'blue',
},
textoPaginaActivo: {
  color: 'white',
},
});
      

export default Venta;