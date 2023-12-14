import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '1000px',
  height: '1000px'
};

const MapComponent = ({ onMarkerDragEnd, latitud, longitud }) => {
    const initialLat = latitud ?? -34.397;
    const initialLng = longitud ?? 150.644;
  
    const [markerPosition, setMarkerPosition] = useState({ lat: initialLat, lng: initialLng });

    useEffect(() => {
        setMarkerPosition({ lat: parseFloat(latitud), lng: parseFloat(longitud) });
      }, [latitud, longitud]);
      

  const onDragEnd = (e) => {
    const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    setMarkerPosition(newPosition);
    onMarkerDragEnd(newPosition);
  };

  return (
    <LoadScript googleMapsApiKey="AIzaSyArrTAZutsOGQ0qEXumdsKfqz6sryLq3bw">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={20}
      >
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;

