import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableHighlight, ScrollView,Modal, Button, TextInput  } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigate } from "react-router-native";
import Nav from "./Nav";
import {Picker} from '@react-native-picker/picker';


const Venta =()=>{
  const [menuVisible, setMenuVisible] = useState(false); 
  const [isModalVisible, setModalVisible] = useState(false);

  const [nombreCliente, setNombreCliente] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [total, setTotal] = useState('');
  const [selectedOrder, setSelectedOrder] = useState('');
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);

  // Supongamos que tienes un estado de órdenes así:
  // const [ordenes, setOrdenes] = useState([
  //     {id: 'orden1', nombre: 'Orden 1'},
  //     {id: 'orden2', nombre: 'Orden 2'},
  //     // Añade más órdenes según necesites
  // ]);

  const [ordenes, setOrdenes] = useState([]);

  async function fetchOrdenes() {
      try {
          const response = await fetch(`${apiUrl}fichatecnica`);
          const data = await response.json();
          setOrdenes(data);
      } catch (error) {
          console.error("Error ordenes:", error);
      }
  }


  const apiUrl = process.env.EXPO_PUBLIC_API_URL;

  const navigation = useNavigate();

  const toggleMenu = () => {
      setMenuVisible(!menuVisible); 
  };

  const [venta, setVenta] = useState([]);

  async function fetchVenta() {
      try {
          const response = await fetch(`${apiUrl}venta`);
          const data = await response.json();
          setVenta(data);
      } catch (error) {
          console.error("Error venta:", error);
      }
  }

  const toggleModalVisibility = () => {
      setModalVisible(!isModalVisible);
  };

  const handleAddVenta = async () => {
    const data = {
      fk_id_cliente: nombreCliente,
      metodo_pago: metodoPago,
      total: total,
      ordenesSeleccionadas: ordenesSeleccionadas // Asumiendo que este es un arreglo de objetos con la estructura adecuada
    };
  
    try {
      // Reemplaza esta URL con la dirección de tu propia API de autenticación
      const response = await fetch(`${apiUrl}venta/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      // Esperar la respuesta y convertirla a JSON
      const datos = await response.json();
      
      // Aquí puedes manejar la respuesta de la API si es necesario
      console.log('Venta agregada correctamente:', datos);
  
    } catch (error) {
      // Manejo de errores si algo sale mal durante la solicitud
      console.error("Error al iniciar sesión:", error);
      setErrorMessage("Error de conexión");
    }
  
    // Cerrar el modal tras registrar la venta, independientemente del resultado de la solicitud
    toggleModalVisibility();
  };
  

  const handleSelectOrder = (orderId) => {
    setSelectedOrder(orderId); // Establece la orden seleccionada
    const ordenSeleccionada = ordenes.find(orden => orden.id_ft === orderId);
    setOrdenesSeleccionadas([ordenSeleccionada]); // Muestra solo la orden seleccionada
};
console.log(ordenesSeleccionadas)

  useEffect(() => {
      fetchVenta();
      fetchOrdenes()
  }, []);


    
  return (
    <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
     <Nav menuVisible={menuVisible} toggleMenu={toggleMenu}/>
   
      <View style={styles.content}>

        {/*Esta es zona de trabajo*/}
        
        <Text style={styles.titleDash}>Estas son las ventas</Text>
        <View>
          
       {venta && (
        <View>
          {venta.map(repo=>(
            <View key={repo.id_venta} style={styles.card}>
              <Text style={styles.cardText}>Id venta: {repo.id_venta}</Text>
              <Text style={styles.cardText}>Nombre Cliente: {repo.cliente.nombre}</Text>
              <Text style={styles.cardText}>Metodo Pago: {repo.metodo_pago}</Text>
              <Text style={styles.cardText}>Total: {repo.total}</Text>
            </View>
          )) }
        </View>
       )}
 
     </View>
       
       
      </View>
     
      </View>
      <Button title="Registrar Venta" onPress={toggleModalVisibility} />

      <Modal
                    animationType="slide"
                    transparent
                    visible={isModalVisible}
                    presentationStyle="overFullScreen"
                    onRequestClose={toggleModalVisibility}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Registrar Nueva Venta</Text>

                            <Picker
    selectedValue={selectedOrder}
    onValueChange={(itemValue, itemIndex) => handleSelectOrder(itemValue)} // Llama a handleSelectOrder
    style={styles.picker}
>
    {ordenes.map((orden) => (
        <Picker.Item key={orden.id} label={orden.nombre_ficha} value={orden.id_ft} />
    ))}
</Picker>
                            <TextInput
                                style={styles.input}
                                placeholder="Nombre del Cliente"
                                value={nombreCliente}
                                onChangeText={setNombreCliente}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Método de Pago"
                                value={metodoPago}
                                onChangeText={setMetodoPago}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Total"
                                value={total}
                                keyboardType="numeric"
                                onChangeText={setTotal}
                            />

                              {/* Tabla para mostrar las órdenes seleccionadas */}
                              <View style={styles.tableContainer}>
    <Text style={styles.tableHeader}>Órdenes Seleccionadas</Text>
    <View style={styles.table}>
    <View style={styles.tableRow}>
            <Text style={styles.tableHeaderCell}>ID</Text>
            <Text style={styles.tableHeaderCell}>Nombre</Text>
            <Text style={styles.tableHeaderCell}>Operación</Text>
        </View>
        {ordenesSeleccionadas.map((orden) => (
                      <View style={styles.tableRow} key={orden.id_ft}>

            <Text style={styles.tableCell}>{orden.id_ft}</Text>
            
            <Text style={styles.tableCell}>{orden.nombre_ficha}</Text>
            <Text style={styles.tableCell}>{orden.operacion}</Text>

            </View>
        ))}
    </View>
</View>

                            <Button title="Agregar" onPress={handleAddVenta} />
                            <Text></Text>
                            <Button title="Cerrar" onPress={toggleModalVisibility} />

                          
                        </View>
                    </View>
                </Modal>
      </ScrollView>
      </View>
  );
};
   const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "#fff"
  },
  appbar: {
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
  content: {
     flex:1,// Para que ocupe todo el espacio disponible
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  
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
  menuButton: {
    marginRight: 10,
  },
  menuButtonText: {
    color: "#fff",
    fontSize: 18,
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
  titleMenu:{
    color:'#fff',
    fontSize:25
  },
  titleDash:{
    fontSize:30,
    fontWeight:'bold',
    marginTop:30
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
},
menuText: {
    color:'#fff',
    fontSize:25,
    marginLeft: 10, // Ajusta el margen izquierdo para separar el icono del texto
},
scrollContainer: {
  flexGrow: 1,
}, // Asegura que el ScrollView ocupe todo el espacio disponible en el contenedor
centeredView: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0,0,0,0.5)", // Fondo semitransparente
},
modalView: {
  margin: 20,
  backgroundColor: "white",
  borderRadius: 20,
  padding: 35,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
      width: 0,
      height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5
},
input: {
  height: 40,
  margin: 12,
  borderWidth: 1,
  padding: 10,
  width: 200, // Puedes ajustar el ancho según tu diseño
},
modalText: {
  marginBottom: 15,
  textAlign: "center"
}, 
picker: {
  height: 50,
  width: 200,
  marginBottom: 10,
},
titleDash: {
  fontSize: 30,
  fontWeight: 'bold',
  marginTop: 30
},
tableContainer: {
  marginTop: 50,
  alignItems: "center",
},
tableHeader: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 10,
},
table: {
  borderWidth: 1,
  borderColor: 'black',
  padding: 10,
  width: 300,
  height:100,
},  
 row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 5,
},
tableHeaderCell: {
  flex: 1,
  padding: 10,
  fontWeight: 'bold',
  textAlign: 'center',
},
tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black',
},
tableCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
},
});
      

export default Venta;