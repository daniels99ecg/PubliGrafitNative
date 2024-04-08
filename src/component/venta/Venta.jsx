import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableHighlight, ScrollView, Modal, Button, TextInput, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigate } from "react-router-native";
import Nav from "../nav/Nav";
import { Picker } from '@react-native-picker/picker';
import { Alert } from 'react-native';
import FooterAbajo from "../nav/FooterAbajo"

const Venta = () => {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [ordenes, setOrdenes] = useState([]);
  const [busqueda, setBusqueda] = useState(''); // Estado para el texto de búsqueda
  const [isModalVisibleInfo, setModalVisibleInfo] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [ordensActualizar, setOrdensActualizar] = useState([]);

  const [nombreProducto, setNombreProducto] = useState('');

  const [paginaActual, setPaginaActual] = useState(1);
  const ordenesPorPagina = 11; // La cantidad de órdenes que quieres mostrar por página


  async function fetchOrdenes() {
    try {
      const response = await fetch(`${apiUrl}fichatecnica/realizada`);
      const data = await response.json();
      setOrdenes(data);
    } catch (error) {
      console.error("Error ordenes:", error);
    }
  }

  async function fetchActualizarOrdenes(id_ft) {
    try {
      const response = await fetch(`${apiUrl}fichaTecnica/fichaOne/${id_ft}`);
      const data = await response.json();
      setOrdensActualizar(data);

    } catch (error) {
      console.error("Error Insumo:", error);
    }
  }


  useEffect(() => {
    fetchOrdenes()
    fetchActualizarOrdenes()
  }, []);


  useEffect(() => {
    if (ordensActualizar) {

      setNombreProducto(ordensActualizar.nombre_ficha || '');

    }
  }, [ordensActualizar]);


  const ordenesFiltradas = ordenes.filter(repo =>
    repo.nombre_ficha.toLowerCase().includes(busqueda.toLowerCase()) ||
    repo.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    repo.costo_final_producto.toString().includes(busqueda) ||
    repo.mano_obra.toString().includes(busqueda)
  );

  const indiceFinal = paginaActual * ordenesPorPagina;
  const indiceInicial = indiceFinal - ordenesPorPagina;
  const ordenesActuales = ordenesFiltradas.reverse(indiceInicial, indiceFinal);


  function formatearValores(amount) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  const toggleModalVisibilityInfo = (order) => {
    setModalVisibleInfo(!isModalVisibleInfo);
    setSelectedOrder(order);
  };
 
  const totalantes = ordensActualizar && ordensActualizar.detalles ? ordensActualizar.detalles.reduce((acc, current) => acc + (current.cantidad * current.precio), 0) : 0;
  const total= totalantes+parseInt(ordensActualizar.mano_obra)
  const iva = total * 0.19
  const granTotal = iva + total
  return (
    <View style={styles.container}>
      <Nav title="Listar Ventas" />

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
                  <TouchableOpacity key={repo.id_ft} style={styles.card}
                    onPress={() => {
                      toggleModalVisibilityInfo()
                      fetchActualizarOrdenes(repo.id_ft);
                    }
                    }>
                    <Text style={styles.cardText}>Orden: {repo.id_ft}</Text>
                    <Text style={styles.cardText}>Nombre: {repo.nombre_ficha}</Text>
                    <Text style={styles.cardText}>Cliente: {repo.cliente.nombre}</Text>
                    <Text style={styles.cardText}>Incremento de Venta: {formatearValores(repo.mano_obra)}</Text>
                    <Text style={styles.cardText}>Costo: {formatearValores(repo.costo_final_producto)}</Text>
                    <Text style={styles.cardText}>Operación:<Text style={{ color: "green" }}>{repo.operacion}</Text> </Text>
                  </TouchableOpacity>
                ))}

              </View>

            </View>

          </View>

        </View>

        {/*Info*/}

        <Modal
          animationType="slide"
          transparent
          visible={isModalVisibleInfo}
          presentationStyle="overFullScreen"
          onRequestClose={toggleModalVisibilityInfo}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
                  
              <View style={styles.tableContainer}>
  {ordensActualizar && ordensActualizar.detalles && ordensActualizar.detalles.length > 0 && (
    <>
      <Text style={styles.tableHeader}>Detalles Insumos</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeaderCell}>ID</Text>
          <Text style={styles.tableHeaderCell}>Nombre</Text>
          <Text style={styles.tableHeaderCell}>Cantidad</Text>
          <Text style={styles.tableHeaderCell}>Precio</Text>
        </View>
        <ScrollView style={styles.tableScrollView}>
          {ordensActualizar.detalles.map((insumo, index) => (
            <View style={styles.tableRow} key={'existente-' + index}>
              <Text style={styles.tableCell}>{insumo.fk_insumo}</Text>
              <Text style={styles.tableCell}>{insumo.insumo?.nombre}</Text>
              <TextInput 
                style={styles.tableCellInput} 
                onChangeText={(text) => handleEditInsumoQuantity(text, index)} 
                value={String(insumo.cantidad )}  
                keyboardType="numeric"
              />
              <Text style={styles.tableCell}>{insumo.precio * insumo.cantidad}</Text>
            </View>
          ))}
        </ScrollView>
        
      </View>
      <View>
                  <Text >SubTotal: {formatearValores(total)}</Text>
                  <Text >Iva 19%: {formatearValores(iva)}</Text>
                  <Text style={{fontWeight: 'bold', fontSize:22}}>Total: {formatearValores(granTotal)}</Text>
                </View>
    </>
  )}
</View>
<View style={{ flexDirection: 'row' }}>
            <Button title="Cerrar" onPress={toggleModalVisibilityInfo} />
            </View>
            </View>
          </View>
        </Modal>






      </ScrollView>

      <FooterAbajo />

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },


  content: {
    flex: 1,// Para que ocupe todo el espacio disponible
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


  titleDash: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30
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
  }, modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  tableContainer: {
    marginTop: 5,
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
    width: 350,
    height:160,
  },  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: 'black',
},
tableCell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
},tableHeaderCell: {
  flex: 1,
  padding: 10,
  fontWeight: 'bold',
  textAlign: 'center',
},tableScrollView: {
  maxHeight: 200, // Establece la altura máxima que deseas para la tabla antes de que aparezca el scroll
},
});


export default Venta;