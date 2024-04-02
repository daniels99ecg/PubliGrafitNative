import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableHighlight, ScrollView, Modal, Button, TextInput, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigate } from "react-router-native";
import Nav from "../nav/Nav";
import { Picker } from '@react-native-picker/picker';
import { Alert } from 'react-native';
import FooterAbajo from "../nav/FooterAbajo"

const CreateOrden = ({ isModalVisible, toggleModalVisibility, handleAddVenta, nombreCliente, setNombreCliente, nombreProducto, setNombreProducto, setErrors, descripcion, setDescripcion, incrementoVenta, setIncrementoVenta, ordenesSeleccionadas, setOrdenesSeleccionadas, insumos, clientes, errors, handleSelectOrder, handleQuantityChange, handleRemoveOrder }) => {
  function formatearValores(amount) {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
  const total = ordenesSeleccionadas.reduce((acc, current) => acc + (current.cantidad * current.precio + (parseInt(incrementoVenta) || 0)), 0);
  const iva = total * 0.19
  const granTotal = iva + total



  return (
    <Modal
      animationType="slide"
      transparent
      visible={isModalVisible}
      presentationStyle="overFullScreen"
      onRequestClose={toggleModalVisibility}
    >

      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Registrar Nueva Orden</Text>


          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={nombreCliente}
              onValueChange={(itemValue, itemIndex) => {
                setNombreCliente(itemValue);
                // Limpia el error específico al modificar el campo, si es necesario
              }}
              style={styles.picker}
            >
              <Picker.Item label="Seleccionar Cliente" value={null} />

              {clientes.map((cliente, index) => (
                <Picker.Item key={index} label={cliente.nombre} value={cliente.id_cliente} />
              ))}
            </Picker>

          </View>

          <TextInput
            style={styles.input}
            placeholder="Nombre producto"
            value={nombreProducto}
            onChangeText={(text) => {
              setNombreProducto(text);
              // Limpia el error específico al modificar el campo
              setErrors(prevErrors => ({ ...prevErrors, nombreProducto: null }));
            }}
          />
          {errors.nombreProducto && <Text style={styles.errorText}>{errors.nombreProducto}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Descripción"
            value={descripcion}
            onChangeText={(text) => {
              setDescripcion(text);
              // Limpia el error específico al modificar el campo
              setErrors(prevErrors => ({ ...prevErrors, descripcion: null }));
            }}
          />
          {errors.descripcion && <Text style={styles.errorText}>{errors.descripcion}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Incremento de venta"
            value={incrementoVenta ? formatearValores(incrementoVenta) : ''}
            keyboardType="numeric"
            onChangeText={(text) => {
              if (text !== undefined) {
                setIncrementoVenta(text.replace(/\D/g, ''));
                // Limpia el error específico al modificar el campo
                setErrors((prevErrors) => ({ ...prevErrors, incrementoVenta: null }));
              }
            }}
          />
          {errors.incrementoVenta && <Text style={styles.errorText}>{errors.incrementoVenta}</Text>}

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={ordenesSeleccionadas}
              onValueChange={(itemValue, itemIndex) => handleSelectOrder(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Seleccionar insumo" value={null} />
              {insumos.filter(insumo => insumo.cantidad > 0).map((insumo, index) => (
    <Picker.Item key={index} label={insumo.nombre} value={insumo.id_insumo} />
  ))}
            </Picker>
          </View>

          {/* Tabla para mostrar las órdenes seleccionadas */}
          <View style={styles.tableContainer}>
            {ordenesSeleccionadas.length > 0 && (
              <>
                <Text style={styles.tableHeader}>Insumos Seleccionados</Text>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <Text style={styles.tableHeaderCell}>ID</Text>
                    <Text style={styles.tableHeaderCell}>Nombre</Text>
                    <Text style={styles.tableHeaderCell}>Cantidad</Text>
                    <Text style={styles.tableHeaderCell}>Precio</Text>

                  </View>
                  <ScrollView style={styles.tableScrollView}>
                    {ordenesSeleccionadas.map((orden, index) => (

                      <View style={styles.tableRow} key={index}>
                        <Text style={styles.tableCell}>{orden.id_insumo}</Text>
                        <Text style={styles.tableCell}>{orden.nombre}</Text>
                        <TextInput
                          style={styles.tableCellInput}
                          onChangeText={(text) => handleQuantityChange(text, index)}
                          value={String(orden.cantidad)}
                          keyboardType="numeric"
                        />
                        <Text style={styles.tableCell}>{formatearValores(orden.cantidad * orden.precio)}</Text>
                        <TouchableHighlight
                          style={styles.removeButton}
                          onPress={() => handleRemoveOrder(index)}
                        >
                          <Icon name="close" size={20} color="red" />


                        </TouchableHighlight>

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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>

            <View style={{ flexDirection: 'row', marginRight: 10 }}>
              <Button title="Agregar" onPress={handleAddVenta} />

            </View>

            <View style={{ flexDirection: 'row' }}>

              <Button title="Cerrar" onPress={toggleModalVisibility} />
            </View>
          </View>

        </View>
      </View>
    </Modal>

  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flex: 1,// Para que ocupe todo el espacio disponible
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16, // Ajusta según sea necesario
    paddingBottom: 80,

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
  menuButton: {
    marginRight: 10,
  },
  menuButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  titleMenu: {
    color: '#fff',
    fontSize: 25
  },
  titleDash: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    color: '#fff',
    fontSize: 25,
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
    width: 350, // Puedes ajustar el ancho según tu diseño
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  picker: {
    height: 25,
    width: 350,

  },
  titleDash: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30
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
    height: 160,
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
  tableScrollView: {
    maxHeight: 200, // Establece la altura máxima que deseas para la tabla antes de que aparezca el scroll
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  pickerContainerOrdenes: {
    borderWidth: 1,
    height: 54,
    borderColor: 'gray',
    borderRadius: 5,
  },
  tableCellInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    margin: 5,
    borderRadius: 5,
    // Añade más estilos según necesites
  },
  errorText: {
    color: "red"
  },
  boton: {
    paddingBottom: 49
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10, // Ajusta el margen superior según sea necesario
  }, button: {
    marginHorizontal: 5, // Esto añade espacio a ambos lados del botón
  },
  inputBusqueda: {
    height: 40,
    width: "50%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10, // Añade bordes redondeados
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
export default CreateOrden;