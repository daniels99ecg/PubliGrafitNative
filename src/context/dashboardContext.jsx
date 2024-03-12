import React, { createContext, useState, useContext } from 'react';
const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
 
    const [datos, setDatos] = useState([]);
    const [datos2, setDatos2] = useState([]);
    const [datos3, setDatos3] = useState([]);
    const [datos4, setDatos4] = useState([]);

    const fetchData = async () => {
        try {
          const response = await fetch(`${apiUrl}venta/ventadia`);
          const jsonData = await response.json();
          setDatos(jsonData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      const fetchData2 = async () => {
        try {
          const response2 = await fetch(`${apiUrl}compras/compradia`);
          const jsonData2 = await response2.json();
          setDatos2(jsonData2);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const fetchData3 = async () => {
        try {
          const response3 = await fetch(`${apiUrl}venta/ventames`);
          const jsonData3 = await response3.json();
      
          // Transformar los datos para la gráfica de barras
          const datosParaGrafica = jsonData3.map(item => ({
            value: item.totalVentasMes,
            label: item.mes
          }));
      
          setDatos3(datosParaGrafica); // Asumiendo que tienes un estado `datos3` para los datos de la gráfica
          console.log(datosParaGrafica); // Verificar los datos transformados
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

 const fetchData4 = async () => {
        try {
          const response4 = await fetch(`${apiUrl}compras/compradeldia`);
          const jsonData4 = await response4.json();
      
          // Transformar los datos para la gráfica de barras
          const datosParaGrafica = jsonData4.map(item => ({
            value: item.totalComprasMes,
            label: item.mes
          }));
      
          setDatos4(datosParaGrafica); // Asumiendo que tienes un estado `datos3` para los datos de la gráfica
          console.log(datosParaGrafica); // Verificar los datos transformados
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };


  return (
    <DashboardContext.Provider value={{datos,datos2,datos3,datos4,fetchData,fetchData2,fetchData3,fetchData4 }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
