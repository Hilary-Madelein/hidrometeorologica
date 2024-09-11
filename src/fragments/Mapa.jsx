import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../css/Mapa_Style.css';
import '../css/Principal_Style.css';

function Mapa() {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFkZWxlaW4iLCJhIjoiY20wd2w4N3VqMDMyYzJqb2ZlNXF5ZnhiZCJ9.i3tWgoA_5CQmQmZyt2yjhg';
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-streets-v12',
      center: [-79.2, -4.0],  // Coordenadas de referencia
      zoom: 12,
    });

    // Añadir controles de navegación (zoom y rotación)
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

    setMap(mapInstance);
    
    // Limpiar el mapa cuando se desmonte el componente
    return () => mapInstance.remove();
  }, []);

  return (
    <div className="map-container" ref={mapContainerRef} />  // Añadimos clases para manejar el tamaño
  );
}

export default Mapa;
