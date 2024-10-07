import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import * as XLSX from 'xlsx';  // Para exportar a Excel
import { ObtenerPost } from '../hooks/Conexion';
import { borrarSesion, getToken } from '../utils/SessionUtil';
import Filtro from './Filtro';
import mensajes from '../utils/Mensajes';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';  // Librería de Bootstrap para mostrar un spinner

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const chartColors = ['#362FD9', '#1AACAC', '#DB005B', '#19A7CE', '#DF2E38', '#8DCBE6'];

function Graficas({ filtro }) {  // Recibimos el filtro como prop desde Principal
  const [datosGrafica, setDatosGrafica] = useState([]);  // Estado para los datos que vienen del backend
  const [loading, setLoading] = useState(false);  // Indicador de carga
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!filtro || (!filtro.fechaInicio && !filtro.mesSeleccionado && !filtro.tipo)) {
        setDatosGrafica([]);
        return;
      }

      setLoading(true);

      try {
        let body;
        let url;

        // Caso para "mesAnio"
        if (filtro.tipo === "mesAnio") {
          url = '/listar/medidas/mes';
          body = {
            mes: filtro.mesSeleccionado,
            anio: filtro.anioSeleccionado,
          };
        }
        else if (filtro.tipo === "rangoFechas") {
          url = '/listar/medidas/diaria';
          body = {
            fechaInicio: new Date(filtro.fechaInicio).toISOString(),
            fechaFin: new Date(filtro.fechaFin).toISOString(),
          };
        }
        else if (["15min", "30min", "hora", "diaria"].includes(filtro.tipo)) {
          url = '/listar/todasMedidas/escala';
          body = {
            escalaDeTiempo: filtro.tipo
          };
        }
        else if (filtro.tipo === "mensual") {
          url = '/listar/temperatura/mensual';
          body = {
            escalaDeTiempo: filtro.tipo
          };
        }

        if (!url) {
          console.error("NO EXISTE EL TIPO DE MEDIDA");
          return;
        }

        const info = await ObtenerPost(getToken(), url, body);

        if (info.code !== 200) {
          setDatosGrafica([]);
          mensajes(info.msg, 'info');
          if (info.msg === 'Acceso denegado. Token ha expirado') {
            borrarSesion();
            navigate("/login");
          }
        } else {
          setDatosGrafica(info.info);
          console.log('Datos recibidos:', info.info);
        }
      } catch (error) {
        setDatosGrafica([]);
        mensajes(error.message, 'info');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filtro, navigate]);

  const medidasDisponibles = datosGrafica.length > 0 ? Object.keys(datosGrafica[0].medidas) : [];

  const prepararDatosPorMedida = (medida, colorIndex) => {
    let labels;

    if (filtro.tipo === "mensual") {
      labels = datosGrafica.map(item => item.mes);  // Para datos mensuales
    } else if (filtro.tipo === "rangoFechas" || filtro.tipo === "mesAnio") {
      labels = datosGrafica.map(item => item.dia);  
    } else {
      labels = datosGrafica.map(item => item.hora); 
    }

    return {
      labels,
      datasets: [
        {
          label: `${medida}`,
          data: datosGrafica.map(item => item.medidas[medida]),  // Usamos los datos de medidas para graficar
          borderColor: chartColors[colorIndex % chartColors.length],
          backgroundColor: `${chartColors[colorIndex % chartColors.length]}88`,
          borderWidth: 2,
        }
      ]
    };
  };

  // Función para exportar datos a Excel
  const exportToExcel = (medida) => {
    // Crear una hoja de cálculo vacía
    const workbook = XLSX.utils.book_new();

    // Crear los datos que quieres agregar al Excel
    const datos = datosGrafica.map((item) => ({
      Periodo: filtro.tipo === "mensual" ? item.mes : (filtro.tipo === "rangoFechas" || filtro.tipo === "mesAnio") ? item.dia : item.hora,
      [medida]: item.medidas[medida],
    }));

    // Encabezados de tu tabla
    const encabezado = [
      ["Universidad Nacional de Loja"], // Fila con el título superior
      ["Datos de Microcuenca Norec"],   // Fila con la descripción del archivo
      [],                              // Fila en blanco para separación
      ["Periodo", medida]              // Fila con los títulos de las columnas
    ];

    // Convertir los datos a hoja de cálculo, con encabezados
    const worksheet = XLSX.utils.aoa_to_sheet(encabezado); // Agrega el encabezado y el formato inicial

    // Agregar los datos a la hoja de cálculo
    XLSX.utils.sheet_add_json(worksheet, datos, { origin: "A5", skipHeader: true });  // Agregar los datos debajo del encabezado en la fila 5

    // Ajustar el ancho de las columnas para que el contenido sea legible
    const wscols = [
      { wch: 15 }, // Ancho de la columna de "Periodo"
      { wch: 10 }  // Ancho de la columna de la medida
    ];
    worksheet['!cols'] = wscols;

    // Aplicar estilos en negrita a los títulos
    worksheet['A4'].s = { font: { bold: true } }; // 'Periodo'
    worksheet['B4'].s = { font: { bold: true } }; // El nombre de la medida

    // Agregar la hoja de trabajo al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, medida);

    // Guardar el archivo Excel
    XLSX.writeFile(workbook, `${medida}.xlsx`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', flexDirection: 'column' }}>
        <Spinner animation="border" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="sr-only"></span>
        </Spinner>
        <p className="mt-3">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid" custom-container-graficas>

      <div className="row">
        {medidasDisponibles.map((medida, index) => (
          <div className="col-lg-6 col-md-6 mb-4" key={index}>
            <div style={{
              padding: '20px',
              border: '1px solid #ffffff',
              borderRadius: '8px',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              background: '#ffffff',
            }}>

              {medida === 'Lluvia' ? (
                <Bar
                  data={prepararDatosPorMedida(medida, index)}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                      },
                      title: {
                        display: true,
                        text: `Gráfica de ${medida}`,
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
              ) : (
                <Line
                  data={prepararDatosPorMedida(medida, index)}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        display: true,
                      },
                      title: {
                        display: true,
                        text: `Gráfica de ${medida}`,
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
              )}

              <button
                onClick={() => exportToExcel(medida)}
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
