import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import * as XLSX from 'xlsx';  // Para exportar a Excel
import { ObtenerPost } from '../hooks/Conexion';
import { borrarSesion, getToken } from '../utils/SessionUtil';
import Filtro from './Filtro'; 
import mensajes from '../utils/Mensajes';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const chartColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

function Graficas() {
  const [filtro, setFiltro] = useState(null);  // Estado para almacenar los datos del filtro
  const [datosGrafica, setDatosGrafica] = useState([]);  // Estado para los datos que vienen del backend
  const [loading, setLoading] = useState(false);  // Indicador de carga
  const [progress, setProgress] = useState(0);  // Estado de progreso de carga
  const navigate = useNavigate();

  // Función para manejar el filtro seleccionado
  const manejarFiltro = (datosFiltro) => {
    setFiltro(datosFiltro);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!filtro || (!filtro.fechaInicio && !filtro.mesSeleccionado)) {
        setDatosGrafica([]);  // Limpiar datos cuando no hay filtro
        return;
      }
  
      setLoading(true);  
      setProgress(0); 
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 80 ? prev + 10 : prev));
      }, 200);
  
      try {
        let body;
        let url;
  
        if (filtro.tipo === "mesAnio") {
          // Filtro por mes
          url = '/listar/medidas/mes';
          body = {
            mes: filtro.mesSeleccionado,
            anio: filtro.anioSeleccionado 
          };
          console.log("Datos enviados al backend:", body);
        } else {
          url = '/listar/medidas/diaria';
          body = {
            fechaInicio: new Date(filtro.fechaInicio).toISOString(), 
            fechaFin: new Date(filtro.fechaFin).toISOString(), 
          };
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
        }
        clearInterval(interval);
        setProgress(100); 
      } catch (error) {
        setDatosGrafica([]);
        mensajes(error.message, 'info');
      } finally {
        clearInterval(interval); 
        setLoading(false); 
      }
    };
  
    fetchData();
  }, [filtro, navigate]);  
  

  const renderProgressBar = () => (
    <div className="progress-container">
      <div className="modern-progress-bar">
        <div
          className="progress-bar progress-bar-striped progress-bar-animated bg-info"
          role="progressbar"
          style={{ width: `${progress}%` }}
          aria-valuenow={progress}
          aria-valuemin="0"
          aria-valuemax="100"
        ></div>
      </div>
      <p>Cargando datos...</p>
    </div>
  );

  const medidasDisponibles = datosGrafica.length > 0 ? Object.keys(datosGrafica[0].medidas) : [];

  // Preparar datos para mostrar en gráficas
  const prepararDatosPorMedida = (medida, colorIndex) => {
    let labels = datosGrafica.map(item => filtro.mes ? item.mes : item.dia); 
    return {
      labels,
      datasets: [
        {
          label: `${medida}`,
          data: datosGrafica.map(item => item.medidas[medida]),
          borderColor: chartColors[colorIndex % chartColors.length],
          backgroundColor: `${chartColors[colorIndex % chartColors.length]}88`,
          borderWidth: 2,
        }
      ]
    };
  };

  // Función para exportar datos a Excel
  const exportToExcel = (medida) => {
    const worksheet = XLSX.utils.json_to_sheet(
      datosGrafica.map((item) => ({
        Periodo: filtro.mes ? item.mes : item.dia,  
        [medida]: item.medidas[medida], 
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, medida);
    XLSX.writeFile(workbook, `${medida}.xlsx`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        {renderProgressBar()}
      </div>
    );
  }

  console.log("MEDIDAS AQUI", medidasDisponibles);
  

  return (
    <div className="container-fluid">
      <Filtro onFiltrar={manejarFiltro} /> 
      <div className="row">
        {medidasDisponibles.map((medida, index) => (
          <div className="col-lg-6 col-md-6 mb-4" key={index}>
            <div style={{
              padding: '20px',
              border: '1px solid #ffffff',
              borderRadius: '10px',
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
