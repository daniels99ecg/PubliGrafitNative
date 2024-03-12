import React,{useState, useEffect} from "react";
import { View, Text, StyleSheet, StatusBar, TouchableHighlight, ScrollView  } from "react-native";
// import repositories from "../../data/repositories";
import RepositoryItem from "./RepositoryItem.jsx";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigate } from "react-router-native";
import Nav from "./Nav";

import { useUser } from "../context/userContext";



const RepoList=()=>{

    const [menuVisible, setMenuVisible] = useState(false); // Estado para controlar la visibilidad del menú
    const navigation = useNavigate();
    const { fetchPokemon, pokemon} = useUser();

    useEffect(() => {
      fetchPokemon();
    }, []);
  
  
    const toggleMenu = () => {
      setMenuVisible(!menuVisible); // Cambiar el estado de visibilidad del menú
    };
  


  
    return(
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Nav menuVisible={menuVisible} toggleMenu={toggleMenu} />

      <View style={styles.container}>
     

      <View style={styles.content}>

        <Text style={styles.titleDash}>Usuarios</Text>

        <View>
          
       {pokemon && (
        <View>
          {pokemon.map(repo=>(
            <View key={repo.id_usuario} style={styles.card}>
              <Text style={styles.cardText}>Documento: {repo.documento}</Text>
              <Text style={styles.cardText}>Nombres: {repo.nombres}</Text>
              <Text style={styles.cardText}>Apellidos: {repo.apellidos}</Text>
              <Text style={styles.cardText}>Correo: {repo.email}</Text>
              <Text style={styles.cardText}>Rol: {repo.nombre_rol}</Text>
            </View>
          )) }
        </View>
       )}
 
     </View>

      </View>
      
    
   
      </View>
      </ScrollView>
      </View>
    )
}
const styles = StyleSheet.create({
  container: {
  flex:1,
    backgroundColor: "#fff",
  },
  
  scrollContainer: {
    flexGrow: 1,
  },
  content: {
    flex: 1, // Para que ocupe todo el espacio disponible
    justifyContent: "center",
    alignItems: "center",
    
   
  },
  card: {
   width: "100%", // O considera un valor fijo si es necesario
    backgroundColor: "#fff",
    padding: 10, // Ajusta el padding para dar más espacio
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
    justifyContent: 'center', // Asegura que el contenido se centre verticalmente
    alignItems: 'flex-start',
  },


  titleDash:{
    fontSize:30,
    fontWeight:'bold',
    marginTop:30
  },

  cardText: {
    textAlign: 'left', // Alinea el texto a la izquierda
    marginBottom: 5, // Agrega un pequeño espacio entre cada línea de texto
},

});

export default RepoList