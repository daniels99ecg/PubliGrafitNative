import React, { createContext, useState, useContext } from 'react';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  
    console.log("hola: "+username)

    const [pokemon, setPokemon] = useState([]);


    async function fetchPokemon() {
      try {
        const response = await fetch(`${apiUrl}usuario`);
        const data = await response.json();
        setPokemon(data);
      } catch (error) {
        console.error("Error fetching Pokemon:", error);
      }
    }



  return (
    <UserContext.Provider value={{ username, setUsername, fetchPokemon, pokemon }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
