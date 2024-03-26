import React, { createContext, useState, useContext } from 'react';
import axios from 'axios'; // Importa axios

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
 
    const [datos, setDatos] = useState([]);
    const [datos2, setDatos2] = useState([]);
    const [datos3, setDatos3] = useState([]);
    // const [datos4, setDatos4] = useState([]);

    const fetchData = async () => {
        try {
          const response = await axios.get("https://danielg99.alwaysdata.net/fichatecnica/ordendia");
          setDatos(response.data); // Axios encapsula la respuesta bajo la propiedad 'data'
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
    
      const fetchData2 = async () => {
        try {
          const response = await axios.get("https://danielg99.alwaysdata.net/compras/compradia");
          setDatos2(response.data); // Igual aquí
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const fetchData3 = async () => {
        try {
          const response = await axios.get("https://danielg99.alwaysdata.net/fichatecnica/ordenmes");
          const jsonData3 = response.data;
     
      
          const labels = jsonData3.map(item => item.mes);
          const valores = jsonData3.map(item => item.totalVentasMes);
      
          const datosParaGrafica = {
           
              labels: labels,
              datasets: [
                {
                  data: valores
                }
              ]
          
          };
      
          setDatos3(datosParaGrafica); 
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      
      

      // const fetchData4 = async () => {
      //   try {
      //     const response = await axios.get("https://danielg99.alwaysdata.net/compras/compradeldia");
      //     const jsonData4 = response.data;
      
      //     // Transformar los datos para la gráfica de barras
      //     const datosParaGrafica = jsonData4.map(item => ({
      //       value: item.totalComprasMes,
      //       label: item.mes
      //     }));
      
      //     setDatos4(datosParaGrafica); 
      //     console.log(datosParaGrafica); // Verificar los datos transformados
      //   } catch (error) {
      //     console.error("Error fetching data:", error);
      //   }
      // };

  return (
    <DashboardContext.Provider value={{datos,datos2,datos3,fetchData, fetchData2, fetchData3}}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
