import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import * as XLSX from 'xlsx';  // Importar xlsx

// Registrar componentes de Chart.js que se van a utilizar
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Colores predefinidos para las gráficas
const chartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

function Graficas() {
  const [variables, setVariables] = useState([]); // Estado para guardar las variables meteorológicas
  const [isLoading, setIsLoading] = useState(true);

  // Simular datos quemados dentro de useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Datos simulados
        const simulatedData = [
          {
            nombre: 'Temperatura',
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            data: [24, 26, 22, 28, 25, 30]
          },
          {
            nombre: 'Humedad',
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            data: [70, 65, 80, 60, 75, 68]
          },
          {
            nombre: 'Precipitación',
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            data: [12, 15, 10, 18, 5, 20]
          },
          {
            nombre: 'Nivel de agua',
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            data: [70, 65, 80, 60, 75, 68]
          },
          {
            nombre: 'Presión atmosférica',
            labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'],
            data: [12, 15, 10, 18, 5, 20]
          }
        ];

        setVariables(simulatedData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Función para exportar datos a Excel
  const exportToExcel = (variable) => {
    const worksheet = XLSX.utils.json_to_sheet(
      variable.labels.map((label, index) => ({
        Mes: label,
        Valor: variable.data[index]
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, variable.nombre);
    XLSX.writeFile(workbook, `${variable.nombre}.xlsx`);
  };

  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {variables.map((variable, index) => (
          <div className="col-lg-6 col-md-6 mb-4" key={index}>
            <div style={{
              padding: '20px',
              border: '1px solid #ffffff',
              borderRadius: '10px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              background: '#ffffff',
            }}>
              <Bar
                data={{
                  labels: variable.labels, 
                  datasets: [
                    {
                      label: `${variable.nombre}`, 
                      data: variable.data,  
                      borderColor: chartColors[index % chartColors.length], 
                      backgroundColor: `${chartColors[index % chartColors.length]}88`, 
                      borderWidth: 2,
                      barPercentage: 0.7, 
                    }
                  ]
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: true,
                    },
                    title: {
                      display: true,
                      text: `Gráfica de ${variable.nombre}`,
                      font: {
                        size: 20,
                        weight: 'bold',
                        family: 'Poppins',
                      },
                      color: '#0C2840',
                    },
                    tooltip: {
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      titleFont: { size: 16 },
                      bodyFont: { size: 14 },
                      bodySpacing: 4,
                      borderColor: 'rgba(0, 0, 0, 0.1)',
                      borderWidth: 1,
                    }
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false, 
                      },
                      ticks: {
                        color: '#555',
                        font: {
                          size: 14,
                        },
                      },
                    },
                    y: {
                      grid: {
                        color: '#e5e5e5', 
                      },
                      ticks: {
                        color: '#555',
                        font: {
                          size: 14,
                        },
                      },
                    },
                  },
                }}
              />
              <button
                onClick={() => exportToExcel(variable)}
                style={{
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: '#0C2840',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  width: '100%',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Exportar datos (xls)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Graficas;
