import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, StatusBar, TouchableHighlight, ScrollView,Modal, Button, TextInput ,TouchableOpacity, SafeAreaView  } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
// import { useNavigate } from "react-router-native";
import Nav from "../nav/Nav";
import {Picker} from '@react-native-picker/picker';
import { Alert } from 'react-native';
import FooterAbajo from "../nav/FooterAbajo"
import CreateOrden from "./CreateOrden";
const Orden =()=>{
  const [menuVisible, setMenuVisible] = useState(false); 
  const [isModalVisible, setModalVisible] = useState(false);
  const [ordenEditando, setOrdenEditando] = useState(null);
  const [isModalVisibleUpdate, setModalVisibleUpdate] = useState(false);
  const [busqueda, setBusqueda] = useState(''); // Estado para el texto de búsqueda
  const [paginaActual, setPaginaActual] = useState(1);
  const ordenesPorPagina = 2; 

  const [nombreCliente, setNombreCliente] = useState('');
  const [nombreProducto, setNombreProducto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [incrementoVenta, setIncrementoVenta] = useState('');
  
  const [selectedOrder, setSelectedOrder] = useState("");
  const [ordenesSeleccionadas, setOrdenesSeleccionadas] = useState([]);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  const [ordenes, setOrdenes] = useState([]);

 
  const [nuevosInsumosSeleccionadosUpdate, setNuevosInsumosSeleccionadosUpdate] = useState([]);

  const handleSelectNewOrderUpdate = (orderId) => {
    const insumoSeleccionado = insumos.find(insumo => insumo.id_insumo === orderId);
    
    const insumoConCantidad = { ...insumoSeleccionado, cantidad: "1" }; // Añadir campo de cantidad
  
    const existingIndex =  nuevosInsumosSeleccionadosUpdate.findIndex(insumo => insumo.id_insumo === orderId);
    if (existingIndex === -1) {
      setNuevosInsumosSeleccionadosUpdate([...nuevosInsumosSeleccionadosUpdate, insumoConCantidad]);
    } else {
      console.log("Este insumo ya ha sido seleccionado.");
    }
  };

  // Función para manejar la eliminación de nuevos insumos
  const handleRemoveNewOrderUpdate = (indexToRemove) => {
    setNuevosInsumosSeleccionadosUpdate(nuevosInsumosSeleccionadosUpdate.filter((_, index) => index !== indexToRemove));
  };



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
  const totalupdate = ordensActualizar && ordensActualizar.detalles ? ordensActualizar.detalles.reduce((acc, current) => acc + (current.cantidad * current.precio + (parseInt(incrementoVenta) || 0) ), 0) : 0;
  const totalupdate2 = nuevosInsumosSeleccionadosUpdate ? nuevosInsumosSeleccionadosUpdate.reduce((acc, current) => acc + (current.cantidad * current.precio), 0) : 0;
  const SumaTotal = totalupdate + totalupdate2
  
  const iva=SumaTotal*0.19
  const granTotal=iva+SumaTotal

  async function fetchActualizarOrdenes(id_ft) {
      try {
          const response = await fetch(`${apiUrl}fichaTecnica/fichaOne/${id_ft}`);
          const data = await response.json();
          setOrdensActualizar(data);
        
      } catch (error) {
          console.error("Error Insumo:", error);
      }
  }


  const handleUpdateOrder = async () => {
    const data = {
      nombre_ficha: nombreProducto,
       fk_cliente: nombreCliente,
      detalle: descripcion,
      mano_obra: incrementoVenta,
      costo_final_producto: SumaTotal,

      detalles: [
        ...ordensActualizar.detalles.map(detalle => ({
          fk_insumo: detalle.fk_insumo,
          cantidad: detalle.cantidad,
          precio: detalle.precio
        })),
        ...nuevosInsumosSeleccionadosUpdate.map(insumo => ({
          fk_insumo: insumo.id_insumo,
          cantidad: insumo.cantidad,
          precio: insumo.precio
        }))
      ]
    };
  
    try {
      const response = await fetch(`${apiUrl}fichatecnica/update/${ordensActualizar.id_ft}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (response.ok) {
        console.log(data)
        console.log(`Orden con ID ${ordensActualizar.id_ft} actualizada correctamente.`);
        // Aquí puedes realizar acciones adicionales después de la actualización
        // Por ejemplo, cerrar el modal de edición
        toggleModalVisibilityUpdate();
        await fetchOrdenes(); // Actualizar la lista de órdenes después de la actualización
      } else {
        const errorData = await response.json();

        console.error("Error al actualizar la orden:", errorData.error);
        // Aquí puedes manejar el caso si la solicitud no es exitosa
      }
    } catch (error) {
      console.error("Error al actualizar la orden:", error);
      // Aquí puedes manejar los errores que ocurran durante la solicitud
    }
  };
  


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

  // const navigation = useNavigate();

  const toggleMenu = () => {
      setMenuVisible(!menuVisible); 
  };


  const toggleModalVisibility = () => {
      setModalVisible(!isModalVisible);
       // Cerrar el modal tras registrar la venta, independientemente del resultado de la solicitud

  setNombreCliente('');
  setNombreProducto('');
  setDescripcion('');
  setIncrementoVenta('');
  setOrdenesSeleccionadas([])
  };


  const toggleModalVisibilityUpdate = () => {
    setModalVisibleUpdate(!isModalVisibleUpdate);
};
const total = ordenesSeleccionadas.reduce((acc, current) => acc + (current.cantidad * current.precio + (parseInt(incrementoVenta) || 0) ), 0);

  const handleAddVenta = async () => {
    setOrdenesSeleccionadas([])

    if (!validateForm()) {
      console.log("La validación del formulario falló.");
      return; // Sale de la función si la validación falla
    }
    Alert.alert(
      "Confirmar Venta", // Título del Alert
      "¿Estás seguro de que quieres registrar esta Orden?", // Mensaje de confirmación
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Envío cancelado"),
          style: "cancel"
        },
        { text: "Confirmar", onPress: () => submitVenta() } // Llama a submitVenta si el usuario confirma
      ],
      { cancelable: false } // Esto impide que el usuario cierre el alert tocando fuera de él
    );
  };

    const submitVenta = async () => {
      console.log("La orden es: ", ordenesSeleccionadas);
      const data = {
        nombre_ficha: nombreProducto,
        id_cliente: { fk_cliente: nombreCliente },
        imagen_producto_final: "3JEV4zlif.jpeg",
        costo_final_producto: total,
        detalle: descripcion,
        mano_obra: incrementoVenta,
        insumo: ordenesSeleccionadas.map(orden => ({
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
          // console.error("Error desconocido:", errorData.error);
          Alert.alert(errorData.error);
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
  setOrdenesSeleccionadas([])
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
    const updatedInsumos = [...nuevosInsumosSeleccionadosUpdate];
    updatedInsumos[index].cantidad = newQuantity.replace(/[^0-9]/g, '');
  
    // Calcular el precio total del insumo basado en la nueva cantidad
    updatedInsumos[index].precioTotal = updatedInsumos[index].cantidad * updatedInsumos[index].precio;
  
    setNuevosInsumosSeleccionadosUpdate(updatedInsumos);
  };
  

  useEffect(() => {
    if (ordensActualizar) {
      setNombreCliente(ordensActualizar?.fk_cliente || "")
      setNombreProducto(ordensActualizar.nombre_ficha || '');
      setDescripcion(ordensActualizar.detalle || '');
      setIncrementoVenta(String(ordensActualizar.mano_obra) || '');
    }
  }, [ordensActualizar]);
  

  async function actualizarOperacion(idFt, nuevaOperacion) {
    try {
      const response = await fetch(`${apiUrl}fichaTecnica/operacion/${idFt}`, {
        method: 'PUT', // O el método apropiado para tu caso
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ operacion: nuevaOperacion })
      });
  
      if (response.ok) {
        await fetchOrdenes();
      } else {
        const errorData = await response.json();
        // console.error('Error al actualizar la operación:', errorData.error);
        Alert.alert(errorData.error);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  }
  
  const ordenesFiltradas = ordenes.filter(repo =>
    repo.nombre_ficha.toLowerCase().includes(busqueda.toLowerCase()) ||
    repo.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    repo.costo_final_producto.toString().includes(busqueda) ||
    repo.mano_obra.toString().includes(busqueda)
  );

  const indiceFinal = paginaActual * ordenesPorPagina;
  const indiceInicial = indiceFinal - ordenesPorPagina;
  const ordenesActuales = ordenesFiltradas.slice(indiceInicial, indiceFinal);
  const totalPaginas = Math.ceil(ordenesFiltradas.length / ordenesPorPagina);
  const botonesPaginas = [];
  
  for (let numeroPagina = 1; numeroPagina <= totalPaginas; numeroPagina++) {
    botonesPaginas.push(
      <TouchableOpacity
        key={numeroPagina}
        onPress={() => setPaginaActual(numeroPagina)}
        style={[styles.botonPagina, paginaActual === numeroPagina ? styles.botonPaginaActivo : {}]}
      >
        <Text style={paginaActual === numeroPagina ? styles.textoPaginaActivo : {}}>{numeroPagina}</Text>
      </TouchableOpacity>
    );
  }


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
         <Nav title="Listar Ordenes"/> 

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
        
        {/* <Text style={styles.titleDash}>Listar Ordenes</Text> */}
       
        <View>
        <View>
        {ordenesActuales.map(repo => (
            <View key={repo.id_ft} style={styles.card}>
              <Text style={styles.cardText}>Id Orden: <Text style={{fontWeight:'normal'}}>{repo.id_ft}</Text></Text>
              <Text style={styles.cardText}>Nombre: <Text style={{fontWeight:'normal'}}> {repo.nombre_ficha}</Text></Text>
              <Text style={styles.cardText}>Cliente: <Text style={{fontWeight:'normal'}}>{repo.cliente.nombre}</Text></Text> 
              <Text style={styles.cardText}>Incremento de venta:<Text style={{fontWeight:'normal'}}> {formatearValores(repo.mano_obra)}</Text></Text>
              <Text style={styles.cardText}>Costo: <Text style={{fontWeight:'normal'}}>{formatearValores(repo.costo_final_producto)}</Text></Text>
              <View style={styles.pickerContainerOrdenes}>

        <Picker
          selectedValue={repo.operacion}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => {
            actualizarOperacion(repo.id_ft, itemValue);
}}>
          <Picker.Item label={repo.operacion} value={repo.operacion} />
          <Picker.Item label="Realizada" value="Realizada" />
          {/* Agrega más opciones según sea necesario */}
        </Picker>
        </View>

        <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => {
          fetchActualizarOrdenes(repo.id_ft); // Establece la orden que se está editando
          toggleModalVisibilityUpdate(); // Abre el modal
        }}
        style={styles.button}

        >
          
          <Icon name="edit" size={30} color="blue" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => fetchEliminarOrdenes(repo.id_ft)}  style={styles.button}>
          <Icon name="delete" size={30} color="red" />
        </TouchableOpacity>
      </View>
            </View>
          )) }
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
            {botonesPaginas}
          </View>
        </View>

     </View>

      </View>

      </View>
    

      <CreateOrden
        isModalVisible={isModalVisible}
        toggleModalVisibility={toggleModalVisibility}
        handleAddVenta={handleAddVenta}
        nombreCliente={nombreCliente}
        setNombreCliente={setNombreCliente}
        nombreProducto={nombreProducto}
        setNombreProducto={setNombreProducto}
        descripcion={descripcion}
        setDescripcion={setDescripcion}
        incrementoVenta={incrementoVenta}
        setIncrementoVenta={setIncrementoVenta}
        ordenesSeleccionadas={ordenesSeleccionadas}
        setOrdenesSeleccionadas={setOrdenesSeleccionadas}
        insumos={insumos}
        clientes={clientes}
        errors={errors}
        setErrors={setErrors}
        handleSelectOrder={handleSelectOrder}
        handleQuantityChange={handleQuantityChange}
        handleRemoveOrder={handleRemoveOrder}
      />

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
                                value={formatearValores(incrementoVenta)}
                          
                                onChangeText={(text) => {
                                  setIncrementoVenta(text.replace(/\D/g, ''));
                                  // Limpia el error específico al modificar el campo
                                  setErrors(prevErrors => ({ ...prevErrors, incrementoVenta: null }));
                                }}
                            />
                           {errors.incrementoVenta && <Text style={styles.errorText}>{errors.incrementoVenta}</Text>}

                           <View style={styles.pickerContainer}>
                           <Picker
  selectedValue={ordenesSeleccionadas}
  onValueChange={(itemValue, itemIndex) => {
    handleSelectNewOrderUpdate(itemValue); // Llamar a la función para agregar el insumo seleccionado
  }}
  style={styles.picker}
>
<Picker.Item label="Seleccionar insumo" value={null} />

{insumos.filter(insumo => insumo.cantidad > 0).map((insumo, index) => (
    <Picker.Item key={index} label={insumo.nombre} value={insumo.id_insumo} />
  ))}
</Picker>
</View>

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
            <View style={styles.tableRow} key={'existente-' + index}>
              <Text style={styles.tableCell}>{insumo.fk_insumo}</Text>
              <Text style={styles.tableCell}>{insumo.insumo.nombre}</Text>
              <TextInput 
                style={styles.tableCellInput} 
                onChangeText={(text) => handleEditInsumoQuantity(text, index)} 
                value={String(insumo.cantidad)}  
                keyboardType="numeric"
              />
              <Text style={styles.tableCell}>{insumo.precio * insumo.cantidad}</Text>
            </View>
          ))}
          {nuevosInsumosSeleccionadosUpdate.map((insumo, index) => (
        <View style={styles.tableRow} key={'nuevo-' + index}>
          <Text style={styles.tableCell}>{insumo.id_insumo}</Text>
          <Text style={styles.tableCell}>{insumo.nombre}</Text>
          <TextInput 
            style={styles.tableCellInput} 
            onChangeText={(text) => handleEditInsumoQuantity(text, index)} 
            value={String(insumo.cantidad)}  
            keyboardType="numeric"
          />
          <Text style={styles.tableCell}>{insumo.precio * insumo.cantidad}</Text>
          <TouchableHighlight
            style={styles.removeButton}
            onPress={() => handleRemoveNewOrderUpdate(index)} // Manejar la eliminación de nuevos insumos
          >
            <Icon name="close" size={20} color="red" />
          </TouchableHighlight>
        </View>
      ))}
        </ScrollView>
      </View>
      <View>
                <Text >SubTotal: {formatearValores(SumaTotal)}</Text>
                <Text >Iva 19%: {formatearValores(iva)}</Text>
                <Text >Total: {formatearValores(granTotal)}</Text>
                </View>
    </>
  )}
</View>

<Text></Text>
            {/* Mostrar otros campos de la orden para edición */}
            <Button title="Actualizar" onPress={handleUpdateOrder} />

            <Text></Text>
            <Button title="Cerrar" onPress={toggleModalVisibilityUpdate} />
        </View>
    </View>
    
</Modal>

      </ScrollView>
      <SafeAreaView style={styles.containerboton}>
      {/* <Button title="+"  onPress={toggleModalVisibility} /> */}

      <TouchableOpacity style={styles.boton} onPress={toggleModalVisibility}>
      <Text>
        <Icon name="add" size={30} color="#FFF" /> {/* Usamos el ícono 'star' como ejemplo */}
      </Text>
      </TouchableOpacity>
  
      </SafeAreaView>

      <FooterAbajo/> 

      </View>
  );
};


   const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "#fff"
  },
  containerboton:{
    flex:1,
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
 
  width: 200,
 
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
pickerContainerOrdenes: {
  borderWidth: 1,
  height:50,
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
errorText:{
  color:"red"
},
boton:{
  position: 'relative', // Posición absoluta para el botón
  bottom: 0, // Posicionado en la parte inferior de la pantalla
  left: 300, // Al lado izquierdo de la pantalla
  width: 60, // Ancho del círculo
  height: 60, // Altura del círculo
  borderRadius: 30, // Esto hará que sea un círculo
  justifyContent: 'center', // Centra el contenido (el texto del botón) verticalmente
  alignItems: 'center', // Centra el contenido (el texto del botón) horizontalmente
  backgroundColor: '#007bff',
},
buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 10, // Ajusta el margen superior según sea necesario
},button: {
  marginHorizontal: 5, // Esto añade espacio a ambos lados del botón
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
cardText:{
  fontWeight:'bold'
}
});
      

export default Orden;