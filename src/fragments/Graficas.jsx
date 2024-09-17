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

    worksheet['!cols'] = [
      { wch: 20 },
      { wch: 20 },
    ]

    const headerStyle = {
      fill: { fgColor: { rgb: "0C2840" } },
      font: { sz: 14, bold: true },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" }
      }

    }

    worksheet['A1'].s = headerStyle;
    worksheet['A2'].s = headerStyle;
    worksheet['A3'].s = headerStyle;
    worksheet['A4'].s = headerStyle;
    worksheet['A5'].s = headerStyle;
    worksheet['B1'].s = headerStyle;
    worksheet['B2'].s = headerStyle;
    worksheet['B3'].s = headerStyle;
    worksheet['B4'].s = headerStyle;
    worksheet['B5'].s = headerStyle;

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
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16" style={{marginRight:'5px', color: '#ffff'}}>
                  <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM7.86 14.841a1.13 1.13 0 0 0 .401.823q.195.162.479.252.284.091.665.091.507 0 .858-.158.355-.158.54-.44a1.17 1.17 0 0 0 .187-.656q0-.336-.135-.56a1 1 0 0 0-.375-.357 2 2 0 0 0-.565-.21l-.621-.144a1 1 0 0 1-.405-.176.37.37 0 0 1-.143-.299q0-.234.184-.384.188-.152.513-.152.214 0 .37.068a.6.6 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.1 1.1 0 0 0-.199-.566 1.2 1.2 0 0 0-.5-.41 1.8 1.8 0 0 0-.78-.152q-.44 0-.777.15-.336.149-.527.421-.19.273-.19.639 0 .302.123.524t.351.367q.229.143.54.213l.618.144q.31.073.462.193a.39.39 0 0 1 .153.326.5.5 0 0 1-.085.29.56.56 0 0 1-.255.193q-.168.07-.413.07-.176 0-.32-.04a.8.8 0 0 1-.249-.115.58.58 0 0 1-.255-.384zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036zm1.923 3.325h1.697v.674H5.266v-3.999h.791zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036z" />
                </svg>
                Exportar datos (xlsx)
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Graficas;
