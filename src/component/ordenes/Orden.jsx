import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableHighlight, ScrollView,Modal, Button, TextInput ,TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigate } from "react-router-native";
import Nav from "../nav/Nav";
import {Picker} from '@react-native-picker/picker';
import { Alert } from 'react-native';

const Orden =()=>{
  const [menuVisible, setMenuVisible] = useState(false); 
  const [isModalVisible, setModalVisible] = useState(false);
  const [ordenEditando, setOrdenEditando] = useState(null);
  const [isModalVisibleUpdate, setModalVisibleUpdate] = useState(false);


  const [nombreCliente, setNombreCliente] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [incrementoVenta, setIncrementoVenta] = useState('');
  
  const [selectedOrder, setSelectedOrder] = useState("");
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [ordenes, setOrdenes] = useState([]);

 

  const [errors, setErrors] = useState({});


  const validateForm = () => {
    let newErrors = {};
    let formIsValid = true;
  
    // Validación para el nombre del cliente (considerando que es numérico según tu código)
   
  
    // Validación para el nombre del producto
    if (!nombreProducto.trim()) {
      newErrors.nombreProducto = "El nombre del producto es requerido.";
      formIsValid = false;
    }
  
    // Validación para la descripción
    if (!descripcion.trim()) {
      newErrors.descripcion = "La descripción es requerida.";
      formIsValid = false;
    }
  
    // Validación para el incremento de venta (debe ser numérico)
    if (!incrementoVenta.trim()) {
      newErrors.incrementoVenta = "El incremento de venta es requerido.";
      formIsValid = false;
    } else if (isNaN(incrementoVenta)) {
      newErrors.incrementoVenta = "El incremento de venta debe ser un número.";
      formIsValid = false;
    }
  
    // Actualiza el estado de errores
    setErrors(newErrors);
    return formIsValid;
  };
  

  async function fetchOrdenes() {
      try {
          const response = await fetch(`${apiUrl}fichatecnica`);
          const data = await response.json();
          setOrdenes(data);
      } catch (error) {
          console.error("Error ordenes:", error);
      }
  }



  const [insumos, setInsumos] = useState([]);

  async function fetchInsumos() {
      try {
          const response = await fetch(`${apiUrl}insumo`);
          const data = await response.json();
          setInsumos(data);
      } catch (error) {
          console.error("Error Insumo:", error);
      }
  }


  const [ordensActualizar, setOrdensActualizar] = useState([]);
  
  async function fetchActualizarOrdenes(id_ft) {
      try {
          const response = await fetch(`${apiUrl}fichaTecnica/fichaOne/${id_ft}`);
          const data = await response.json();
          setOrdensActualizar(data);
        
      } catch (error) {
          console.error("Error Insumo:", error);
      }
  }




  const [clientes, setClientes] = useState([]);

  async function fetchCliente() {
      try {
          const response = await fetch(`${apiUrl}cliente`);
          const data = await response.json();
          setClientes(data);
      } catch (error) {
          console.error("Error Cliente:", error);
      }
  }

  const navigation = useNavigate();

  const toggleMenu = () => {
      setMenuVisible(!menuVisible); 
  };


  const toggleModalVisibility = () => {
      setModalVisible(!isModalVisible);
  };


  const toggleModalVisibilityUpdate = () => {
    setModalVisibleUpdate(!isModalVisibleUpdate);
};

  const handleAddVenta = async () => {
    if (!validateForm()) {
      console.log("La validación del formulario falló.");
      return; // Sale de la función si la validación falla
    }


    console.log("La orden es: ",ordenesSeleccionadas)
    const data = {
      nombre_ficha: nombreProducto,
      id_cliente:{fk_cliente:nombreCliente} ,
      imagen_producto_final:"3JEV4zlif.jpeg",
      costo_final_producto:5000,
      detalle: descripcion,
      mano_obra:incrementoVenta,
      insumo: ordenesSeleccionadas.map((orden) => ({
        fk_insumo: orden.id_insumo,
        cantidad: orden.cantidad,
        precio: orden.precio,
 
      })),
            };

    try {
      // Reemplaza esta URL con la dirección de tu propia API de autenticación
      const response = await fetch(`${apiUrl}fichatecnica/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        const datos = await response.json();
        console.log('Venta agregada correctamente:', datos);
        await fetchOrdenes();
      } else {
        const errorData = await response.json();
        if (errorData.error === "El nombre de la ficha técnica ya está registrado") {
          Alert.alert("Error", "El nombre de la ficha técnica ya está registrado");

        } else {
          console.error("Error desconocido:", errorData.error);
          Alert.alert("Error", "Error al procesar la solicitud");
        }
      }
    } catch (error) {
      // Manejo de errores si algo sale mal durante la solicitud
      console.error("Error al iniciar sesión:", error);
      setErrorMessage("Error de conexión");
    }
  
    // Cerrar el modal tras registrar la venta, independientemente del resultado de la solicitud
    toggleModalVisibility();
    toggleModalVisibility();
  setNombreCliente('');
  setNombreProducto('');
  setDescripcion('');
  setIncrementoVenta('');
  setOrdenesSeleccionadas('')
  };
  

  const handleSelectOrder = (orderId) => {
    const ordenSeleccionada = insumos.find(insumo => insumo.id_insumo === orderId);
    const ordenConCantidad = {...ordenSeleccionada, cantidad: "1"}; // Añadir campo de cantidad
  
    const existingIndex = ordenesSeleccionadas.findIndex(insumo => insumo.id_insumo === orderId);
    if (existingIndex === -1) {
      setOrdenesSeleccionadas([...ordenesSeleccionadas, ordenConCantidad]);
    } else {
      console.log("Este insumo ya ha sido seleccionado.");
    }
  };

  const handleQuantityChange = (newQuantity, index) => {
    const updatedOrdenes = ordenesSeleccionadas.map((item, i) => {
      if (i === index) {
        return { ...item, cantidad: newQuantity.replace(/[^0-9]/g, '') }; // Solo permite números
      }
      return item;
    });
    setOrdenesSeleccionadas(updatedOrdenes);
  };


const handleRemoveOrder = (indexToRemove) => {
  setOrdenesSeleccionadas(ordenesSeleccionadas.filter((_, index) => index !== indexToRemove));
};
console.log(ordenesSeleccionadas)

  useEffect(() => {
      fetchOrdenes()
      fetchInsumos()
      fetchCliente()
  }, []);

  async function fetchEliminarOrdenes(id_ft) {
    try {
      const response = await fetch(`${apiUrl}fichaTecnica/delete/${id_ft}`, {
        method: "DELETE",
      });
      if (response.ok) {
        console.log(`Orden con id_ft ${id_ft} eliminada correctamente.`);
        await fetchOrdenes();
        // Aquí puedes actualizar el estado o realizar otras acciones necesarias después de eliminar la orden
      } else {
        console.error("Error al intentar eliminar la orden.");
      }
    } catch (error) {
      console.error("Error al eliminar la orden:", error);
    }
  }
  
    

  const handleEditInsumoQuantity = (newQuantity, index) => {
    const updatedInsumos = [...ordensActualizar.detalles];
    updatedInsumos[index].cantidad = newQuantity.replace(/[^0-9]/g, '');
    setOrdenEditando(prevOrdenEditando => ({
      ...prevOrdenEditando,
      insumo: updatedInsumos
    }));
  };
  
  return (
    <View style={styles.container}>
    
    <ScrollView contentContainerStyle={styles.scrollContainer}>
    <View style={styles.container}>
     <Nav menuVisible={menuVisible} toggleMenu={toggleMenu}/>
   
      <View style={styles.content}>

        {/*Esta es zona de trabajo*/}
        
        <Text style={styles.titleDash}>Listar Ordenes</Text>
        <View>
          
       
        <View>
          {ordenes.map(repo=>(
            <View key={repo.id_ft} style={styles.card}>
              <Text style={styles.cardText}>Id Orden: {repo.id_ft}</Text>
              <Text style={styles.cardText}>Nombre: {repo.nombre_ficha}</Text>
              <Text style={styles.cardText}>Cliente: {repo.cliente.nombre}</Text> 
              <Text style={styles.cardText}>Costo: {repo.costo_final_producto}</Text>
              <Text style={styles.cardText}>Mano de Obra: {repo.mano_obra}</Text>
              <Text style={styles.cardText}>Operación: {repo.operacion}</Text>
              <TouchableOpacity onPress={() => {
    fetchActualizarOrdenes(repo.id_ft); // Establece la orden que se está editando
    toggleModalVisibilityUpdate(); // Abre el modal
}}>
    <Icon name="edit" size={24} color="blue" />
</TouchableOpacity>

                      <TouchableOpacity onPress={() => fetchEliminarOrdenes(repo.id_ft)}>
                        <Icon name="delete" size={30} color="red" />
                      </TouchableOpacity>
            </View>
          )) }
        </View>
    
     </View>
      </View>
      </View>
      <Button title="Registrar Orden" onPress={toggleModalVisibility} />

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

                            
                            <View style={styles.pickerContainer}>
  <Picker
    selectedValue={nombreCliente}
    onValueChange={(itemValue, itemIndex) => {
      setNombreCliente(itemValue);
      // Limpia el error específico al modificar el campo, si es necesario
    }}
    style={styles.picker}>
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
                                value={incrementoVenta}
                                keyboardType="numeric"
                              
                                onChangeText={(text) => {
                                  setIncrementoVenta(text);
                                  // Limpia el error específico al modificar el campo
                                  setErrors(prevErrors => ({ ...prevErrors, incrementoVenta: null }));
                                }}
                            />
                           {errors.incrementoVenta && <Text style={styles.errorText}>{errors.incrementoVenta}</Text>}

<View style={styles.pickerContainer}>
  <Picker
      selectedValue={ordenesSeleccionadas}
      onValueChange={(itemValue, itemIndex) => handleSelectOrder(itemValue)}
      style={styles.picker}
  >
      {insumos.map((insumo, index) => (
          <Picker.Item key={index} label={insumo.nombre} value={insumo.id_insumo} />
      ))}
  </Picker>
</View>

                              {/* Tabla para mostrar las órdenes seleccionadas */}
                              <View style={styles.tableContainer}>
                             {ordenesSeleccionadas.length > 0 && (
    <>
    <Text style={styles.tableHeader}>Insumos Seleccionadas</Text>
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
      <Text style={styles.tableCell}>{orden.precio}</Text>
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
    </>
  )}
</View>

                            <Button title="Agregar" onPress={handleAddVenta} />
                            <Text></Text>
                            <Button title="Cerrar" onPress={toggleModalVisibility} />

                          
                        </View>
                    </View>
                </Modal>

                <Modal
    animationType="slide"
    transparent
    visible={isModalVisibleUpdate}
    presentationStyle="overFullScreen"
    onRequestClose={toggleModalVisibilityUpdate}
>
    <View style={styles.centeredView}>
        <View style={styles.modalView}>
            <Text style={styles.modalText}>Editar Orden</Text>
            {/* Aquí puedes mostrar los campos de la orden para edición */}
            <Text>ID Orden: {ordenEditando ? ordenEditando.id_ft : ""}</Text>

            <View style={styles.pickerContainer}>
  <Picker
    selectedValue={ordenEditando?.fk_cliente || ""}
    onValueChange={(itemValue, itemIndex) => {
      setNombreCliente(itemValue);
      // Limpia el error específico al modificar el campo, si es necesario
    }}
    style={styles.picker}>
    {clientes.map((cliente, index) => (
      <Picker.Item key={index} label={cliente.nombre} value={cliente.id_cliente} />
    ))}
  </Picker>
</View>
         <TextInput
                                style={styles.input}
                                placeholder="Nombre producto"
                                value={ordensActualizar?.nombre_ficha || ""}
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
                                value={ordensActualizar?.detalle || ""}
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
                                value={ordensActualizar ? String(ordensActualizar.mano_obra) : ""}
                          
                                onChangeText={(text) => {
                                  setIncrementoVenta(text);
                                  // Limpia el error específico al modificar el campo
                                  setErrors(prevErrors => ({ ...prevErrors, incrementoVenta: null }));
                                }}
                            />
                           {errors.incrementoVenta && <Text style={styles.errorText}>{errors.incrementoVenta}</Text>}

                       

                           <View style={styles.tableContainer}>
  {ordensActualizar && ordensActualizar.detalles && ordensActualizar.detalles.length > 0 && (
    <>
      <Text style={styles.tableHeader}>Insumos de la Orden</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeaderCell}>ID</Text>
          <Text style={styles.tableHeaderCell}>Nombre</Text>
          <Text style={styles.tableHeaderCell}>Cantidad</Text>
          <Text style={styles.tableHeaderCell}>Precio</Text>
        </View>
        <ScrollView style={styles.tableScrollView}>
          {ordensActualizar.detalles.map((insumo, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{insumo.fk_insumo}</Text>
              <Text style={styles.tableCell}>{insumo.insumo.nombre}</Text>
              <TextInput 
                style={styles.tableCellInput} 
                onChangeText={(text) => handleEditInsumoQuantity(text, index)} 
                value={String(insumo.cantidad)}  
                keyboardType="numeric"
              />
              <Text style={styles.tableCell}>{insumo.precio}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </>
  )}
</View>





            {/* Mostrar otros campos de la orden para edición */}
            <Button title="Actualizar" onPress={()=>{
              console.log("Edit")
            }} />
            <Text></Text>
            <Button title="Cerrar" onPress={toggleModalVisibilityUpdate} />
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
  width: 390,
  height:150,
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
  marginBottom: 10, // Ajusta este valor según sea necesario
},
picker: {
  height: 2, 
  width:200// Ajusta la altura según sea necesario
  // Si necesitas un padding interno, considera envolver tu Picker en una View adicional
},tableCellInput: {
  borderWidth: 1,
  borderColor: '#ccc',
  padding: 5,
  margin: 5,
  borderRadius: 5,
  // Añade más estilos según necesites
},
errorText:{
  color:"red"
}
});
      

export default Orden;